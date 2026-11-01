import { describe, expect, it } from 'vitest';

import { countBetween, freeIn, MAX_BATCH, pickNumbers } from '../app/utils/batch';
import { batchCost, FEE_ALLOWANCE, purchaseCost } from '../app/utils/buy';

/** A seeded generator, so a failure replays. */
function seeded(seed = 1) {
  let x = seed;
  return () => {
    x = (x * 1_103_515_245 + 12_345) % 2_147_483_648;
    return x / 2_147_483_648;
  };
}

describe('pickNumbers', () => {
  it('draws distinct free numbers inside the range, ascending', () => {
    const taken = [40, 50, 60];
    const picks = pickNumbers({ from: 33, to: 120_293, count: 30, taken, pattern: 'random', random: seeded() });
    expect(picks).toHaveLength(30);
    expect(new Set(picks).size).toBe(30);
    expect(picks).toEqual([...picks].sort((a, b) => a - b));
    for (const n of picks) {
      expect(n).toBeGreaterThanOrEqual(33);
      expect(n).toBeLessThanOrEqual(120_293);
      expect(taken).not.toContain(n);
    }
  });

  it('takes the range in either order', () => {
    const picks = pickNumbers({ from: 10, to: 1, count: 10, taken: [], pattern: 'random', random: seeded() });
    expect(picks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('stops at the free numbers of a crowded range', () => {
    const taken = [2, 3, 4, 6];
    expect(pickNumbers({ from: 1, to: 7, count: 10, taken, pattern: 'random' })).toEqual([1, 5, 7]);
    expect(pickNumbers({ from: 1, to: 7, count: 10, taken, pattern: 'spread' })).toEqual([1, 5, 7]);
    expect(pickNumbers({ from: 2, to: 4, count: 1, taken, pattern: 'random' })).toEqual([]);
  });

  it('draws from a huge range without listing it', () => {
    const picks = pickNumbers({ from: 0, to: 21_000_000, count: MAX_BATCH, taken: [], pattern: 'random' });
    expect(new Set(picks).size).toBe(MAX_BATCH);
  });

  it('spreads numbers evenly, stepping off taken ones', () => {
    expect(pickNumbers({ from: 0, to: 99, count: 4, taken: [], pattern: 'spread' })).toEqual([12, 37, 62, 87]);
    // 37 is taken: the closest free number below wins the tie.
    expect(pickNumbers({ from: 0, to: 99, count: 4, taken: [37], pattern: 'spread' })).toEqual([12, 36, 62, 87]);
    expect(pickNumbers({ from: 0, to: 99, count: 4, taken: [36, 37], pattern: 'spread' })).toEqual([12, 38, 62, 87]);
    expect(pickNumbers({ from: 5, to: 5, count: 3, taken: [], pattern: 'spread' })).toEqual([5]);
  });

  it('counts what a range holds', () => {
    expect(countBetween([1, 5, 9, 12], 5, 11)).toBe(2);
    expect(freeIn(0, 9, [1, 5, 9, 12])).toBe(7);
    expect(freeIn(2, 4, [2, 3, 4])).toBe(0);
  });
});

describe('batchCost', () => {
  const base = {
    price: 100_000_000n,
    ticketSize: 91,
    roundSize: 224,
    rentPerByte: 6_960n,
  };

  it('is one purchase per ticket, plus a fee allowance per transaction', () => {
    const one = purchaseCost({ ...base, lottery: true, roundExists: true });
    const thirty = batchCost({ ...base, count: 30, transactions: 2, lottery: true, roundExists: true });
    expect(thirty).toBe(30n * (one - FEE_ALLOWANCE) + 2n * FEE_ALLOWANCE);
  });

  it('charges the round’s rent once, to its first buyer', () => {
    const open = batchCost({ ...base, count: 5, transactions: 1, lottery: false, roundExists: false });
    const shut = batchCost({ ...base, count: 5, transactions: 1, lottery: false, roundExists: true });
    expect(open - shut).toBe(2_449_920n);
  });

  it('leaves the fees out for a session', () => {
    expect(batchCost({ ...base, count: 1, transactions: 0, lottery: false, roundExists: true })).toBe(
      100_000_000n + 1_524_240n,
    );
  });
});
