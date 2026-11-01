import {
  type Address,
  isSolanaError,
  type Signature,
  SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED,
  SOLANA_ERROR__FAILED_TO_SEND_TRANSACTION,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
  SolanaError,
} from '@solana/kit';
import { errorReason } from '@solucky/client';
import { describe, expect, it } from 'vitest';

import {
  confirmSignature,
  defaultRoute,
  otherRoute,
  signatureOf,
  withComputeUnitMargin,
} from '../app/utils/walletSend';

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

describe('confirmSignature', () => {
  const sig = '5'.repeat(88) as Signature;

  /** An RPC whose statuses and block heights come from the lists, one per call. */
  function rpc(statuses: ({ confirmationStatus?: string; err?: unknown } | null)[], heights: bigint[] = []) {
    const calls = { statuses: 0, heights: 0 };
    return {
      calls,
      getSignatureStatuses: () => ({
        send: async () => ({ value: [statuses[Math.min(calls.statuses++, statuses.length - 1)] ?? null] }),
      }),
      getBlockHeight: () => ({
        send: async () => heights[Math.min(calls.heights++, heights.length - 1)] ?? 0n,
      }),
    };
  }

  it('resolves once the cluster confirms the transaction', async () => {
    const r = rpc([null, { confirmationStatus: 'processed' }, { confirmationStatus: 'confirmed' }]);
    await expect(confirmSignature(r, sig, 100n, { interval: 0 })).resolves.toBeUndefined();
    expect(r.calls.statuses).toBe(3);
  });

  it('throws the error of a transaction that landed but failed', async () => {
    const failed = { confirmationStatus: 'confirmed', err: { InstructionError: [1, { Custom: 6005 }] } };
    const error = await confirmSignature(rpc([failed]), sig, 100n, { interval: 0 }).catch((e: unknown) => e);
    expect(isSolanaError(error, SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM)).toBe(true);
    // It reads as the program's own error, not as a purchase.
    expect(errorReason(error)).toEqual({ kind: 'program', code: 6005 });
  });

  it('gives up once the blockhash expired', async () => {
    const error = await confirmSignature(rpc([null], [101n]), sig, 100n, { interval: 0 }).catch((e: unknown) => e);
    expect(isSolanaError(error, SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED)).toBe(true);
    expect(errorReason(error)).toEqual({ kind: 'expired' });
  });

  it('stops when the player cancels', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(confirmSignature(rpc([null]), sig, 100n, { abortSignal: controller.signal })).rejects.toThrow();
  });
});

describe('send routes', () => {
  const address = '11111111111111111111111111111111' as Address;
  const sending = { address, signAndSendTransactions: async () => [] };
  const signing = { address, modifyAndSignTransactions: async (txs: unknown) => txs };
  const both = { ...sending, ...signing };

  it('lets a wallet that can sign and send do both', () => {
    expect(defaultRoute(both as never)).toBe('wallet');
    expect(defaultRoute(signing as never)).toBe('app');
    expect(defaultRoute(null)).toBe('app');
  });

  it('offers the other way only when the wallet supports it', () => {
    expect(otherRoute(both as never, 'wallet')).toBe('app');
    expect(otherRoute(both as never, 'app')).toBe('wallet');
    expect(otherRoute(sending as never, 'wallet')).toBeNull();
    expect(otherRoute(signing as never, 'app')).toBeNull();
    expect(otherRoute(null, 'wallet')).toBeNull();
  });
});

describe('signatureOf', () => {
  it('finds the signature Kit keeps on a failed send', () => {
    const sig = '4'.repeat(88);
    const result = { context: { signature: sig } };
    const error = new SolanaError(SOLANA_ERROR__FAILED_TO_SEND_TRANSACTION, {
      cause: new Error('boom'),
      causeMessage: ': boom',
      transactionPlanResult: result,
    } as never);
    expect(signatureOf(new Error('outer', { cause: error }))).toBe(sig);
    expect(signatureOf(new Error('no signature'))).toBeNull();
  });
});
