/**
 * Settling rounds: close → draw → pay the winner → collect the fee, for the
 * finished lottery rounds, and seal → draw for the unchecked Guess guesses.
 * Every step is permissionless, so any funded keypair can run it; it only
 * pays network fees. The operator scripts (`bun run crank`) and the app's
 * Worker (server/tasks/crank.ts) both run this.
 */
import type {
  Account,
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetProgramAccountsApi,
  Rpc,
} from '@solana/kit';
import { fetchSysvarClock } from '@solana/sysvars';

import { isPinnedSlotExpired } from './draw';
import { describeError } from './errors';
import {
  findConfigPda,
  findGamePda,
  findTicketPda,
  type Round,
  RoundStatus,
  SOLUCKY_PROGRAM_ADDRESS,
  type SoluckyPlugin,
} from './generated';
import { fetchPendingRounds, fetchTicketByIndex } from './queries';
import { formatPeriod, GAME_SLUGS, isLottery, periodOf } from './time';

/** What settling needs from a client: an RPC and the program plugin, with a funded payer behind it. */
export type SettleClient = {
  rpc: Rpc<GetAccountInfoApi & GetMultipleAccountsApi & GetProgramAccountsApi>;
  solucky: SoluckyPlugin;
};

export type SettleOptions = {
  programAddress?: Address;
  /** Where each step is reported. */
  log?: (message: string) => void;
  /** Called with a round right after a draw found its winner (draw notifications). */
  onDraw?: (round: Round) => Promise<void> | void;
};

/** `daily 2026-10-21`, `hourly 2026-10-21T14`, `guess 3`: how logs name a round. */
export function roundLabel({ kind, period }: Pick<Round, 'kind' | 'period'>): string {
  return `${GAME_SLUGS[kind]} ${formatPeriod(kind, period)}`;
}

/** A round needs work until its winner is paid and its fee collected. */
export function needsWork(round: Round) {
  return round.status !== RoundStatus.Settled || !round.feeCollected;
}

/** Whether a round can move now: a finished lottery round, or a Guess round with unchecked guesses. */
export function isDue(round: Round, now: number) {
  if (!needsWork(round)) return false;
  if (isLottery(round.kind)) return round.period < periodOf(round.kind, now);
  return round.status !== RoundStatus.Open || round.ticketCount > round.checked;
}

async function winningTicket(client: SettleClient, round: Account<Round>, programAddress: Address) {
  const { kind, winningIndex, winningNumber } = round.data;
  if (isLottery(kind)) {
    const [address] = await findTicketPda({ round: round.address, number: winningNumber }, { programAddress });
    const ticket = await client.solucky.accounts.ticket.fetchMaybe(address);
    return ticket.exists ? ticket : null;
  }
  return fetchTicketByIndex(client.rpc, round.address, winningIndex, programAddress);
}

/** Advances one round by a single step. Returns what it did, or why it waited. */
async function step(
  client: SettleClient,
  round: Account<Round>,
  slot: bigint,
  treasury: Address,
  { programAddress = SOLUCKY_PROGRAM_ADDRESS, onDraw }: SettleOptions,
) {
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
      const [game] = await findGamePda({ kind }, { programAddress });
      await ix.drawRound({ round: round.address, game }).sendTransaction();
      const drawn = await client.solucky.accounts.round.fetch(round.address);
      if (drawn.data.status === RoundStatus.Open) return `${label}: no guess found the number`;
      await onDraw?.(drawn.data);
      return isLottery(kind)
        ? `${label}: drew ${drawn.data.drawnNumber}, closest number ${drawn.data.winningNumber}`
        : `${label}: guess #${drawn.data.winningIndex} found the number`;
    }
    case RoundStatus.Drawn: {
      const ticket = await winningTicket(client, round, programAddress);
      if (!ticket) throw new Error('the winning ticket was not found');
      await ix.claimPrize({ round: round.address, ticket: ticket.address, owner: ticket.data.owner }).sendTransaction();
      return `${label}: paid the winner ${ticket.data.owner} (number ${ticket.data.number})`;
    }
    case RoundStatus.Settled: {
      await ix.collectFee({ round: round.address, treasury }).sendTransaction();
      return `${label}: collected the ◎${Number(round.data.fee) / 1e9} fee`;
    }
  }
}

/**
 * One pass over every round that can move, one step each. Returns how many
 * rounds were due at the start of the pass (0 means everything is settled
 * and every guess checked).
 */
export async function settleRounds(client: SettleClient, options: SettleOptions = {}): Promise<number> {
  const { programAddress = SOLUCKY_PROGRAM_ADDRESS, log = console.log } = options;
  // The program judges time by the cluster's clock, so this does too.
  const [rounds, clock, config] = await Promise.all([
    fetchPendingRounds(client.rpc, programAddress),
    fetchSysvarClock(client.rpc, { commitment: 'confirmed' }),
    findConfigPda({ programAddress }).then(([address]) => client.solucky.accounts.config.fetch(address)),
  ]);

  const now = Number(clock.unixTimestamp) * 1000;
  let due = 0;
  // Oldest first: each draw takes the carry that the game's last draw left.
  for (const round of rounds.reverse()) {
    if (!isDue(round.data, now)) continue;
    due++;
    try {
      const done = await step(client, round, clock.slot, config.data.treasury, options);
      if (done) log(done);
    } catch (error) {
      log(`${roundLabel(round.data)}: ${describeError(error)}`);
    }
  }
  return due;
}
