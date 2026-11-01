import { lamports } from '@solana/kit';

/** What the local validator airdrops: enough for a handful of tickets. */
const LOCAL_AIRDROP_LAMPORTS = 1_000_000_000n;

const airdropping = ref(false);

/**
 * Test SOL for the connected wallet, on every cluster but mainnet. Devnet and
 * testnet get a link to faucet.solana.com with the address and ◎5 filled in
 * (public RPCs rate-limit `requestAirdrop`, often with HTTP 429); the local
 * validator airdrops directly.
 */
export function useFaucet() {
  const { t } = useI18n();
  const { client, cluster, clusterLabel, isMainnet } = useSolana();
  const { address, balance, refreshBalance } = useWallet();
  const toast = useToast();

  const available = computed(() => !isMainnet && !!address.value);
  /** The faucet page for this wallet; null on localnet, which airdrops instead. */
  const url = computed(() => (available.value ? faucetUrl(cluster, address.value) : null));

  /** Wait until the wallet balance rises after a local airdrop. */
  async function waitForAirdrop(before: bigint | null) {
    for (let i = 0; i < 20; i++) {
      await refreshBalance();
      const next = balance.value;
      if (next !== null && (before === null || next > before)) return;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(t('faucet.slow'));
  }

  /**
   * Run on the Get SOL button's click. Where `url` is set, the button is a
   * link that opens the faucet by itself, and this only says what to do there.
   */
  async function request() {
    const owner = address.value;
    if (!owner || isMainnet) return;
    if (url.value) {
      toast.add({
        title: t('faucet.request'),
        description: t('faucet.requestHint', { amount: FAUCET_SOL }),
        color: 'success',
        icon: 'i-lucide-external-link',
      });
      return;
    }
    if (airdropping.value) return;
    airdropping.value = true;
    try {
      const before = balance.value;
      await client.rpc.requestAirdrop(owner, lamports(LOCAL_AIRDROP_LAMPORTS), { commitment: 'confirmed' }).send();
      await waitForAirdrop(before);
      toast.add({
        title: t('faucet.airdropped'),
        description: t('faucet.airdroppedHint', { cluster: clusterLabel }),
        color: 'success',
        icon: 'i-lucide-sparkles',
      });
    } catch (error) {
      toast.add({
        title: t('faucet.failed'),
        description: friendlyError(error, t),
        color: 'error',
        icon: 'i-lucide-cloud-off',
      });
    } finally {
      airdropping.value = false;
    }
  }

  return { available, url, busy: readonly(airdropping), request };
}
