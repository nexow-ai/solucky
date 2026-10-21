/**
 * Health check for operators. Fails when a finished round is still not settled
 * some time after midnight UTC (usually a stopped crank), or when the crank's
 * wallet runs low. Read-only: it needs no keypair.
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
  dayEnd,
  dayOf,
  fetchMaybeConfig,
  fetchRounds,
  findConfigPda,
  formatDay,
  lamportsToSol,
  RoundStatus,
} from '@solucky/client';

import { log, PROGRAM_ADDRESS, RPC_URL } from './lib';
import { needsWork } from './settle';

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
  fetchRounds(rpc, PROGRAM_ADDRESS),
  fetchMaybeConfig(rpc, configAddress),
]);
const now = Number(clock.unixTimestamp) * 1000;
const today = dayOf(now);

if (!config.exists) {
  problems.push(`the program ${PROGRAM_ADDRESS} has no config on this cluster`);
} else if (config.data.paused) {
  log('note: ticket sales are paused');
}

for (const round of rounds) {
  if (round.data.day >= today || !needsWork(round.data)) continue;
  const late = now - dayEnd(round.data.day).getTime();
  if (late > graceMs) {
    problems.push(
      `${formatDay(round.data.day)}: ${WAITING_FOR[round.data.status]} ${Math.round(late / 60_000)} min after midnight ` +
        `(pot ◎${lamportsToSol(round.data.pot)})`,
    );
  }
}

if (args.crank) {
  const { value } = await rpc.getBalance(address(args.crank), { commitment: 'confirmed' }).send();
  if (lamportsToSol(value) < Number(args['min-balance'])) {
    problems.push(`the crank ${args.crank} only has ◎${lamportsToSol(value)} left`);
  }
}

const todayRound = rounds.find((r) => r.data.day === today);
log(
  `${RPC_URL}: ${rounds.length} round(s) on-chain; today ${formatDay(today)} has ` +
    `${todayRound?.data.ticketCount ?? 0} ticket(s), ◎${lamportsToSol(todayRound?.data.pot ?? 0n)} pot`,
);

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
