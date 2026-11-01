/** The test SOL the faucet link asks for: the largest of faucet.solana.com's presets (0.5, 1, 2.5, 5). */
export const FAUCET_SOL = 5;

/**
 * faucet.solana.com with the request filled in, so the player only confirms
 * it: the wallet address, ◎5 and the cluster (it serves devnet and testnet).
 * Null on clusters the faucet does not serve.
 */
export function faucetUrl(cluster: string, owner?: string | null): string | null {
  if (cluster !== 'devnet' && cluster !== 'testnet') return null;
  const query = new URLSearchParams({ cluster, amount: String(FAUCET_SOL) });
  if (owner) query.set('walletAddress', owner);
  return `https://faucet.solana.com/?${query}`;
}

/**
 * The same page on another deployment of the app (each cluster has its own
 * site), or null when that deployment has no URL.
 */
export function networkHref(base: string | undefined, path: string): string | null {
  if (!base) return null;
  return `${base.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
