import {
  isSolanaError,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
  SOLANA_ERROR__RPC__TRANSPORT_HTTP_ERROR,
  SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE,
  SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT,
} from '@solana/kit';

import { getSoluckyErrorMessage, type SoluckyError } from './generated';

const FIRST_PROGRAM_ERROR = 6000;

/** System program errors a player can hit while buying a ticket: 0 the number's account exists, 1 no funds. */
const NUMBER_TAKEN = 0;
const INSUFFICIENT_FUNDS = 1;

function* causes(error: unknown): Generator<unknown> {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && !seen.has(current)) {
    seen.add(current);
    yield current;
    current = (current as { cause?: unknown }).cause;
  }
}

/** The program error code inside a Kit error chain, if any. */
export function getProgramErrorCode(error: unknown): number | null {
  for (const cause of causes(error)) {
    if (isSolanaError(cause, SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM)) return cause.context.code;
  }
  return null;
}

/** Why a S☉Lucky transaction failed, for a caller to explain in its own words. */
export type ErrorReason =
  | { kind: 'program'; code: SoluckyError }
  | { kind: 'number-taken' }
  | { kind: 'insufficient-funds' }
  /**
   * The wallet failed inside its own extension and only said "Unexpected error"
   * (Phantom does this for any internal failure, even when signing a plain message).
   */
  | { kind: 'wallet-failed' }
  /** The RPC endpoint turned the request away with HTTP 429: too many requests. */
  | { kind: 'rate-limited' }
  /** The RPC endpoint answered with another HTTP error, such as 401 or 403 for a bad key. */
  | { kind: 'rpc-http'; status: number }
  | { kind: 'other'; message: string };

export function errorReason(error: unknown): ErrorReason {
  const code = getProgramErrorCode(error);
  if (code !== null && code >= FIRST_PROGRAM_ERROR) return { kind: 'program', code: code as SoluckyError };
  if (code === NUMBER_TAKEN) return { kind: 'number-taken' };
  if (code === INSUFFICIENT_FUNDS) return { kind: 'insufficient-funds' };
  for (const cause of causes(error)) {
    if (
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE) ||
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT)
    ) {
      return { kind: 'insufficient-funds' };
    }
  }
  for (const cause of causes(error)) {
    if (isSolanaError(cause, SOLANA_ERROR__RPC__TRANSPORT_HTTP_ERROR)) {
      const status = cause.context.statusCode;
      return status === 429 ? { kind: 'rate-limited' } : { kind: 'rpc-http', status };
    }
  }
  for (const cause of causes(error)) {
    const message = cause instanceof Error ? cause.message : String(cause);
    if (/already in use/i.test(message)) return { kind: 'number-taken' };
    if (/insufficient (funds|lamports)/i.test(message)) return { kind: 'insufficient-funds' };
    if (/unexpected error/i.test(message)) return { kind: 'wallet-failed' };
  }
  return { kind: 'other', message: error instanceof Error ? error.message : String(error) };
}

/** One sentence explaining a failed S☉Lucky transaction, in English. */
export function describeError(error: unknown): string {
  const reason = errorReason(error);
  switch (reason.kind) {
    case 'program':
      return `${getSoluckyErrorMessage(reason.code)}.`;
    case 'number-taken':
      return 'Someone already holds this number in this round. Pick another one.';
    case 'insufficient-funds':
      return 'Not enough SOL in the wallet.';
    case 'rate-limited':
      return 'The RPC endpoint is rate-limiting requests (HTTP 429). Wait a minute and try again.';
    case 'rpc-http':
      return `The RPC endpoint answered with HTTP error ${reason.status}.`;
    case 'wallet-failed':
      return 'Your wallet reported “Unexpected error” and did not sign. Close its window, lock and unlock it or restart the extension, then try again.';
    case 'other':
      return reason.message || 'Something went wrong.';
  }
}
