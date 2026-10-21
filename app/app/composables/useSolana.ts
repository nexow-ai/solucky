import { type Address, address, createClient } from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { walletSigner } from '@solana/kit-plugin-wallet';
import { SOLUCKY_PROGRAM_ADDRESS, soluckyProgram } from '@solucky/client';

import { walletAwareSend } from '../utils/walletSend';

export type Cluster = 'mainnet' | 'devnet' | 'testnet' | 'localnet';

const CLUSTERS: Record<Cluster, { rpcUrl: string; label: string; explorerQuery: string }> = {
  mainnet: { rpcUrl: 'https://api.mainnet-beta.solana.com', label: 'Mainnet', explorerQuery: '' },
  devnet: { rpcUrl: 'https://api.devnet.solana.com', label: 'Devnet', explorerQuery: '?cluster=devnet' },
  testnet: { rpcUrl: 'https://api.testnet.solana.com', label: 'Testnet', explorerQuery: '?cluster=testnet' },
  localnet: {
    rpcUrl: 'http://127.0.0.1:8899',
    label: 'Localnet',
    explorerQuery: `?cluster=custom&customUrl=${encodeURIComponent('http://127.0.0.1:8899')}`,
  },
};

function createSoluckyClient(options: {
  cluster: Cluster;
  rpcUrl: string;
  rpcWsUrl?: string;
  programAddress: Address;
}) {
  return (
    createClient()
      .use(walletSigner({ chain: `solana:${options.cluster}`, storageKey: 'solucky:wallet' }))
      .use(
        solanaRpc({
          rpcUrl: options.rpcUrl,
          rpcSubscriptionsUrl: options.rpcWsUrl || undefined,
          // Kit plans version 1 transactions by default; most wallets only sign
          // legacy and version 0 ones, so stay on version 0.
          transactionConfig: { version: 0 },
        }),
      )
      // Phantom and similar wallets are more reliable when they sign and send
      // themselves than when the app asks them only to sign.
      .use(walletAwareSend())
      .use(soluckyProgram({ programAddress: options.programAddress }))
  );
}

export type SoluckyClient = ReturnType<typeof createSoluckyClient>;

let client: SoluckyClient | undefined;

if (import.meta.hot) {
  // Drop the singleton on HMR so plugin changes (wallet send path, etc.) apply.
  import.meta.hot.dispose(() => {
    client = undefined;
  });
}

/** The Solana client shared by the whole app, with the wallet and the program plugin. */
export function useSolana() {
  const config = useRuntimeConfig().public;
  const cluster = (config.cluster in CLUSTERS ? config.cluster : 'devnet') as Cluster;
  const settings = CLUSTERS[cluster];
  const programAddress = config.programId ? address(config.programId) : SOLUCKY_PROGRAM_ADDRESS;

  client ??= createSoluckyClient({
    cluster,
    rpcUrl: config.rpcUrl || settings.rpcUrl,
    rpcWsUrl: config.rpcWsUrl,
    programAddress,
  });

  return {
    client,
    cluster,
    clusterLabel: settings.label,
    isMainnet: cluster === 'mainnet',
    programAddress,
    explorer: (kind: 'address' | 'tx' | 'block', id: string | bigint) =>
      `https://explorer.solana.com/${kind}/${id}${settings.explorerQuery}`,
  };
}
