import type { Account } from '@solana/kit';
import { countryFromBytes, type Round } from '@solucky/client';

/** A settled round of one of the games, for the landing's winners wall. */
export interface Win {
  kind: number;
  round: Account<Round>;
}

/**
 * The settled rounds of every game, newest draw first. Rounds have no
 * timestamp, but every draw pins a slot, and slots only go up, so the draw
 * slot orders rounds across games.
 */
export function latestWins(games: readonly { kind: number; rounds: readonly Account<Round>[] }[], limit = 12): Win[] {
  return games
    .flatMap(({ kind, rounds }) => rounds.map((round) => ({ kind, round })))
    .sort((a, b) => (a.round.data.drawSlot === b.round.data.drawSlot ? 0 : a.round.data.drawSlot > b.round.data.drawSlot ? -1 : 1))
    .slice(0, limit);
}

/** What every game has paid so far: rounds, lamports paid, distinct winners and their countries. */
export function winTotals(rounds: readonly Account<Round>[]) {
  return {
    rounds: rounds.length,
    paid: rounds.reduce((sum, round) => sum + round.data.payout, 0n),
    winners: new Set(rounds.map((round) => round.data.winner)).size,
    countries: new Set(rounds.map((round) => countryFromBytes(round.data.winnerCountry)).filter(Boolean)).size,
  };
}
