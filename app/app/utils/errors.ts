import { describeError, getProgramErrorCode } from '@solucky/client';

/** True when the wallet reported that the user closed or declined the prompt. */
export function isUserRejection(error: unknown): boolean {
  if (getProgramErrorCode(error) !== null) return false;
  const message = error instanceof Error ? error.message : String(error);
  return (
    /user rejected|rejected the request|denied|cancell?ed/i.test(message) || (error as { code?: number })?.code === 4001
  );
}

/** Turns a wallet, RPC or program error into one sentence for a toast. */
export function friendlyError(error: unknown): string {
  if (isUserRejection(error)) return 'You cancelled the request in your wallet.';
  return describeError(error);
}
