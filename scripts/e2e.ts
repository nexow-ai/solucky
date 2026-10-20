/**
 * End-to-end check on a local Surfpool network (https://surfpool.run), whose
 * clock can be moved forward. It never runs against a remote cluster.
 *
 *   surfpool start --offline --no-deploy
 *   SOLANA_RPC_URL=http://127.0.0.1:8899 bun run e2e
 *
 * Loads the program from `target/deploy` if needed, then three fresh players
 * buy tickets, the clock jumps past midnight UTC, the crank settles the round,
 * and the script checks the payout, the fee, the draw and the rent refund.
 * CI runs it on every push.
 */
import { type Address, generateKeyPairSigner, type TransactionSigner } from '@solana/kit';
import { fetchSysvarClock } from '@solana/sysvars';
import {
  computeRandomness,
  countryToBytes,
  dayOf,
  describeError,
  feeFor,
  fetchRoundTickets,
  findRoundPda,
  formatDay,
  getCloseTicketInstruction,
  RoundStatus,
  winningIndex,
} from '@solucky/client';

import { clientFor, log, PROGRAM_ADDRESS } from './lib';
import { settleFinishedRounds } from './settle';
import { assertLocalRpc, fund, localOperator, prepareLocalnet, SOL, timeTravel } from './surfnet';

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`E2E failed: ${message}`);
  log(`✔ ${message}`);
}

assertLocalRpc();
const admin = clientFor(await localOperator());
const balance = async (address: Address) => (await admin.rpc.getBalance(address).send()).value;

// 1. The program and its config are in place.
const config = await prepareLocalnet(admin.payer);
check(config.exists, 'program and config are set up');
const { ticketPrice, treasury } = config.data;

// 2. Three players buy four tickets in the cluster's current day.
const players: TransactionSigner[] = await Promise.all([1, 2, 3].map(() => generateKeyPairSigner()));
await Promise.all(players.map((p) => fund(admin, p.address, 5n * SOL)));
const clock = await fetchSysvarClock(admin.rpc);
const day = dayOf(Number(clock.unixTimestamp) * 1000);
const [roundAddress] = await findRoundPda({ day }, { programAddress: PROGRAM_ADDRESS });
const before = await admin.solucky.accounts.round.fetchMaybe(roundAddress);
const soldBefore = before.exists ? before.data.ticketCount : 0;
log(`playing round ${formatDay(day)} (${soldBefore} tickets already sold)`);

const base = Math.floor(Math.random() * 900_000_000);
const purchases: [number, number, string | null][] = [
  [0, base + 7, 'ES'],
  [0, base + 77, 'ES'],
  [1, base + 42, 'JP'],
  [2, base + 1_000, null],
];
for (const [player, number, country] of purchases) {
  await clientFor(players[player]!)
    .solucky.instructions.buyTicket({
      buyer: players[player]!,
      day,
      number,
      country: countryToBytes(country),
      maxPrice: ticketPrice,
    })
    .sendTransaction();
}
const round = await admin.solucky.accounts.round.fetch(roundAddress);
check(round.data.ticketCount === soldBefore + 4, 'four tickets were added to the round');
check(round.data.pot === round.data.ticketPrice * BigInt(round.data.ticketCount), 'the pot holds every ticket price');

const duplicate = await clientFor(players[1]!)
  .solucky.instructions.buyTicket({
    buyer: players[1]!,
    day,
    number: base + 7,
    country: countryToBytes('FR'),
    maxPrice: ticketPrice,
  })
  .sendTransaction()
  .then(
    () => null,
    (error: unknown) => describeError(error),
  );
check(duplicate?.startsWith('Someone already holds this number'), 'a number can only be sold once per day');

// 3. Jump just past midnight UTC and settle with the crank.
await timeTravel((day + 1) * 86_400_000 + 2_000);
const treasuryBefore = await balance(treasury);
const owners = new Map(
  (await fetchRoundTickets(admin.rpc, roundAddress, PROGRAM_ADDRESS)).map((t) => [t.data.index, t.data.owner]),
);
const ownerBalances = new Map(
  await Promise.all([...new Set(owners.values())].map(async (o) => [o, await balance(o)] as const)),
);

for (let pass = 0; ; pass++) {
  if ((await settleFinishedRounds(admin)) === 0) break;
  if (pass > 30) throw new Error('E2E failed: the round did not settle');
  await Bun.sleep(1_000);
}

// 4. The winner got the pot minus the fee, and anyone can redo the draw.
const settled = await admin.solucky.accounts.round.fetch(roundAddress);
check(settled.data.status === RoundStatus.Settled, 'the round is settled');
const fee = feeFor(settled.data.pot, settled.data.feeBps);
check(settled.data.payout === settled.data.pot - fee && settled.data.fee === fee, 'payout and fee add up to the pot');
const randomness = await computeRandomness({
  entropy: settled.data.entropy,
  slotHash: settled.data.slotHash,
  slot: settled.data.drawSlot,
  round: roundAddress,
});
check(Buffer.from(randomness).equals(Buffer.from(settled.data.randomness)), 'the draw recomputes off-chain');
check(winningIndex(randomness, settled.data.ticketCount) === settled.data.winningIndex, 'the winning index matches');
const winner = owners.get(settled.data.winningIndex)!;
check(settled.data.winner === winner, 'the winning ticket owner is recorded');
check((await balance(winner)) - ownerBalances.get(winner)! === settled.data.payout, 'the winner received the payout');
check((await balance(treasury)) - treasuryBefore === fee, 'the treasury received the fee');
log(`winner ${winner} took ◎${Number(settled.data.payout) / 1e9} with number ${settled.data.winningNumber}`);

// 5. Players get their ticket rent back.
const alice = players[0]!;
const aliceTickets = (await fetchRoundTickets(admin.rpc, roundAddress, PROGRAM_ADDRESS)).filter(
  (t) => t.data.owner === alice.address,
);
const aliceBefore = await balance(alice.address);
await clientFor(alice).sendTransaction(
  aliceTickets.map((t) =>
    getCloseTicketInstruction(
      { owner: alice, round: roundAddress, ticket: t.address },
      { programAddress: PROGRAM_ADDRESS },
    ),
  ),
);
const refunded = aliceTickets.reduce((n, t) => n + t.lamports, 0n);
check((await balance(alice.address)) > aliceBefore + refunded - 100_000n, 'ticket rent comes back to its owner');

log(`E2E passed for round ${formatDay(day)} (ticket ◎${Number(ticketPrice) / 1e9}).`);
