/**
 * Settling finished rounds: close → draw → pay the winner → collect the fee.
 * Every step is permissionless, so any funded keypair can run it; it only
 * pays network fees.
 */
import type { Account, Address } from '@solana/kit';
import { fetchSysvarClock } from '@solana/sysvars';
import {
  dayOf,
  describeError,
  fetchRounds,
  fetchTicketByIndex,
  findConfigPda,
  formatDay,
  isPinnedSlotExpired,
  lamportsToSol,
  type Round,
  RoundStatus,
} from '@solucky/client';

import { log, PROGRAM_ADDRESS, type SoluckyClient } from './lib';

/** A round needs work until its winner is paid and its fee collected. */
function needsWork(round: Round) {
  return round.status !== RoundStatus.Settled || !round.feeCollected;
}

/** Advances one round by a single step. Returns what it did, or why it waited. */
async function step(client: SoluckyClient, round: Account<Round>, slot: bigint, treasury: Address) {
  const { day, status, targetSlot, winningIndex } = round.data;
  const label = formatDay(day);
  const ix = client.solucky.instructions;

  switch (status) {
    case RoundStatus.Open: {
      await ix.closeRound({ round: round.address }).sendTransaction();
      return `${label}: closed`;
    }
    case RoundStatus.Closed: {
      if (slot <= targetSlot) return `${label}: waiting for slot ${targetSlot}`;
      if (await isPinnedSlotExpired(client.rpc, targetSlot)) {
        await ix.closeRound({ round: round.address }).sendTransaction();
        return `${label}: slot ${targetSlot} expired, pinned a new one`;
      }
      await ix.drawRound({ round: round.address }).sendTransaction();
      return `${label}: drawn`;
    }
    case RoundStatus.Drawn: {
      const ticket = await fetchTicketByIndex(client.rpc, round.address, winningIndex, PROGRAM_ADDRESS);
      if (!ticket) throw new Error(`winning ticket #${winningIndex} not found`);
      await ix.claimPrize({ round: round.address, ticket: ticket.address, owner: ticket.data.owner }).sendTransaction();
      return `${label}: paid the winner ${ticket.data.owner} (number ${ticket.data.number})`;
    }
    case RoundStatus.Settled: {
      await ix.collectFee({ round: round.address, treasury }).sendTransaction();
      return `${label}: collected the ◎${lamportsToSol(round.data.fee)} fee`;
    }
  }
}

/**
 * One pass over every finished round, one step each. Returns how many rounds
 * still needed work at the start of the pass (0 means everything is settled).
 */
export async function settleFinishedRounds(client: SoluckyClient): Promise<number> {
  // The program judges time by the cluster's clock, so this does too.
  const [rounds, clock, config] = await Promise.all([
    fetchRounds(client.rpc, PROGRAM_ADDRESS),
    fetchSysvarClock(client.rpc, { commitment: 'confirmed' }),
    findConfigPda({ programAddress: PROGRAM_ADDRESS }).then(([address]) =>
      client.solucky.accounts.config.fetch(address),
    ),
  ]);

  const today = dayOf(Number(clock.unixTimestamp) * 1000);
  let pending = 0;
  for (const round of rounds) {
    if (round.data.day >= today || !needsWork(round.data)) continue;
    pending++;
    try {
      const done = await step(client, round, clock.slot, config.data.treasury);
      if (done) log(done);
    } catch (error) {
      log(`${formatDay(round.data.day)}: ${describeError(error)}`);
    }
  }
  return pending;
}
