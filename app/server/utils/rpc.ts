/** Each cluster's public endpoint, which the RPC proxy and the crank fall back on. */
export const CLUSTER_RPC: Record<string, string> = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  localnet: 'http://127.0.0.1:8899',
};

/**
 * The JSON-RPC methods the app calls (directly, or through Kit's helpers and
 * the program client). The proxy refuses the rest.
 */
const METHODS = new Set([
  'getAccountInfo',
  'getBalance',
  'getBlockHeight',
  'getEpochInfo',
  'getFeeForMessage',
  'getGenesisHash',
  'getHealth',
  'getLatestBlockhash',
  'getMinimumBalanceForRentExemption',
  'getMultipleAccounts',
  'getProgramAccounts',
  'getRecentPrioritizationFees',
  'getSignatureStatuses',
  'getSlot',
  'getVersion',
  'isBlockhashValid',
  'sendTransaction',
  'simulateTransaction',
]);

export type RpcCall = { jsonrpc?: unknown; method?: unknown; params?: unknown };

/**
 * Whether the proxy forwards a JSON-RPC call: a known method, and for
 * `getProgramAccounts` (the costly scan) only over S☉Lucky's own program.
 */
export function isRpcCall(call: RpcCall | null | undefined, programId: string): boolean {
  if (!call || typeof call !== 'object' || call.jsonrpc !== '2.0' || typeof call.method !== 'string') return false;
  if (!METHODS.has(call.method)) return false;
  if (call.method === 'getProgramAccounts') {
    return Array.isArray(call.params) && call.params[0] === programId;
  }
  return true;
}
