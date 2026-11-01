import {
  isSolanaError,
  SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
  SOLANA_ERROR__RPC__TRANSPORT_HTTP_ERROR,
  SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_NOT_FOUND,
  SOLANA_ERROR__TRANSACTION_ERROR__BLOCKHASH_NOT_FOUND,
  SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE,
  SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT,
  SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_ACCOUNT_NOT_FOUND,
} from '@solana/kit';

import { getSoluckyErrorMessage, type SoluckyError } from './generated';

const FIRST_PROGRAM_ERROR = 6000;

/** System program errors a player can hit while buying a ticket: 0 the number's account exists, 1 no funds. */
const NUMBER_TAKEN = 0;
const INSUFFICIENT_FUNDS = 1;

/** Anchor's own errors when an account the program expects was never created: the config or the game. */
const ACCOUNT_NOT_INITIALIZED = 3012;
/**
 * Anchor's errors when the transaction doesn't match the deployed program:
 * unknown instruction (101), bad data (102), wrong PDA seeds (2006), or the
 * code deployed at another address (4100). The app is out of date.
 */
const OUT_OF_DATE = new Set([101, 102, 2006, 4100]);

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
  /** The fee payer has no account on this cluster: a wallet with 0 SOL. */
  | { kind: 'no-sol' }
  /**
   * The wallet sent to another cluster than the app's: the blockhash or the
   * program is unknown there.
   */
  | { kind: 'wrong-cluster' }
  /** The program's config or this game was never set up on this cluster. */
  | { kind: 'not-set-up' }
  /** The transaction doesn't match the deployed program: reload the app. */
  | { kind: 'outdated' }
  /** The blockhash expired before the transaction was confirmed. */
  | { kind: 'expired' }
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
  if (code === ACCOUNT_NOT_INITIALIZED) return { kind: 'not-set-up' };
  if (code !== null && OUT_OF_DATE.has(code)) return { kind: 'outdated' };
  for (const cause of causes(error)) {
    if (
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE) ||
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT)
    ) {
      return { kind: 'insufficient-funds' };
    }
    if (isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_NOT_FOUND)) return { kind: 'no-sol' };
    if (
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__BLOCKHASH_NOT_FOUND) ||
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_ACCOUNT_NOT_FOUND)
    ) {
      return { kind: 'wrong-cluster' };
    }
    if (isSolanaError(cause, SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED)) return { kind: 'expired' };
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
    // What wallets report when they simulate or send on their own cluster.
    if (/blockhash not found|program that does not exist|program account not found/i.test(message)) {
      return { kind: 'wrong-cluster' };
    }
    if (/no record of a prior credit|AccountNotFound/i.test(message)) return { kind: 'no-sol' };
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
    case 'no-sol':
      return 'This wallet has no SOL on this network yet. Add some, then try again.';
    case 'wrong-cluster':
      return 'Your wallet sent the transaction to another network. Switch it to the same network as the app, then try again.';
    case 'not-set-up':
      return 'This game is not set up on this network yet.';
    case 'outdated':
      return 'The app is out of date with the program. Reload the page, then try again.';
    case 'expired':
      return 'The transaction expired before it was confirmed. Check your wallet activity before you try again.';
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
