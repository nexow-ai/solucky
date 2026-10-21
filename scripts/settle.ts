/**
 * Settling rounds: close → draw → pay the winner → collect the fee, for the
 * finished lottery rounds, and seal → draw for the unchecked Guess guesses.
 * Every step is permissionless, so any funded keypair can run it; it only
 * pays network fees.
 */
import type { Account, Address } from '@solana/kit';
import { fetchSysvarClock } from '@solana/sysvars';
import {
  describeError,
  fetchRounds,
  fetchTicketByIndex,
  findConfigPda,
  findTicketPda,
  isLottery,
  isPinnedSlotExpired,
  lamportsToSol,
  periodOf,
  type Round,
  RoundStatus,
} from '@solucky/client';

import { gamePda, log, PROGRAM_ADDRESS, roundLabel, type SoluckyClient } from './lib';

/** A round needs work until its winner is paid and its fee collected. */
export function needsWork(round: Round) {
  return round.status !== RoundStatus.Settled || !round.feeCollected;
}

/** Whether the crank can move a round now: a finished lottery round, or a Guess round with unchecked guesses. */
export function isDue(round: Round, now: number) {
  if (!needsWork(round)) return false;
  if (isLottery(round.kind)) return round.period < periodOf(round.kind, now);
  return round.status !== RoundStatus.Open || round.ticketCount > round.checked;
}

async function winningTicket(client: SoluckyClient, round: Account<Round>) {
  const { kind, winningIndex, winningNumber } = round.data;
  if (isLottery(kind)) {
    const [address] = await findTicketPda(
      { round: round.address, number: winningNumber },
      { programAddress: PROGRAM_ADDRESS },
    );
    const ticket = await client.solucky.accounts.ticket.fetchMaybe(address);
    return ticket.exists ? ticket : null;
  }
  return fetchTicketByIndex(client.rpc, round.address, winningIndex, PROGRAM_ADDRESS);
}

/** Advances one round by a single step. Returns what it did, or why it waited. */
async function step(client: SoluckyClient, round: Account<Round>, slot: bigint, treasury: Address) {
  const { kind, status, targetSlot, ticketCount, checked } = round.data;
  const label = roundLabel(round.data);
  const ix = client.solucky.instructions;

  switch (status) {
    case RoundStatus.Open: {
      await ix.closeRound({ round: round.address }).sendTransaction();
      return isLottery(kind) ? `${label}: closed` : `${label}: sealed ${ticketCount - checked} guess(es)`;
    }
    case RoundStatus.Closed: {
      if (slot <= targetSlot) return `${label}: waiting for slot ${targetSlot}`;
      if (await isPinnedSlotExpired(client.rpc, targetSlot)) {
        await ix.closeRound({ round: round.address }).sendTransaction();
        return `${label}: slot ${targetSlot} expired, pinned a new one`;
      }
      await ix.drawRound({ round: round.address, game: await gamePda(kind) }).sendTransaction();
      const drawn = await client.solucky.accounts.round.fetch(round.address);
      if (drawn.data.status === RoundStatus.Open) return `${label}: no guess found the number`;
      return isLottery(kind)
        ? `${label}: drew ${drawn.data.drawnNumber}, closest number ${drawn.data.winningNumber}`
        : `${label}: guess #${drawn.data.winningIndex} found the number`;
    }
    case RoundStatus.Drawn: {
      const ticket = await winningTicket(client, round);
      if (!ticket) throw new Error('the winning ticket was not found');
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
 * One pass over every round the crank can move, one step each. Returns how
 * many rounds still needed work at the start of the pass (0 means everything
 * is settled and every guess checked).
 */
export async function settleRounds(client: SoluckyClient): Promise<number> {
  // The program judges time by the cluster's clock, so this does too.
  const [rounds, clock, config] = await Promise.all([
    fetchRounds(client.rpc, undefined, PROGRAM_ADDRESS),
    fetchSysvarClock(client.rpc, { commitment: 'confirmed' }),
    findConfigPda({ programAddress: PROGRAM_ADDRESS }).then(([address]) =>
      client.solucky.accounts.config.fetch(address),
    ),
  ]);

  const now = Number(clock.unixTimestamp) * 1000;
  let pending = 0;
  // Oldest first: each draw takes the carry that the game's last draw left.
  for (const round of rounds.reverse()) {
    if (!isDue(round.data, now)) continue;
    pending++;
    try {
      const done = await step(client, round, clock.slot, config.data.treasury);
      if (done) log(done);
    } catch (error) {
      log(`${roundLabel(round.data)}: ${describeError(error)}`);
    }
  }
  return pending;
}
