/**
 * Why the Buy button can't buy right now, or `null` when it can. One place
 * decides it, so the button, its label and the Enter key always agree; the
 * program still checks everything again on-chain.
 */
export type BuyBlock =
  /** The round on sale or its price hasn't loaded yet. */
  | 'loading'
  /** Loading failed and nothing is known about the round on sale. */
  | 'unavailable'
  | 'notSetUp'
  | 'paused'
  | 'taken'
  | 'outOfRange'
  /** A lottery round in its last seconds: the purchase could land in the next one. */
  | 'closing'
  /** The round on sale is drawn or settled (a Guess round whose number was found). */
  | 'over'
  | 'full'
  | 'notEnough'
  | 'busy'
  | 'spinning';

/** Seconds before a lottery round ends when buying stops, so a purchase lands in the round shown. */
export const CLOSING_MS = 5_000;

export interface BuyState {
  price: bigint | null;
  period: number | null;
  loading: boolean;
  /** Loading the game failed (the page shows the error). */
  failed: boolean;
  notSetUp: boolean;
  paused: boolean;
  taken: boolean;
  tooBig: boolean;
  lottery: boolean;
  /** Milliseconds until the lottery round on sale ends, by the cluster clock. */
  msLeft: number;
  /** Whether the round on sale still takes tickets; `true` while nobody opened it yet. */
  open: boolean;
  full: boolean;
  /** The wallet's balance, or `null` while unknown. */
  balance: bigint | null;
  /** What the purchase costs in all (price, rent and fees), or `null` while unknown. */
  cost: bigint | null;
  busy: boolean;
  spinning: boolean;
}

export function buyBlock(s: BuyState): BuyBlock | null {
  if (s.notSetUp) return 'notSetUp';
  if (s.price === null || s.period === null) return s.failed && !s.loading ? 'unavailable' : 'loading';
  if (s.paused) return 'paused';
  if (s.lottery && s.msLeft < CLOSING_MS) return 'closing';
  if (!s.open) return 'over';
  if (s.full) return 'full';
  if (s.taken) return 'taken';
  if (s.tooBig) return 'outOfRange';
  if (s.balance !== null && s.cost !== null && s.balance < s.cost) return 'notEnough';
  if (s.spinning) return 'spinning';
  if (s.busy) return 'busy';
  return null;
}

/** Lamports a transaction fee can take: the base fee plus a wallet's priority fee. */
export const FEE_ALLOWANCE = 100_000n;

/**
 * What buying a ticket takes from the wallet: the price, the ticket's rent,
 * the rent of the 4 bytes a lottery round grows by, the round's rent for its
 * first buyer, and a fee allowance. The rent comes back when the ticket is
 * closed. `rentPerByte` is the rent of one byte, `overhead` the bytes every
 * account is charged for on top of its data.
 */
export function purchaseCost({
  price,
  lottery,
  roundExists,
  ticketSize,
  roundSize,
  rentPerByte,
  overhead = 128n,
}: {
  price: bigint;
  lottery: boolean;
  roundExists: boolean;
  ticketSize: number;
  roundSize: number;
  rentPerByte: bigint;
  overhead?: bigint;
}): bigint {
  const rent = (bytes: number) => (overhead + BigInt(bytes)) * rentPerByte;
  return (
    price + rent(ticketSize) + (lottery ? 4n * rentPerByte : 0n) + (roundExists ? 0n : rent(roundSize)) + FEE_ALLOWANCE
  );
}
