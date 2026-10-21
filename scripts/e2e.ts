/**
 * End-to-end check on a local Surfpool network (https://surfpool.run), whose
 * clock can be moved forward. It never runs against a remote cluster.
 *
 *   surfpool start --offline --no-deploy
 *   SOLANA_RPC_URL=http://127.0.0.1:8899 bun run e2e
 *
 * Loads the program from `target/deploy` if needed. Three fresh players buy
 * tickets in the daily and hourly lotteries and guesses in Guess the number,
 * the clock jumps past midnight UTC, the crank settles everything, and the
 * script checks the draws, the 80% payouts, the fees, the carries and the rent
 * refund. CI runs it on every push.
 */
import { type Address, fetchEncodedAccount, generateKeyPairSigner, type TransactionSigner } from '@solana/kit';
import { fetchSysvarClock } from '@solana/sysvars';
import {
  carryFor,
  closestNumber,
  computeRandomness,
  countryToBytes,
  DAY_MS,
  decodeRound,
  describeError,
  drawnNumber,
  feeFor,
  fetchRoundTickets,
  findRoundPda,
  findTicketPda,
  GameKind,
  getCloseTicketInstruction,
  guessOutcome,
  type LotteryKind,
  periodOf,
  prizeFor,
  roundNumbers,
  RoundStatus,
} from '@solucky/client';

import { clientFor, gamePda, GAMES, log, PROGRAM_ADDRESS, roundLabel } from './lib';
import { settleRounds } from './settle';
import { assertLocalRpc, fund, localOperator, prepareLocalnet, SOL, timeTravel } from './surfnet';

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`E2E failed: ${message}`);
  log(`✔ ${message}`);
}

assertLocalRpc();
const operator = await localOperator();
const admin = clientFor(operator);
const balance = async (address: Address) => (await admin.rpc.getBalance(address).send()).value;
const roundPda = (kind: number, period: number) =>
  findRoundPda({ kind, period }, { programAddress: PROGRAM_ADDRESS }).then(([address]) => address);
const fetchGame = async (kind: number) => (await admin.solucky.accounts.game.fetch(await gamePda(kind))).data;
const fetchRound = async (address: Address) => {
  const account = await fetchEncodedAccount(admin.rpc, address);
  if (!account.exists) throw new Error(`E2E failed: no round at ${address}`);
  return { ...decodeRound(account).data, numbers: roundNumbers(account.data) };
};
const setMaxNumber = (maxNumber: number) =>
  admin.solucky.instructions
    .updateConfig({ authority: operator, authorityArg: null, treasury: null, maxNumber, paused: null })
    .sendTransaction();

// 1. The program, its config and the three games are in place.
const config = await prepareLocalnet(operator);
const { treasury, maxNumber } = config.data;
const games = await Promise.all(GAMES.map(fetchGame));
check(
  games.every((g) => g.ticketPrice > 0n),
  'program, config and the three games are set up',
);

// 2. Three players buy tickets in the lotteries on sale.
const players: TransactionSigner[] = await Promise.all([1, 2, 3].map(() => generateKeyPairSigner()));
const [alice, bob, carol] = players as [TransactionSigner, TransactionSigner, TransactionSigner];
await Promise.all(players.map((p) => fund(admin, p.address, 5n * SOL)));
const now = Number((await fetchSysvarClock(admin.rpc)).unixTimestamp) * 1000;

function buy(player: TransactionSigner, kind: number, period: number, number: number, country: string | null = 'ES') {
  return clientFor(player)
    .solucky.instructions.buyTicket({
      buyer: player,
      kind,
      period,
      number,
      country: countryToBytes(country),
      maxPrice: games[kind]!.ticketPrice,
    })
    .sendTransaction();
}

const base = Math.floor(Math.random() * (maxNumber - 2_000));
const lotteries = [
  { kind: GameKind.Daily as LotteryKind, numbers: [7, 77, 42, 1_000] },
  { kind: GameKind.Hourly as LotteryKind, numbers: [3, 1_500] },
].map(({ kind, numbers }) => ({ kind, period: periodOf(kind, now), numbers: numbers.map((n) => base + n) }));

for (const lottery of lotteries) {
  const address = await roundPda(lottery.kind, lottery.period);
  const before = await admin.solucky.accounts.round.fetchMaybe(address);
  const soldBefore = before.exists ? before.data.ticketCount : 0;
  log(`playing ${roundLabel(lottery)} (${soldBefore} tickets already sold)`);
  for (const [i, number] of lottery.numbers.entries()) {
    await buy(players[i % players.length]!, lottery.kind, lottery.period, number, i === 3 ? null : 'JP');
  }
  const round = await fetchRound(address);
  check(round.ticketCount === soldBefore + lottery.numbers.length, `${roundLabel(lottery)}: the tickets were added`);
  check(
    round.pot === round.ticketPrice * BigInt(round.ticketCount),
    `${roundLabel(lottery)}: the pot holds every ticket price`,
  );
  check(
    round.numbers.length === round.ticketCount && round.numbers.every((n, i) => i === 0 || round.numbers[i - 1]! < n),
    `${roundLabel(lottery)}: the round keeps its numbers sorted`,
  );
}

const daily = lotteries[0]!;
const duplicate = await buy(bob, daily.kind, daily.period, daily.numbers[0]!).then(
  () => null,
  (error: unknown) => describeError(error),
);
check(duplicate?.startsWith('Someone already holds this number'), 'a number can only be sold once per round');

