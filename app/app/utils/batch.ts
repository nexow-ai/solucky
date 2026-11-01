/**
 * Buying many numbers at once: the player gives a range and how many numbers
 * they want, and these pick free numbers in it. The program skips a number
 * someone took meanwhile, so a pick is only a proposal.
 */

/** Most numbers one purchase buys (five transactions). */
export const MAX_BATCH = 100;

/** Random numbers, or numbers spread evenly over the range. */
export type Pattern = 'random' | 'spread';

/** Below this many numbers, a range is listed in full to draw from. */
const LIST_BELOW = 200_000;

function lowerBound(sorted: readonly number[], value: number): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sorted[mid]! < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** How many of `sorted` lie from `lo` to `hi`, inclusive. */
export function countBetween(sorted: readonly number[], lo: number, hi: number): number {
  return lowerBound(sorted, hi + 1) - lowerBound(sorted, lo);
}

/** The free numbers from `lo` to `hi`: everything not in `taken`. */
export function freeIn(lo: number, hi: number, taken: readonly number[]): number {
  return Math.max(0, hi - lo + 1 - countBetween(taken, lo, hi));
}

/**
 * Up to `count` free numbers from `from` to `to` (either order, inclusive),
 * ascending, none of them in `taken` (sorted ascending, no repeats). `spread`
 * puts each at the middle of its equal share of the range, or at the free
 * number closest to it; `random` draws them uniformly. Fewer come back when
 * the range has fewer free numbers.
 */
export function pickNumbers({
  from,
  to,
  count,
  taken,
  pattern,
  random = Math.random,
}: {
  from: number;
  to: number;
  count: number;
  taken: readonly number[];
  pattern: Pattern;
  random?: () => number;
}): number[] {
  const lo = Math.max(0, Math.min(from, to));
  const hi = Math.max(from, to);
  const free = freeIn(lo, hi, taken);
  const n = Math.max(0, Math.min(Math.floor(count), free));
  if (n === 0) return [];
  const blocked = (x: number) => {
    const at = lowerBound(taken, x);
    return taken[at] === x;
  };
  const picked = new Set<number>();
  const size = hi - lo + 1;

  if (pattern === 'spread') {
    for (let i = 0; i < n; i++) {
      const target = lo + Math.floor(((i + 0.5) * size) / n);
      // The closest free number, looking below first on a tie.
      for (let d = 0; d <= size; d++) {
        const below = target - d;
        const above = target + d;
        if (below >= lo && !blocked(below) && !picked.has(below)) {
          picked.add(below);
          break;
        }
        if (above <= hi && !blocked(above) && !picked.has(above)) {
          picked.add(above);
          break;
        }
      }
    }
  } else if (size <= LIST_BELOW || free * 4 < size) {
    // Small or crowded (a round holds at most a million numbers, so a
    // crowded range is short too): shuffle its free numbers, keep `n`.
    const pool: number[] = [];
    for (let x = lo; x <= hi; x++) if (!blocked(x)) pool.push(x);
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(random() * (pool.length - i));
      [pool[i], pool[j]] = [pool[j]!, pool[i]!];
      picked.add(pool[i]!);
    }
  } else {
    // At least three in four numbers are free: draws rarely miss.
    while (picked.size < n) {
      const x = lo + Math.floor(random() * size);
      if (!blocked(x)) picked.add(x);
    }
  }
  return [...picked].sort((a, b) => a - b);
}
