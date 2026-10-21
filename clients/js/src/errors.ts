import {
  isSolanaError,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
  SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE,
  SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT,
} from '@solana/kit';

import { getSoluckyErrorMessage, type SoluckyError } from './generated';

const FIRST_PROGRAM_ERROR = 6000;

/** System program errors a player can hit while buying a ticket. */
const SYSTEM_ERRORS: Record<number, string> = {
  0: 'Someone already holds this number today. Pick another one.',
  1: 'Not enough SOL in the wallet.',
};

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

/** One sentence explaining a failed S☉Lucky transaction. */
export function describeError(error: unknown): string {
  const code = getProgramErrorCode(error);
  if (code !== null && code >= FIRST_PROGRAM_ERROR) return `${getSoluckyErrorMessage(code as SoluckyError)}.`;
  if (code !== null && SYSTEM_ERRORS[code]) return SYSTEM_ERRORS[code];
  for (const cause of causes(error)) {
    if (
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE) ||
      isSolanaError(cause, SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT)
    ) {
      return SYSTEM_ERRORS[1]!;
    }
  }
  for (const cause of causes(error)) {
    const message = cause instanceof Error ? cause.message : String(cause);
    if (/already in use/i.test(message)) return SYSTEM_ERRORS[0]!;
    if (/insufficient (funds|lamports)/i.test(message)) return SYSTEM_ERRORS[1]!;
    // Phantom hides the real cause behind this when the extension is on the
    // wrong cluster (e.g. Mainnet while the app is on Devnet).
    if (/unexpected error/i.test(message)) {
      return 'Your wallet could not sign. In Phantom: Settings → Developer Settings → enable Testnet Mode → select Devnet, then reconnect and try again.';
    }
  }
  const message = error instanceof Error ? error.message : String(error);
  return message || 'Something went wrong.';
}
