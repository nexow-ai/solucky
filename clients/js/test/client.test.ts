import { describe, expect, test } from 'bun:test';
import {
  address,
  type Blockhash,
  getAddressEncoder,
  getBase64Decoder,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
  SolanaError,
} from '@solana/kit';
import { getSysvarSlotHashesEncoder } from '@solana/sysvars';

import {
  computeRandomness,
  countryFromBytes,
  countryToBytes,
  dayEnd,
  dayOf,
  dayStart,
  describeError,
  errorReason,
  feeFor,
  findRoundPda,
  findTicketPda,
  flagEmoji,
  formatCountdown,
  formatDay,
  getTicketEncoder,
  getTicketSize,
  isPinnedSlotExpired,
  lamportsToSol,
  msUntilClose,
  parseDay,
  SOLUCKY_ERROR__PAUSED,
  TICKET_OFFSETS,
  winningIndex,
} from '../src';

describe('time', () => {
  test('days follow UTC midnight', () => {
    expect(dayOf(0)).toBe(0);
    expect(dayOf(Date.UTC(2026, 9, 20, 23, 59, 59))).toBe(dayOf(Date.UTC(2026, 9, 20)));
    expect(dayOf(Date.UTC(2026, 9, 21))).toBe(dayOf(Date.UTC(2026, 9, 20)) + 1);
    const day = dayOf(Date.UTC(2026, 9, 20, 12));
    expect(formatDay(day)).toBe('2026-10-20');
    expect(parseDay('2026-10-20')).toBe(day);
    expect(parseDay('20-10-2026')).toBeNull();
    expect(dayStart(day).toISOString()).toBe('2026-10-20T00:00:00.000Z');
    expect(dayEnd(day).toISOString()).toBe('2026-10-21T00:00:00.000Z');
  });

  test('countdown to midnight', () => {
    const day = dayOf(Date.UTC(2026, 9, 20));
    expect(msUntilClose(day, Date.UTC(2026, 9, 20, 22, 58, 30))).toBe(3_690_000);
    expect(msUntilClose(day, Date.UTC(2026, 9, 21, 1))).toBe(0);
    expect(formatCountdown(3_690_000)).toBe('01h 01m 30s');
    expect(formatCountdown(-5)).toBe('00h 00m 00s');
  });
});

describe('country', () => {
  test('round trips ISO codes', () => {
    expect([...countryToBytes('es')]).toEqual([69, 83]);
    expect(countryFromBytes(countryToBytes('ES'))).toBe('ES');
    expect([...countryToBytes('ESP')]).toEqual([0, 0]);
    expect([...countryToBytes(null)]).toEqual([0, 0]);
    expect(countryFromBytes([0, 0])).toBeNull();
  });

  test('flags', () => {
    expect(flagEmoji('ES')).toBe('🇪🇸');
    expect(flagEmoji('JP')).toBe('🇯🇵');
    expect(flagEmoji(null)).toBe('🏴‍☠️');
  });
});

describe('draw', () => {
  // Vector computed independently with Python's hashlib.
  test('randomness matches the program formula', async () => {
    const round = address('cGfHiC6Kgg3FpFZvgwGcswsCRtp4aBP2fzuXRQPizuN');
    expect([...getAddressEncoder().encode(round)]).toEqual(new Array(32).fill(9));
    const randomness = await computeRandomness({
      entropy: Uint8Array.from({ length: 32 }, (_, i) => i),
      slotHash: new Uint8Array(32).fill(7),
      slot: 123_456_789n,
      round,
    });
    expect(Buffer.from(randomness).toString('hex')).toBe(
      '50f5b833ca7be1352d9cac36a9d19459bbdc1b1fbcda345f1c4f58db03ecb6bc',
    );
    expect(winningIndex(randomness, 7)).toBe(2);
    expect(winningIndex(randomness, 1)).toBe(0);
    expect(() => winningIndex(randomness, 0)).toThrow();
  });
});

