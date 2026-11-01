import type { Account, Address } from '@solana/kit';
import type { Round } from '@solucky/client';
import { describe, expect, it } from 'vitest';

import { latestWins, winTotals } from '../app/utils/winners';

const round = (address: string, drawSlot: bigint, payout: bigint, winner: string, country: string) =>
  ({
    address: address as Address,
    data: {
      drawSlot,
      payout,
      winner: winner as Address,
      winnerCountry: new TextEncoder().encode(country),
    },
  }) as unknown as Account<Round>;

describe('winners wall', () => {
  const daily = [round('d1', 100n, 10n, 'alice', 'ES'), round('d2', 300n, 20n, 'bob', 'FR')];
  const hourly = [round('h1', 200n, 5n, 'alice', 'ES'), round('h2', 400n, 1n, 'carol', '\0\0')];

  it('orders every game’s settled rounds by draw slot, newest first', () => {
    const wins = latestWins([
      { kind: 0, rounds: daily },
      { kind: 1, rounds: hourly },
    ]);
    expect(wins.map((w) => w.round.address)).toEqual(['h2', 'd2', 'h1', 'd1']);
    expect(wins[0]!.kind).toBe(1);
  });

  it('keeps the latest ones only', () => {
    const wins = latestWins(
      [
        { kind: 0, rounds: daily },
        { kind: 1, rounds: hourly },
      ],
      2,
    );
    expect(wins.map((w) => w.round.address)).toEqual(['h2', 'd2']);
  });

  it('adds up what was paid, to how many winners from how many countries', () => {
    expect(winTotals([...daily, ...hourly])).toEqual({ rounds: 4, paid: 36n, winners: 3, countries: 2 });
    expect(winTotals([])).toEqual({ rounds: 0, paid: 0n, winners: 0, countries: 0 });
  });
});
