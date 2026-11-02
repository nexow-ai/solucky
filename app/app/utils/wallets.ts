/** The wallet the site recommends: the picker lists it first, with a badge. */
export const RECOMMENDED_WALLET = 'Solflare';

/** The wallets in the picker's order: the recommended one first, the others in the order the browser announced them. */
export function recommendedFirst<T extends { name: string }>(wallets: readonly T[]): T[] {
  const rank = (wallet: T) => (wallet.name === RECOMMENDED_WALLET ? 0 : 1);
  return [...wallets].sort((a, b) => rank(a) - rank(b));
}
