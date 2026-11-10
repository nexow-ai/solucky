import { type Address, address, createClient } from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { walletSigner } from '@solana/kit-plugin-wallet';
import { rpcEndpoint, SOLUCKY_PROGRAM_ADDRESS, soluckyProgram } from '@solucky/client';

import { WALLET_STORAGE_KEY } from '../utils/walletRestore';
import { setPriorityFee, walletAwareSend } from '../utils/walletSend';

export type Cluster = 'mainnet' | 'devnet' | 'testnet' | 'localnet';

/**
 * Each cluster's endpoint when the site sets none. Solana's public Mainnet
 * endpoint refuses browsers (HTTP 403), so Mainnet goes through the site's
 * own proxy (server/api/rpc.post.ts), which has no websocket.
 */
const CLUSTERS: Record<Cluster, { rpcUrl: string; label: string; explorerQuery: string }> = {
  mainnet: { rpcUrl: '/api/rpc', label: 'Mainnet', explorerQuery: '' },
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
      .use(walletSigner({ chain: `solana:${options.cluster}`, storageKey: WALLET_STORAGE_KEY }))
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

  // A token only belongs to a configured provider, never to the public endpoint.
  const endpoint = config.rpcUrl
    ? rpcEndpoint({ url: config.rpcUrl, wsUrl: config.rpcWsUrl, token: config.rpcToken, tokenIn: 'path' })
    : { rpcUrl: settings.rpcUrl, rpcSubscriptionsUrl: undefined };
  const proxied = endpoint.rpcUrl.startsWith('/');

  if (!client) {
    // The proxy lives on this site: Kit needs its absolute address.
    const rpcUrl = proxied ? new URL(endpoint.rpcUrl, useRequestURL()).href : endpoint.rpcUrl;
    setPriorityFee(BigInt(config.priorityFee || 0));
    client = createSoluckyClient({ cluster, rpcUrl, rpcWsUrl: endpoint.rpcSubscriptionsUrl, programAddress });
  }

  return {
    client,
    cluster,
    /** Whether the endpoint has websockets; without them, pages poll. */
    subscriptions: !proxied,
    clusterLabel: settings.label,
    isMainnet: cluster === 'mainnet',
    programAddress,
    explorer: (kind: 'address' | 'tx' | 'block', id: string | bigint) =>
      `https://explorer.solana.com/${kind}/${id}${settings.explorerQuery}`,
  };
}