// 3. Guess the number. In a fresh round with numbers 0 and 1 only, two
// guesses cover every number, so the check must find it. Only the authority
// can narrow the numbers, and only a round that is not open yet takes it.
const guessPeriod = games[GameKind.Guess]!.currentRound;
const guessAddress = await roundPda(GameKind.Guess, guessPeriod);
const forceHit =
  config.data.authority === operator.address && !(await admin.solucky.accounts.round.fetchMaybe(guessAddress)).exists;
if (forceHit) {
  await setMaxNumber(1);
  await buy(alice, GameKind.Guess, guessPeriod, 0);
  await buy(carol, GameKind.Guess, guessPeriod, 1);
  await setMaxNumber(maxNumber);
} else {
  log(`guess ${guessPeriod}: checking one guess without forcing a hit`);
  await buy(alice, GameKind.Guess, guessPeriod, base + 5);
}

// 4. Jump just past midnight UTC and settle everything with the crank.
await timeTravel((periodOf(GameKind.Daily, now) + 1) * DAY_MS + 2_000);
const carriesBefore = (await Promise.all(GAMES.map(fetchGame))).map((g) => g.carry);
const treasuryBefore = await balance(treasury);
const balancesBefore = await Promise.all(players.map((p) => balance(p.address)));

for (let pass = 0; ; pass++) {
  if ((await settleRounds(admin)) === 0) break;
  if (pass > 40) throw new Error('E2E failed: the rounds did not settle');
  await Bun.sleep(1_000);
}

// 5. The closest number won 80% of each lottery pot, and anyone can redo the draw.
const won = new Map<Address, bigint>();
let fees = 0n;
for (const lottery of lotteries) {
  const label = roundLabel(lottery);
  const address = await roundPda(lottery.kind, lottery.period);
  const round = await fetchRound(address);
  check(round.status === RoundStatus.Settled, `${label}: settled`);
  const pot = round.ticketPrice * BigInt(round.ticketCount) + carriesBefore[lottery.kind]!;
  check(round.pot === pot, `${label}: the pot took the carry of the game's last round`);
  check(
    round.payout === prizeFor(pot) && round.fee === feeFor(pot, round.feeBps),
    `${label}: 80% to the winner, the fee to the house`,
  );
  check(
    (await fetchGame(lottery.kind)).carry === carryFor(pot, round.feeBps),
    `${label}: the rest carries over to the next round`,
  );
  const randomness = await computeRandomness({
    entropy: round.entropy,
    slotHash: round.slotHash,
    slot: round.drawSlot,
    round: address,
  });
  check(Buffer.from(randomness).equals(Buffer.from(round.randomness)), `${label}: the draw recomputes off-chain`);
  check(drawnNumber(randomness, round.maxNumber) === round.drawnNumber, `${label}: the drawn number matches`);
  check(closestNumber(round.numbers, round.drawnNumber) === round.winningNumber, `${label}: the closest number won`);
  const [ticket] = await findTicketPda(
    { round: address, number: round.winningNumber },
    { programAddress: PROGRAM_ADDRESS },
  );
  check(
    round.winner === (await admin.solucky.accounts.ticket.fetch(ticket)).data.owner,
    `${label}: the winner is recorded`,
  );
  won.set(round.winner, (won.get(round.winner) ?? 0n) + round.payout);
  fees += round.fee;
}

// 6. Guess the number: the batch check matches, and the next round is on sale.
const guess = await fetchRound(guessAddress);
const guessLabel = roundLabel({ kind: GameKind.Guess, period: guessPeriod });
if (forceHit) {
  check(guess.status === RoundStatus.Settled, `${guessLabel}: a guess found the number`);
  const randomness = await computeRandomness({
    entropy: guess.entropy,
    slotHash: guess.slotHash,
    slot: guess.drawSlot,
    round: guessAddress,
  });
  check(
    guessOutcome(randomness, guess.checked, guess.sealedCount, guess.maxNumber) === guess.winningIndex,
    `${guessLabel}: the check recomputes off-chain`,
  );
  const pot = 2n * guess.ticketPrice + carriesBefore[GameKind.Guess]!;
  check(guess.pot === pot && guess.payout === prizeFor(pot), `${guessLabel}: 80% of the pot to the winner`);
  check((await fetchGame(GameKind.Guess)).currentRound === guessPeriod + 1, `${guessLabel}: the next round is on sale`);
  won.set(guess.winner, (won.get(guess.winner) ?? 0n) + guess.payout);
  fees += guess.fee;
} else {
  check(
    guess.status === RoundStatus.Settled || guess.checked === guess.ticketCount,
    `${guessLabel}: every guess was checked`,
  );
}

for (const [i, player] of players.entries()) {
  const delta = (await balance(player.address)) - balancesBefore[i]!;
  check(delta === (won.get(player.address) ?? 0n), `player ${i + 1} received exactly their prizes`);
}
check((await balance(treasury)) - treasuryBefore === fees, 'the treasury received the fees');

// 7. Players get their ticket rent back.
const dailyAddress = await roundPda(daily.kind, daily.period);
const aliceTickets = (await fetchRoundTickets(admin.rpc, dailyAddress, PROGRAM_ADDRESS)).filter(
  (t) => t.data.owner === alice.address,
);
const aliceBefore = await balance(alice.address);
await clientFor(alice).sendTransaction(
  aliceTickets.map((t) =>
    getCloseTicketInstruction(
      { owner: alice, round: dailyAddress, ticket: t.address },
      { programAddress: PROGRAM_ADDRESS },
    ),
  ),
);
const refunded = aliceTickets.reduce((n, t) => n + t.lamports, 0n);
check((await balance(alice.address)) > aliceBefore + refunded - 100_000n, 'ticket rent comes back to its owner');

log(`E2E passed: ${lotteries.map(roundLabel).join(', ')} and ${guessLabel}.`);
