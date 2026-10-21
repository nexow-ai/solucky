import {
  describeError,
  errorReason,
  getProgramErrorCode,
  SOLUCKY_ERROR__DRAW_STILL_POSSIBLE,
  SOLUCKY_ERROR__FEE_ALREADY_COLLECTED,
  SOLUCKY_ERROR__FEE_TOO_HIGH,
  SOLUCKY_ERROR__INVALID_COUNTRY,
  SOLUCKY_ERROR__INVALID_MAX_NUMBER,
  SOLUCKY_ERROR__INVALID_TICKET_PRICE,
  SOLUCKY_ERROR__NOT_WINNING_TICKET,
  SOLUCKY_ERROR__NUMBER_OUT_OF_RANGE,
  SOLUCKY_ERROR__OVERFLOW,
  SOLUCKY_ERROR__PAUSED,
  SOLUCKY_ERROR__PRICE_CHANGED,
  SOLUCKY_ERROR__RANDOMNESS_UNAVAILABLE,
  SOLUCKY_ERROR__ROUND_ALREADY_DRAWN,
  SOLUCKY_ERROR__ROUND_NOT_CLOSED,
  SOLUCKY_ERROR__ROUND_NOT_DRAWN,
  SOLUCKY_ERROR__ROUND_NOT_OPEN,
  SOLUCKY_ERROR__ROUND_NOT_OVER,
  SOLUCKY_ERROR__ROUND_NOT_SETTLED,
  SOLUCKY_ERROR__TARGET_SLOT_NOT_REACHED,
  SOLUCKY_ERROR__UNAUTHORIZED,
  SOLUCKY_ERROR__WRONG_DAY,
} from '@solucky/client';

/** The program's errors, by code, to their key under `errors.program` in the dictionaries. */
const PROGRAM_ERRORS: Record<number, string> = {
  [SOLUCKY_ERROR__UNAUTHORIZED]: 'unauthorized',
  [SOLUCKY_ERROR__INVALID_TICKET_PRICE]: 'invalidTicketPrice',
  [SOLUCKY_ERROR__FEE_TOO_HIGH]: 'feeTooHigh',
  [SOLUCKY_ERROR__INVALID_MAX_NUMBER]: 'invalidMaxNumber',
  [SOLUCKY_ERROR__PAUSED]: 'paused',
  [SOLUCKY_ERROR__WRONG_DAY]: 'wrongDay',
  [SOLUCKY_ERROR__NUMBER_OUT_OF_RANGE]: 'numberOutOfRange',
  [SOLUCKY_ERROR__INVALID_COUNTRY]: 'invalidCountry',
  [SOLUCKY_ERROR__ROUND_NOT_OPEN]: 'roundNotOpen',
  [SOLUCKY_ERROR__ROUND_NOT_OVER]: 'roundNotOver',
  [SOLUCKY_ERROR__ROUND_ALREADY_DRAWN]: 'roundAlreadyDrawn',
  [SOLUCKY_ERROR__DRAW_STILL_POSSIBLE]: 'drawStillPossible',
  [SOLUCKY_ERROR__ROUND_NOT_CLOSED]: 'roundNotClosed',
  [SOLUCKY_ERROR__TARGET_SLOT_NOT_REACHED]: 'targetSlotNotReached',
  [SOLUCKY_ERROR__RANDOMNESS_UNAVAILABLE]: 'randomnessUnavailable',
  [SOLUCKY_ERROR__ROUND_NOT_DRAWN]: 'roundNotDrawn',
  [SOLUCKY_ERROR__NOT_WINNING_TICKET]: 'notWinningTicket',
  [SOLUCKY_ERROR__ROUND_NOT_SETTLED]: 'roundNotSettled',
  [SOLUCKY_ERROR__OVERFLOW]: 'overflow',
  [SOLUCKY_ERROR__PRICE_CHANGED]: 'priceChanged',
  [SOLUCKY_ERROR__FEE_ALREADY_COLLECTED]: 'feeAlreadyCollected',
};

/** vue-i18n's `t`, or anything that turns a dictionary key into text. */
export type Translate = (key: string) => string;

/** True when the wallet reported that the user closed or declined the prompt. */
export function isUserRejection(error: unknown): boolean {
  if (getProgramErrorCode(error) !== null) return false;
  const message = error instanceof Error ? error.message : String(error);
  return (
    /user rejected|rejected the request|denied|cancell?ed/i.test(message) || (error as { code?: number })?.code === 4001
  );
}

/**
 * Turns a wallet, RPC or program error into one sentence for a toast, in the
 * page's language when given its `t`, in English otherwise.
 */
export function friendlyError(error: unknown, t?: Translate): string {
  if (!t) return isUserRejection(error) ? 'You cancelled the request in your wallet.' : describeError(error);
  if (isUserRejection(error)) return t('errors.rejected');
  const reason = errorReason(error);
  switch (reason.kind) {
    case 'program': {
      const key = PROGRAM_ERRORS[reason.code];
      return key ? t(`errors.program.${key}`) : describeError(error);
    }
    case 'number-taken':
      return t('errors.taken');
    case 'insufficient-funds':
      return t('errors.funds');
    case 'wallet-cluster':
      return t('errors.walletCluster');
    case 'other':
      // Wallet and RPC messages come as they are, in their own words.
      return reason.message || t('errors.unknown');
  }
}
