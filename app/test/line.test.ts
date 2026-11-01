import { closestNumber, winShare } from '@solucky/client';
import { describe, expect, it } from 'vitest';

import { bestSpot, between, density, lensWindow, neighbors, shareOf, sortNumbers, territory } from '../app/utils/line';

/** Every number `n` would win on, found by brute force with the program's rule. */
function bruteTerritory(numbers: number[], n: number, max: number) {
  const all = [...new Set([...numbers, n])];
  const won = [];
  for (let draw = 0; draw <= max; draw++) if (closestNumber(all, draw) === n) won.push(draw);
  return { lo: won[0], hi: won.at(-1), size: won.length };
}

describe('number line', () => {
  it('sorts and drops repeats', () => {
    expect(sortNumbers([9, 2, 9, 0])).toEqual([0, 2, 9]);
  });

  it('gives a lone ticket the whole line', () => {
    expect(territory([], 7, 100)).toEqual({ lo: 0, hi: 100 });
    expect(shareOf([], 7, 100)).toBe(1);
  });

  it('matches the program rule, ties to the lower number, for numbers in and out of the round', () => {
    const max = 60;
    const numbers = [3, 10, 11, 25, 40, 59];
    const sorted = sortNumbers(numbers);
    for (let n = 0; n <= max; n++) {
      const brute = bruteTerritory(numbers, n, max);
      expect(territory(sorted, n, max), `n = ${n}`).toEqual({ lo: brute.lo, hi: brute.hi });
    }
  });

  it('agrees with winShare for a number in the round', () => {
    const max = 1_000;
    const numbers = [5, 120, 121, 500, 999];
    const sorted = sortNumbers(numbers);
    for (const n of numbers) expect(shareOf(sorted, n, max)).toBeCloseTo(winShare(numbers, new Set([n]), max), 12);
  });

  it('finds the free number with the largest share', () => {
    const max = 100;
    const check = (numbers: number[]) => {
      const sorted = sortNumbers(numbers);
      const spot = bestSpot(sorted, max)!;
      expect(sorted.includes(spot)).toBe(false);
      let best = 0;
      for (let n = 0; n <= max; n++) if (!sorted.includes(n)) best = Math.max(best, shareOf(sorted, n, max));
      expect(shareOf(sorted, spot, max)).toBe(best);
    };
    check([50]);
    check([0]);
    check([100]);
    check([10, 90]);
    check([30, 31, 32]);
    check([0, 1, 2, 3, 60, 100]);
    // Gaps of odd length: the middle is not always best.
    check([10, 15]);
    check([3, 8, 20, 27, 28, 41]);
    for (let seed = 1; seed < 40; seed++) {
      const numbers = Array.from({ length: 1 + (seed % 7) }, (_, i) => (seed * 37 + i * i * 13) % (max + 1));
      check(numbers);
    }
    expect(bestSpot([], max)).toBeNull();
    // At an end, next to the outermost ticket: it takes the whole end.
    expect(bestSpot([70], max)).toBe(69);
  });

  it('has no free spot when every number is taken', () => {
    expect(bestSpot([0, 1, 2], 2)).toBeNull();
  });

  it('finds the tickets either side of a number, skipping its own', () => {
    expect(neighbors([3, 10, 20], 12)).toEqual({ prev: 10, next: 20 });
    expect(neighbors([3, 10, 20], 10)).toEqual({ prev: 3, next: 20 });
    expect(neighbors([3, 10, 20], 1)).toEqual({ prev: null, next: 3 });
    expect(neighbors([3, 10, 20], 25)).toEqual({ prev: 20, next: null });
    expect(neighbors([], 5)).toEqual({ prev: null, next: null });
  });

  it('lists the numbers in a stretch, up to a limit', () => {
    expect(between([1, 4, 9, 16, 25], 4, 16)).toEqual([4, 9, 16]);
    expect(between([1, 4, 9, 16, 25], 5, 8)).toEqual([]);
    expect(between([1, 4, 9, 16, 25], 0, 100, 2)).toEqual([1, 4]);
  });

  it('frames a lens around the whole stretch and both neighbors', () => {
    const max = 1_000_000;
    const sorted = sortNumbers([10, 400_000, 400_100, 400_160, 999_990]);
    for (const n of [5, 11, 400_050, 400_130, 400_159, 700_000, 999_995, 0, 1_000_000]) {
      const { from, to } = lensWindow(sorted, n, max);
      const { lo, hi } = territory(sorted, n, max);
      const { prev, next } = neighbors(sorted, n);
      expect(from, `n = ${n}`).toBeGreaterThanOrEqual(0);
      expect(to, `n = ${n}`).toBeLessThanOrEqual(max);
      expect(from <= lo && hi <= to, `n = ${n}`).toBe(true);
      if (prev !== null) expect(from).toBeLessThanOrEqual(prev);
      if (next !== null) expect(to).toBeGreaterThanOrEqual(next);
      expect(to - from + 1).toBeGreaterThanOrEqual(24);
    }
    // Squeezed between two close tickets: it stays small, so it magnifies.
    const tight = lensWindow([100, 104], 102, max);
    expect(tight.to - tight.from + 1).toBe(24);
    // A short line is never wider than itself.
    expect(lensWindow([2, 5], 3, 9)).toEqual({ from: 0, to: 9 });
  });

  it('counts numbers per slice', () => {
    expect(density([0, 1, 50, 99, 100], 100, 4)).toEqual([2, 1, 0, 2]);
  });
});
