/**
 * Health check for operators. Fails when a finished lottery round is still not
 * settled some time after it ended, or a Guess winner is still unpaid (usually
 * a stopped crank), when the crank's wallet runs low, or when buying a ticket
 * fails in simulation (a broken program, client or config: what players would
 * hit first). Read-only: it needs no keypair and simulates without signatures.
 *
 *   bun run monitor
 *   bun run monitor --grace 15 --crank <crank address> --min-balance 0.05
 *
 * Exits with 1 when something needs attention. With ALERT_WEBHOOK_URL set, it
 * also posts the problems there (Slack and Discord webhooks both accept it).
 */
import { parseArgs } from 'node:util';

import {
  type Address,
  address,
  appendTransactionMessageInstruction,
  compileTransaction,
  createNoopSigner,
  createSolanaRpc,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  getSolanaErrorFromTransactionError,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit';
import { fetchSysvarClock } from '@solana/sysvars';
import {
  countryToBytes,
  describeError,
  fetchMaybeConfig,
  fetchMaybeGame,
  fetchRounds,
  findConfigPda,
  GAME_SLUGS,
  getBuyTicketInstructionAsync,
  isLottery,
  lamportsToSol,
  periodEnd,
  periodOf,
  RoundStatus,
} from '@solucky/client';

import { gamePda, GAMES, log, PROGRAM_ADDRESS, roundLabel, RPC_CONFIG, RPC_URL } from './lib';
import { isDue } from './settle';

const { values: args } = parseArgs({
  options: {
    grace: { type: 'string', default: '15' },
    crank: { type: 'string' },
    'min-balance': { type: 'string', default: '0.05' },
  },
});

const WAITING_FOR: Record<RoundStatus, string> = {
  [RoundStatus.Open]: 'not closed',
  [RoundStatus.Closed]: 'not drawn',
  [RoundStatus.Drawn]: 'winner not paid',
  [RoundStatus.Settled]: 'fee not collected',
};

const rpc = createSolanaRpc(RPC_URL, RPC_CONFIG);
const graceMs = Number(args.grace) * 60_000;
const problems: string[] = [];

const [configAddress] = await findConfigPda({ programAddress: PROGRAM_ADDRESS });
const [clock, rounds, config] = await Promise.all([
  fetchSysvarClock(rpc, { commitment: 'confirmed' }),
  fetchRounds(rpc, undefined, PROGRAM_ADDRESS),
  fetchMaybeConfig(rpc, configAddress),
]);
const now = Number(clock.unixTimestamp) * 1000;

if (!config.exists) {
  problems.push(`the program ${PROGRAM_ADDRESS} has no config on this cluster`);
} else if (config.data.paused) {
  log('note: ticket sales are paused');
}

for (const { data: round } of rounds) {
  if (!isDue(round, now)) continue;
  const pot = `pot ◎${lamportsToSol(round.pot)}`;
  if (isLottery(round.kind)) {
    const late = now - periodEnd(round.kind, round.period).getTime();
    if (late > graceMs) {
      problems.push(
        `${roundLabel(round)}: ${WAITING_FOR[round.status]} ${Math.round(late / 60_000)} min after it ended (${pot})`,
      );
    }
  } else if (round.status === RoundStatus.Drawn || round.status === RoundStatus.Settled) {
    // Guess rounds have no end time, but the crank pays a winner seconds
    // after the draw. ponytail: a check that lands mid-crank alerts once.
    problems.push(`${roundLabel(round)}: ${WAITING_FOR[round.status]} (${pot})`);
  }
}

/**
 * Simulates buying a random number in each open game, paid by `payer` (the
 * config's authority: an account that exists and holds SOL). Nothing is signed
 * or sent.
 */
async function checkBuying(payer: Address) {
  for (const kind of GAMES) {
    const game = await fetchMaybeGame(rpc, await gamePda(kind));
    if (!game.exists) continue;
    const period = isLottery(kind) ? periodOf(kind, now) : game.data.currentRound;
    const instruction = await getBuyTicketInstructionAsync(
      {
        buyer: createNoopSigner(payer),
        kind,
        period,
        number: Math.floor(Math.random() * ((config.exists ? config.data.maxNumber : 0) + 1)),
        country: countryToBytes(null),
        maxPrice: game.data.ticketPrice,
      },
      { programAddress: PROGRAM_ADDRESS },
    );
    const { value: blockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send();
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (m) => setTransactionMessageFeePayer(payer, m),
      (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash, m),
      (m) => appendTransactionMessageInstruction(instruction, m),
    );
    const { value } = await rpc
      .simulateTransaction(getBase64EncodedWireTransaction(compileTransaction(message)), {
        encoding: 'base64',
        sigVerify: false,
        replaceRecentBlockhash: true,
        commitment: 'confirmed',
      })
      .send();
    if (value.err) {
      const reason = describeError(getSolanaErrorFromTransactionError(value.err as never));
      problems.push(`buying a ${GAME_SLUGS[kind]} ticket fails in simulation: ${reason}`);
    } else {
      log(`${GAME_SLUGS[kind]}: a ticket purchase simulates fine (${value.unitsConsumed} CU)`);
    }
  }
}

if (config.exists && !config.data.paused) await checkBuying(config.data.authority);

if (args.crank) {
  const { value } = await rpc.getBalance(address(args.crank), { commitment: 'confirmed' }).send();
  if (lamportsToSol(value) < Number(args['min-balance'])) {
    problems.push(`the crank ${args.crank} only has ◎${lamportsToSol(value)} left`);
  }
}

log(`${RPC_URL}: ${rounds.length} round(s) on-chain`);

if (problems.length === 0) {
  log('all good');
  process.exit(0);
}

for (const problem of problems) log(`PROBLEM ${problem}`);
const webhook = process.env.ALERT_WEBHOOK_URL;
if (webhook) {
  const text = `S☉Lucky needs attention (${RPC_URL}):\n${problems.map((p) => `• ${p}`).join('\n')}`;
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text, content: text }),
  });
  log(response.ok ? 'alert sent' : `alert failed: HTTP ${response.status}`);
}
process.exit(1);
