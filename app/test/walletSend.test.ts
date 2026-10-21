import { describe, expect, it } from 'vitest';

import { withComputeUnitMargin } from '../app/utils/walletSend';

describe('withComputeUnitMargin', () => {
  it('leaves room for an instruction the wallet adds', () => {
    // A ticket purchase simulates at about 20 300 units; Phantom's priority-fee
    // instruction needs 150 more.
    expect(withComputeUnitMargin(20_287)).toBe(22_250);
    expect(withComputeUnitMargin(20_287) - 20_287).toBeGreaterThan(150);
  });

  it('adds at least 300 units to small transactions', () => {
    expect(withComputeUnitMargin(1_000)).toBe(1_300);
  });

  it('narrows to 2% for large transactions and stays under the maximum', () => {
    expect(withComputeUnitMargin(1_000_000) / 1_000_000).toBeCloseTo(1.02, 4);
    expect(withComputeUnitMargin(1_390_000)).toBe(1_400_000);
  });
});
