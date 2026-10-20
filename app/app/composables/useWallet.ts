import { type Address, address as toAddress, lamports } from '@solana/kit';
import { isWalletWarmingUp, type WalletState } from '@solana/kit-plugin-wallet';

const state = shallowRef<WalletState | null>(null);
const balance = ref<bigint | null>(null);
let subscribed = false;
let balanceTimer: ReturnType<typeof setInterval> | undefined;

/** Reactive view of the browser wallet: discovery, connection and SOL balance. */
export function useWallet() {
  const { client } = useSolana();

  if (import.meta.client && !subscribed) {
    subscribed = true;
    state.value = client.wallet.getState();
    client.wallet.subscribe(() => {
      const previous = state.value?.connected?.account.address;
      state.value = client.wallet.getState();
      if (state.value.connected?.account.address !== previous) void refreshBalance();
    });
    balanceTimer ??= setInterval(() => void refreshBalance(), 20_000);
  }

  const connected = computed(() => state.value?.connected ?? null);
  const address = computed<Address | null>(() => {
    const account = connected.value?.account.address;
    return account ? toAddress(account) : null;
  });

  async function refreshBalance() {
    const owner = client.wallet.getState().connected?.account.address;
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
    wallets: computed(() => state.value?.wallets ?? []),
    connected,
    address,
    status: computed(() => state.value?.status ?? 'pending'),
    ready: computed(() => !!state.value && !isWalletWarmingUp(state.value.status)),
    balance: computed(() => (balance.value === null ? null : lamports(balance.value))),
    refreshBalance,
    connect: (wallet: WalletState['wallets'][number]) => client.wallet.connect(wallet),
    disconnect: () => client.wallet.disconnect(),
  };
}
