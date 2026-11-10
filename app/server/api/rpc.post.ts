import { SOLUCKY_PROGRAM_ADDRESS } from '@solucky/client';

import { CLUSTER_RPC, isRpcCall, type RpcCall } from '../utils/rpc';

/**
 * The site's Solana RPC endpoint, for clusters whose public endpoint refuses
 * browsers (Mainnet answers HTTP 403 to any request with an Origin). It
 * forwards the JSON-RPC calls the app makes to `NUXT_RPC_UPSTREAM` (a
 * provider's URL, token included: it never reaches the browser) or to the
 * cluster's public endpoint, and refuses everything else, so it cannot be
 * used as a general-purpose RPC. No websocket: the app polls instead.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const upstream = config.rpcUpstream || CLUSTER_RPC[config.public.cluster];
  if (!upstream) throw createError({ statusCode: 404 });

  const length = Number(getRequestHeader(event, 'content-length') ?? 0);
  if (length > 64 * 1024) throw createError({ statusCode: 413 });
  const body = await readBody<unknown>(event);
  const calls: unknown[] = Array.isArray(body) ? body : [body];
  const programId = config.public.programId || SOLUCKY_PROGRAM_ADDRESS;
  if (!calls.length || calls.length > 20 || !calls.every((call) => isRpcCall(call as RpcCall, programId))) {
    throw createError({ statusCode: 403, statusMessage: 'Method not allowed through this endpoint' });
  }

  const response = await fetch(upstream, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  setResponseStatus(event, response.status);
  setResponseHeaders(event, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  return response.text();
});
