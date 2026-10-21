import type { Cluster } from '../composables/useSolana';

/** Devnet / testnet / mainnet genesis hashes Phantom (and others) recognize. */
const GENESIS: Partial<Record<Cluster, string>> = {
  mainnet: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
  devnet: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
  testnet: '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
};

type PhantomLike = {
  changeNetwork?: (network: string) => Promise<unknown>;
  request?: (args: { method: string; params?: unknown }) => Promise<unknown>;
  switchNetwork?: (network: string) => Promise<unknown>;
};

/**
 * Best-effort: ask the injected wallet to use the same cluster as the app.
 * Silent on failure — Wallet Standard already tags each sign request with the
 * chain, but Phantom still misbehaves when its UI network disagrees.
 */
export async function ensureWalletCluster(cluster: Cluster): Promise<void> {
  if (!import.meta.client || cluster === 'localnet') return;

  const injected = window as Window & {
    phantom?: { solana?: PhantomLike };
    solana?: PhantomLike;
  };
  const provider = injected.phantom?.solana ?? injected.solana;
  if (!provider) return;

  const network = cluster === 'mainnet' ? 'mainnet' : cluster;
  const genesisHash = GENESIS[cluster];

  try {
    if (typeof provider.switchNetwork === 'function') {
      await provider.switchNetwork(network);
      return;
    }
    if (typeof provider.changeNetwork === 'function') {
      await provider.changeNetwork(network);
      return;
    }
    if (typeof provider.request === 'function' && genesisHash) {
      await provider.request({
        method: 'wallet_changeNetwork',
        params: { genesisHash },
      });
    }
  } catch {
    // User declined or the wallet has no switch API — signing may still work.
  }
}
