/**
 * RPC endpoints for providers that authenticate with a token, as QuickNode does
 * (https://www.quicknode.com/docs/solana/endpoint-security). The token goes
 * either at the end of the URL path (`https://name.solana-devnet.quiknode.pro/<token>/`)
 * or, for HTTP requests only, in an `x-token` header.
 *
 * Browsers must use the path: a WebSocket cannot carry headers, and QuickNode's
 * CORS policy does not allow `x-token`. Servers and scripts can use the header
 * for HTTP, which keeps the token out of every URL they log.
 */

/** `url` with `token` as its last path segment, the way QuickNode's provider URLs carry it. */
export function withAuthToken(url: string, token?: string): string {
  if (!token) return url;
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.at(-1) !== token) segments.push(token);
  parsed.pathname = `/${segments.join('/')}/`;
  return parsed.toString();
}

/** The WebSocket URL for an HTTP RPC URL: `https:` becomes `wss:`, `http:` becomes `ws:`. */
export function toWebSocketUrl(url: string): string {
  const parsed = new URL(url);
  if (parsed.protocol === 'https:') parsed.protocol = 'wss:';
  else if (parsed.protocol === 'http:') parsed.protocol = 'ws:';
  return parsed.toString();
}

export interface RpcEndpoint {
  /** The HTTP URL to send requests to. */
  rpcUrl: string;
  /** The WebSocket URL for subscriptions, with the token in its path when there is one. */
  rpcSubscriptionsUrl?: string;
  /** Headers for every HTTP request (`x-token` when the token travels as a header). */
  headers?: { 'x-token': string };
}

/**
 * Where to reach an RPC provider, given its URLs without the token and the
 * token itself. Without a token, the URLs are used as they are.
 *
 * @param tokenIn `path` for browsers, `header` to keep the HTTP URL token-free.
 */
export function rpcEndpoint({
  url,
  wsUrl,
  token,
  tokenIn,
}: {
  url: string;
  wsUrl?: string;
  token?: string;
  tokenIn: 'path' | 'header';
}): RpcEndpoint {
  if (!token) return { rpcUrl: url, rpcSubscriptionsUrl: wsUrl || undefined };
  return {
    rpcUrl: tokenIn === 'path' ? withAuthToken(url, token) : url,
    rpcSubscriptionsUrl: withAuthToken(wsUrl || toWebSocketUrl(url), token),
    headers: tokenIn === 'header' ? { 'x-token': token } : undefined,
  };
}
