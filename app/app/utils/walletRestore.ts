import type { WalletState } from '@solana/kit-plugin-wallet';

/** Where kit-plugin-wallet keeps the last connected wallet, as `name:address`. */
export const WALLET_STORAGE_KEY = 'solucky:wallet';

type Wallet = WalletState['wallets'][number];

/**
 * The wallet to reconnect when kit-plugin-wallet gave up because the saved
 * wallet's name is not unique: MetaMask registers a Solana wallet and a Bitcoin
 * wallet, both named "MetaMask", and the plugin then never restores it.
 *
 * Only a wallet that already exposes the saved account qualifies, so connecting
 * it cannot open a prompt, and only when one listed wallet (the list holds the
 * Solana wallets for this cluster) carries the saved name.
 */
export function walletToRestore(snapshot: WalletState, saved: string | null): Wallet | null {
  if (!saved || snapshot.connected || snapshot.status !== 'disconnected') return null;
  const separator = saved.lastIndexOf(':');
  if (separator <= 0) return null;
  const name = saved.slice(0, separator);
  const account = saved.slice(separator + 1);
  const matches = snapshot.wallets.filter((wallet) => wallet.name === name);
  const wallet = matches.length === 1 ? matches[0]! : null;
  return wallet?.accounts.some((a) => a.address === account) ? wallet : null;
}

type Connection = NonNullable<WalletState['connected']>;

/** One wallet's account, as `name:address`, the way the storage key saves it. */
export function connectionKey(connection: Connection): string {
  return `${connection.wallet.name}:${connection.account.address}`;
}

/** The connection the page shows: none while it is the one the player dropped (`dropped`, a `connectionKey`). */
export function visibleConnection(snapshot: WalletState | null, dropped: string | null): Connection | null {
  const connection = snapshot?.connected ?? null;
  return connection && connectionKey(connection) !== dropped ? connection : null;
}
