import { type Address, address as toAddress, lamports } from '@solana/kit';
import { isWalletWarmingUp, type WalletState } from '@solana/kit-plugin-wallet';

import { connectionKey, visibleConnection, WALLET_STORAGE_KEY, walletToRestore } from '../utils/walletRestore';
import { recommendedFirst } from '../utils/wallets';

const state = shallowRef<WalletState | null>(null);
const balance = ref<bigint | null>(null);
let subscribed = false;
let balanceTimer: ReturnType<typeof setInterval> | undefined;
/** Set once the page restored a wallet itself, or the player picked or dropped one. */
let restoreSettled = false;
/**
 * The connection (wallet and account) the player disconnected but whose wallet
 * never confirmed it: a stuck extension never answers `standard:disconnect`,
 * which would keep the page "connected" to it for good. The page forgets it.
 */
const dropped = ref<string | null>(null);
/** How long a wallet gets to confirm a disconnect before the page forgets it anyway. */
const DISCONNECT_TIMEOUT_MS = 3_000;

type Wallet = WalletState['wallets'][number];

/** Reactive view of the browser wallet: discovery, connection and SOL balance. */
export function useWallet() {
  const { client } = useSolana();

  function restore() {
    if (restoreSettled) return;
    let saved: string | null;
    try {
      saved = localStorage.getItem(WALLET_STORAGE_KEY);
    } catch {
      return;
    }
    const wallet = walletToRestore(client.wallet.getState(), saved);
    if (!wallet) return;
    restoreSettled = true;
    client.wallet.connect(wallet).catch(() => {});
  }

  if (import.meta.client && !subscribed) {
    subscribed = true;
    state.value = client.wallet.getState();
    client.wallet.subscribe(() => {
      const previous = state.value?.connected?.account.address;
      state.value = client.wallet.getState();
      if (state.value.connected?.account.address !== previous) void refreshBalance();
      restore();
    });
    restore();
    balanceTimer ??= setInterval(() => void refreshBalance(), 20_000);
  }

  const connected = computed(() => visibleConnection(state.value, dropped.value));
  const address = computed<Address | null>(() => {
    const account = connected.value?.account.address;
    return account ? toAddress(account) : null;
  });

  async function refreshBalance() {
    const owner = visibleConnection(client.wallet.getState(), dropped.value)?.account.address;
    if (!owner) {
      balance.value = null;
      return;
    }
    try {
      const { value } = await client.rpc.getBalance(toAddress(owner), { commitment: 'confirmed' }).send();
      balance.value = value;
    } catch {
      // Keep the last known balance; the next tick retries.
    }
  }

  return {
    /** The Solana wallets in this browser, the recommended one (Solflare) first. */
    wallets: computed(() => recommendedFirst(state.value?.wallets ?? [])),
    connected,
    address,
    status: computed(() => state.value?.status ?? 'pending'),
    ready: computed(() => !!state.value && !isWalletWarmingUp(state.value.status)),
    balance: computed(() => (balance.value === null ? null : lamports(balance.value))),
    refreshBalance,
    connect: (wallet: Wallet) => {
      restoreSettled = true;
      dropped.value = null;
      return client.wallet.connect(wallet);
    },
    disconnect: async () => {
      restoreSettled = true;
      const current = client.wallet.getState().connected;
      const finished = client.wallet.disconnect().then(
        () => true,
        () => true,
      );
      const timeout = new Promise<false>((resolve) => setTimeout(() => resolve(false), DISCONNECT_TIMEOUT_MS));
      if ((await Promise.race([finished, timeout])) || !current) return;
      dropped.value = connectionKey(current);
      balance.value = null;
      try {
        // Or the next visit would reconnect to it.
        localStorage.removeItem(WALLET_STORAGE_KEY);
      } catch {
        // Nothing saved to forget.
      }
    },
  };
}
