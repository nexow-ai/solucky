import { describe, expect, it } from 'vitest';

import { type BuyState, buyBlock, CLOSING_MS, FEE_ALLOWANCE, purchaseCost } from '../app/utils/buy';

const ready: BuyState = {
  price: 100_000_000n,
  period: 20_758,
  loading: false,
  failed: false,
  notSetUp: false,
  paused: false,
  taken: false,
  tooBig: false,
  lottery: true,
  msLeft: 3_600_000,
  open: true,
  full: false,
  balance: 15_000_000_000n,
  cost: 104_000_000n,
  busy: false,
  spinning: false,
};

describe('buyBlock', () => {
  it('lets a player buy once the round on sale is known', () => {
    expect(buyBlock(ready)).toBeNull();
  });

  it('waits for the price and the round instead of doing nothing on click', () => {
    expect(buyBlock({ ...ready, price: null, loading: true })).toBe('loading');
    expect(buyBlock({ ...ready, period: null })).toBe('loading');
    expect(buyBlock({ ...ready, price: null, failed: true })).toBe('unavailable');
    // A known price outlives a later failed refresh.
    expect(buyBlock({ ...ready, failed: true })).toBeNull();
  });

  it('stops in the last seconds of a lottery round, never in Guess', () => {
    expect(buyBlock({ ...ready, msLeft: CLOSING_MS - 1 })).toBe('closing');
    expect(buyBlock({ ...ready, msLeft: CLOSING_MS })).toBeNull();
    expect(buyBlock({ ...ready, lottery: false, msLeft: 0 })).toBeNull();
  });

  it('explains why the number or the round cannot take a ticket', () => {
    expect(buyBlock({ ...ready, notSetUp: true })).toBe('notSetUp');
    expect(buyBlock({ ...ready, paused: true })).toBe('paused');
    expect(buyBlock({ ...ready, open: false })).toBe('over');
    expect(buyBlock({ ...ready, full: true })).toBe('full');
    expect(buyBlock({ ...ready, taken: true })).toBe('taken');
    expect(buyBlock({ ...ready, tooBig: true })).toBe('outOfRange');
  });

  it('compares the balance with the whole cost, not just the price', () => {
    expect(buyBlock({ ...ready, balance: 100_000_000n })).toBe('notEnough');
    expect(buyBlock({ ...ready, balance: null })).toBeNull();
  });

  it('refuses a second purchase while one is running', () => {
    expect(buyBlock({ ...ready, busy: true })).toBe('busy');
    expect(buyBlock({ ...ready, spinning: true })).toBe('spinning');
  });
});

describe('purchaseCost', () => {
  // Today's rent: 6 960 lamports a byte, 128 bytes of overhead per account.
  const base = { price: 100_000_000n, ticketSize: 91, roundSize: 224, rentPerByte: 6_960n };

  it('adds the ticket rent, the 4 sorted-number bytes and the fees to the price', () => {
    expect(purchaseCost({ ...base, lottery: true, roundExists: true })).toBe(
      100_000_000n + 1_524_240n + 27_840n + FEE_ALLOWANCE,
    );
  });

  it('charges the first buyer the round account too', () => {
    const opening = purchaseCost({ ...base, lottery: true, roundExists: false });
    expect(opening - purchaseCost({ ...base, lottery: true, roundExists: true })).toBe(2_449_920n);
  });

  it('keeps no sorted numbers for Guess', () => {
    expect(purchaseCost({ ...base, lottery: false, roundExists: true })).toBe(
      100_000_000n + 1_524_240n + FEE_ALLOWANCE,
    );
  });
});
