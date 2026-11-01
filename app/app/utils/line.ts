/**
 * The lottery's number line: every ticket owns the numbers closer to it than
 * to any other ticket (a tie goes to the lower number, like the program), and
 * the draw lands on one number of 0 to `max`. These helpers price a number
 * before it is bought. `sorted` is a round's numbers, ascending, no repeats.
 */

/** The numbers, ascending and without repeats. */
export function sortNumbers(numbers: Iterable<number>): number[] {
  return [...new Set(numbers)].sort((a, b) => a - b);
}

/** Index of the first entry of `sorted` that is `>= value`. */
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

/**
 * The numbers `n` would win on, from `lo` to `hi`, if it joined the round
 * (whether or not it is in `sorted` already: its own entry is skipped).
 */
export function territory(sorted: readonly number[], n: number, max: number): { lo: number; hi: number } {
  const at = lowerBound(sorted, n);
  const prev = at > 0 ? sorted[at - 1] : undefined;
  const nextAt = sorted[at] === n ? at + 1 : at;
  const next = sorted[nextAt];
  return {
    lo: prev === undefined ? 0 : Math.floor((prev + n) / 2) + 1,
    hi: next === undefined ? max : Math.floor((n + next) / 2),
  };
}

/** The share of the draw `n` would win if it joined the round now: 0 to 1. */
export function shareOf(sorted: readonly number[], n: number, max: number): number {
  const { lo, hi } = territory(sorted, n, max);
  return Math.max(0, hi - lo + 1) / (max + 1);
}

/**
 * The free number that would own the largest share of the line right now, or
 * `null` when nobody holds a number (then every number wins it all). At either
 * end, it sits next to the outermost ticket and takes the whole end; between
 * two tickets, it takes about half of the gap (one more number when it has
 * the parity of the upper ticket, as ties go to the lower number).
 */
export function bestSpot(sorted: readonly number[], max: number): number | null {
  if (!sorted.length) return null;
  let best: number | null = null;
  let bestSize = -1;
  const consider = (n: number) => {
    if (n < 0 || n > max) return;
    const { lo, hi } = territory(sorted, n, max);
    const size = hi - lo + 1;
    if (size > bestSize) {
      best = n;
      bestSize = size;
    }
  };
  const first = sorted[0]!;
  const last = sorted.at(-1)!;
  if (first > 0) consider(first - 1);
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1]!;
    const b = sorted[i]!;
    const mid = Math.floor((a + b) / 2);
    if (mid > a) consider(mid);
    if (mid + 1 < b) consider(mid + 1);
  }
  if (last < max) consider(last + 1);
  return best;
}

/** How many numbers fall in each of `bins` equal slices of 0 to `max`. */
export function density(sorted: readonly number[], max: number, bins: number): number[] {
  const counts = Array.from({ length: bins }, () => 0);
  for (const n of sorted) counts[Math.min(bins - 1, Math.floor((n / (max + 1)) * bins))]!++;
  return counts;
}
