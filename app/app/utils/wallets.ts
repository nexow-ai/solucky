/** The wallet the site recommends: the picker lists it first, with a badge. */
export const RECOMMENDED_WALLET = 'Solflare';

/** The wallets in the picker's order: the recommended one first, the others in the order the browser announced them. */
export function recommendedFirst<T extends { name: string }>(wallets: readonly T[]): T[] {
  const rank = (wallet: T) => (wallet.name === RECOMMENDED_WALLET ? 0 : 1);
  return [...wallets].sort((a, b) => rank(a) - rank(b));
}

/**
 * The wallet apps that open a page in their own browser, where they can
 * connect (a phone's browser has no wallet extensions), the recommended one
 * first. `page` is the page to open, `origin` the site asking.
 * https://docs.phantom.com/phantom-deeplinks/other-methods/browse
 * https://docs.solflare.com/solflare/technical/deeplinks/other-methods/browse
 */
export function walletAppLinks(page: string, origin: string): { name: string; to: string }[] {
  const url = encodeURIComponent(page);
  const ref = encodeURIComponent(origin);
  return recommendedFirst([
    { name: 'Phantom', to: `https://phantom.com/ul/browse/${url}?ref=${ref}` },
    { name: 'Solflare', to: `https://solflare.com/ul/v1/browse/${url}?ref=${ref}` },
  ]);
}

/** What `isPhone` reads of `navigator`. */
export interface BrowserInfo {
  userAgent: string;
  maxTouchPoints?: number;
  userAgentData?: { mobile?: boolean };
}

/**
 * A phone's or a tablet's browser, where wallets are apps rather than
 * extensions. iPads ask for the desktop site, so they read as a Mac with a
 * touch screen.
 */
export function isPhone(browser: BrowserInfo): boolean {
  if (browser.userAgentData?.mobile) return true;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(browser.userAgent)) return true;
  return /Macintosh/.test(browser.userAgent) && (browser.maxTouchPoints ?? 0) > 1;
}
