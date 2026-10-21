/**
 * Health check for operators. Fails when a finished lottery round is still not
 * settled some time after it ended, or a Guess winner is still unpaid (usually
 * a stopped crank), or when the crank's wallet runs low. Read-only: it needs
 * no keypair.
 *
 *   bun run monitor
 *   bun run monitor --grace 15 --crank <crank address> --min-balance 0.05
 *
 * Exits with 1 when something needs attention. With ALERT_WEBHOOK_URL set, it
 * also posts the problems there (Slack and Discord webhooks both accept it).
 */
import { parseArgs } from 'node:util';

import { address, createSolanaRpc } from '@solana/kit';
import { fetchSysvarClock } from '@solana/sysvars';
import {
  fetchMaybeConfig,
  fetchRounds,
  findConfigPda,
  isLottery,
  lamportsToSol,
  periodEnd,
  RoundStatus,
} from '@solucky/client';

import { log, PROGRAM_ADDRESS, roundLabel, RPC_URL } from './lib';
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

const rpc = createSolanaRpc(RPC_URL);
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
