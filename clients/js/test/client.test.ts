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
  carryFor,
  closestNumber,
  computeRandomness,
  countryFromBytes,
  countryToBytes,
  describeError,
  drawnNumber,
  errorReason,
  feeFor,
  findGamePda,
  findRoundPda,
  findTicketPda,
  flagEmoji,
  formatCountdown,
  formatPeriod,
  gameFromSlug,
  GameKind,
  getRoundEncoder,
  getRoundSize,
  getTicketEncoder,
  getTicketSize,
  guessOutcome,
  isPinnedSlotExpired,
  lamportsToSol,
  msUntilClose,
  parsePeriod,
  periodEnd,
  periodOf,
  periodStart,
  prizeFor,
  roundNumbers,
  RoundStatus,
  SOLUCKY_ERROR__PAUSED,
  TICKET_OFFSETS,
  winShare,
} from '../src';

const { Daily, Hourly, Guess } = GameKind;

describe('time', () => {
  test('daily rounds follow UTC midnight', () => {
    expect(periodOf(Daily, 0)).toBe(0);
    expect(periodOf(Daily, Date.UTC(2026, 9, 20, 23, 59, 59))).toBe(periodOf(Daily, Date.UTC(2026, 9, 20)));
    expect(periodOf(Daily, Date.UTC(2026, 9, 21))).toBe(periodOf(Daily, Date.UTC(2026, 9, 20)) + 1);
    const day = periodOf(Daily, Date.UTC(2026, 9, 20, 12));
    expect(formatPeriod(Daily, day)).toBe('2026-10-20');
    expect(parsePeriod(Daily, '2026-10-20')).toBe(day);
    expect(parsePeriod(Daily, '20-10-2026')).toBeNull();
    expect(periodStart(Daily, day).toISOString()).toBe('2026-10-20T00:00:00.000Z');
    expect(periodEnd(Daily, day).toISOString()).toBe('2026-10-21T00:00:00.000Z');
  });

  test('hourly rounds follow the UTC hour', () => {
    const hour = periodOf(Hourly, Date.UTC(2026, 9, 20, 14, 59, 59));
    expect(hour).toBe(periodOf(Daily, Date.UTC(2026, 9, 20)) * 24 + 14);
    expect(formatPeriod(Hourly, hour)).toBe('2026-10-20T14');
    expect(parsePeriod(Hourly, '2026-10-20T14')).toBe(hour);
    expect(parsePeriod(Hourly, '2026-10-20')).toBeNull();
    expect(periodEnd(Hourly, hour).toISOString()).toBe('2026-10-20T15:00:00.000Z');
  });

  test('guess rounds are numbered', () => {
    expect(formatPeriod(Guess, 12)).toBe('12');
    expect(parsePeriod(Guess, '12')).toBe(12);
    expect(parsePeriod(Guess, '2026-10-20')).toBeNull();
    expect(gameFromSlug('hourly')).toBe(Hourly);
    expect(gameFromSlug('weekly')).toBeNull();
  });

  test('countdown to the end of a round', () => {
    const day = periodOf(Daily, Date.UTC(2026, 9, 20));
    expect(msUntilClose(Daily, day, Date.UTC(2026, 9, 20, 22, 58, 30))).toBe(3_690_000);
    expect(msUntilClose(Daily, day, Date.UTC(2026, 9, 21, 1))).toBe(0);
    const hour = periodOf(Hourly, Date.UTC(2026, 9, 20, 14));
    expect(msUntilClose(Hourly, hour, Date.UTC(2026, 9, 20, 14, 59, 30))).toBe(30_000);
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
    // Its first 8 bytes as a u64 LE: 0x35e17bca33b8f550.
    expect(drawnNumber(randomness, 21_000_000)).toBe(Number(0x35e17bca33b8f550n % 21_000_001n));
    expect(drawnNumber(randomness, 6)).toBe(2);
  });

  test('the closest number wins, ties go to the lower one', () => {
    expect(closestNumber([10, 20, 40], 15)).toBe(10);
    expect(closestNumber([40, 20, 10], 16)).toBe(20);
    expect(closestNumber([10, 20, 40], 0)).toBe(10);
    expect(closestNumber([10, 20, 40], 21_000_000)).toBe(40);
    expect(closestNumber([], 1)).toBeNull();
  });

  test('a ticket wins the share of the range closest to it', () => {
    // Numbers 0..100; tickets 10, 20 and 40: 10 takes 0-15, 20 takes 16-30, 40 takes 31-100.
    expect(winShare([40, 10, 20], new Set([10]), 100)).toBeCloseTo(16 / 101);
    expect(winShare([10, 20, 40], new Set([20]), 100)).toBeCloseTo(15 / 101);
    expect(winShare([10, 20, 40], new Set([40]), 100)).toBeCloseTo(70 / 101);
    expect(winShare([10, 20, 40], new Set([10, 20, 40]), 100)).toBe(1);
    expect(winShare([7], new Set([7]), 100)).toBe(1);
    expect(winShare([7], new Set(), 100)).toBe(0);
    // Each share agrees with the closest-number rule, number by number.
    const tickets = [3, 9, 10, 50];
    for (const t of tickets) {
      let wins = 0;
      for (let target = 0; target <= 60; target++) if (closestNumber(tickets, target) === t) wins++;
      expect(winShare(tickets, new Set([t]), 60)).toBeCloseTo(wins / 61);
    }
  });

  test('guess batches hit with odds batch / numbers left', () => {
    const bytes = (x: bigint) => {
      const data = new Uint8Array(32);
      new DataView(data.buffer).setBigUint64(0, x, true);
      return data;
    };
    // Same vectors as the program: 11 numbers, 3 already wrong, 2 in the batch.
    expect(guessOutcome(bytes(0n), 3, 5, 10)).toBe(3);
    expect(guessOutcome(bytes(1n), 3, 5, 10)).toBe(4);
    expect(guessOutcome(bytes(2n), 3, 5, 10)).toBeNull();
    expect(guessOutcome(bytes(8n), 3, 5, 10)).toBe(3);
    expect(guessOutcome(bytes(2n ** 64n - 1n), 9, 11, 10)).toBe(10);
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

  test('lottery rounds store their sorted numbers after their fields', () => {
    const fields = getRoundEncoder().encode({
      kind: Daily,
      period: 20_000,
      status: RoundStatus.Open,
      ticketPrice: 0n,
      feeBps: 0,
      maxNumber: 0,
      ticketCount: 3,
      pot: 0n,
      entropy: new Uint8Array(32),
      targetSlot: 0n,
      checked: 0,
      sealedCount: 0,
      drawSlot: 0n,
      slotHash: new Uint8Array(32),
      randomness: new Uint8Array(32),
      drawnNumber: 0,
      winningIndex: 0,
      winningNumber: 0,
      winner: address('11111111111111111111111111111111'),
      winnerCountry: new Uint8Array(2),
      payout: 0n,
      fee: 0n,
      feeCollected: false,
      bump: 255,
    });
    expect(fields.length).toBe(getRoundSize());
    // The kind byte follows the discriminator, where `fetchRounds` filters on it.
    expect(fields[8]).toBe(Daily);
    const data = new Uint8Array([...fields, 7, 0, 0, 0, 0x40, 0x6f, 0x40, 0x01]);
    expect(roundNumbers(data)).toEqual([7, 21_000_000]);
    expect(roundNumbers(fields)).toEqual([]);
  });

  test('PDAs are derived from the game, the period and the number', async () => {
    const [roundA] = await findRoundPda({ kind: Daily, period: 20_000 });
    const [roundB] = await findRoundPda({ kind: Daily, period: 20_001 });
    const [roundC] = await findRoundPda({ kind: Hourly, period: 20_000 });
    expect(new Set([roundA, roundB, roundC]).size).toBe(3);
    const [ticketA] = await findTicketPda({ round: roundA, number: 7 });
    const [ticketB] = await findTicketPda({ round: roundA, number: 8 });
    expect(ticketA).not.toBe(ticketB);
    const [gameA] = await findGamePda({ kind: Daily });
    const [gameB] = await findGamePda({ kind: Guess });
    expect(gameA).not.toBe(gameB);
  });
});

test('money helpers', () => {
  expect(lamportsToSol(1_500_000_000n)).toBe(1.5);
  expect(feeFor(1_000n, 500)).toBe(50n);
  expect(feeFor(999n, 1)).toBe(0n);
  // 80% to the winner, 5% to the house, 15% to the next round.
  expect(prizeFor(1_000n)).toBe(800n);
  expect(carryFor(1_000n, 500)).toBe(150n);
  expect(carryFor(9n, 0)).toBe(2n);
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
    expect(describeError(failed(0))).toMatch(/already holds this number in this round/);
    expect(describeError(new Error(''))).toBe('Something went wrong.');
  });
});