describe('pinned slot expiry', () => {
  /** A fake RPC serving a SlotHashes sysvar that remembers `slots` (newest first). */
  function rpcWithSlotHashes(slots: bigint[]) {
    const hash = '11111111111111111111111111111111' as Blockhash;
    const data = getSysvarSlotHashesEncoder().encode(slots.map((slot) => ({ slot, hash })));
    const value = {
      data: [getBase64Decoder().decode(data), 'base64'],
      executable: false,
      lamports: 1n,
      owner: 'Sysvar1111111111111111111111111111111111111',
      space: BigInt(data.length),
    };
    return { getAccountInfo: () => ({ send: async () => ({ value }) }) } as never;
  }

  test('mirrors the program rule', async () => {
    const rpc = rpcWithSlotHashes([105n, 104n, 101n]);
    expect(await isPinnedSlotExpired(rpc, 101n)).toBe(false);
    expect(await isPinnedSlotExpired(rpc, 103n)).toBe(false);
    expect(await isPinnedSlotExpired(rpc, 200n)).toBe(false);
    expect(await isPinnedSlotExpired(rpc, 100n)).toBe(true);
  });
});

describe('accounts', () => {
  test('ticket field offsets match the account layout', () => {
    const round = address('cGfHiC6Kgg3FpFZvgwGcswsCRtp4aBP2fzuXRQPizuN');
    const owner = address('11111111111111111111111111111112');
    const data = getTicketEncoder().encode({
      round,
      owner,
      number: 0x01020304,
      index: 0x0a0b0c0d,
      country: countryToBytes('ES'),
      createdAt: 0n,
      bump: 255,
    });
    expect(data.length).toBe(getTicketSize());
    expect([...data.slice(TICKET_OFFSETS.round, TICKET_OFFSETS.round + 32)]).toEqual(new Array(32).fill(9));
    expect([...data.slice(TICKET_OFFSETS.owner, TICKET_OFFSETS.owner + 32)]).toEqual([
      ...getAddressEncoder().encode(owner),
    ]);
    expect([...data.slice(TICKET_OFFSETS.number, TICKET_OFFSETS.number + 4)]).toEqual([4, 3, 2, 1]);
    expect([...data.slice(TICKET_OFFSETS.index, TICKET_OFFSETS.index + 4)]).toEqual([13, 12, 11, 10]);
  });

  test('PDAs are derived from the day and number', async () => {
    const [roundA] = await findRoundPda({ day: 20_000 });
    const [roundB] = await findRoundPda({ day: 20_001 });
    expect(roundA).not.toBe(roundB);
    const [ticketA] = await findTicketPda({ round: roundA, number: 7 });
    const [ticketB] = await findTicketPda({ round: roundA, number: 8 });
    expect(ticketA).not.toBe(ticketB);
  });
});

test('money helpers', () => {
  expect(lamportsToSol(1_500_000_000n)).toBe(1.5);
  expect(feeFor(1_000n, 500)).toBe(50n);
  expect(feeFor(999n, 1)).toBe(0n);
});

describe('errors', () => {
  const failed = (code: number) =>
    new Error('Transaction simulation failed', {
      cause: new SolanaError(SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM, { code, index: 1 }),
    });

  test('tell program, system and wallet errors apart', () => {
    expect(errorReason(failed(6004))).toEqual({ kind: 'program', code: SOLUCKY_ERROR__PAUSED });
    expect(errorReason(failed(0))).toEqual({ kind: 'number-taken' });
    expect(errorReason(failed(1))).toEqual({ kind: 'insufficient-funds' });
    expect(errorReason(new Error('Unexpected error'))).toEqual({ kind: 'wallet-cluster' });
    expect(errorReason(new Error('boom'))).toEqual({ kind: 'other', message: 'boom' });
  });

  test('describe them in English', () => {
    expect(describeError(failed(6004))).toBe('Ticket sales are paused.');
    expect(describeError(failed(0))).toMatch(/already holds this number/);
    expect(describeError(new Error(''))).toBe('Something went wrong.');
  });
});
