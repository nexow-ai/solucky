import { describe, expect, test } from 'bun:test';

import { rpcEndpoint, toWebSocketUrl, withAuthToken } from '../src';

const HOST = 'https://example-name.solana-devnet.quiknode.pro';

describe('RPC endpoints with an auth token', () => {
  test('put the token last in the path, the way QuickNode provider URLs carry it', () => {
    expect(withAuthToken(HOST, 'abc123')).toBe(`${HOST}/abc123/`);
    expect(withAuthToken(`${HOST}/`, 'abc123')).toBe(`${HOST}/abc123/`);
    expect(withAuthToken(`${HOST}/abc123/`, 'abc123')).toBe(`${HOST}/abc123/`);
    expect(withAuthToken(HOST, undefined)).toBe(HOST);
    expect(withAuthToken(HOST, '')).toBe(HOST);
  });

  test('turn HTTP URLs into WebSocket URLs', () => {
    expect(toWebSocketUrl(`${HOST}/`)).toBe('wss://example-name.solana-devnet.quiknode.pro/');
    expect(toWebSocketUrl('http://127.0.0.1:8899')).toBe('ws://127.0.0.1:8899/');
  });

  test('browsers carry the token in both paths', () => {
    expect(rpcEndpoint({ url: `${HOST}/`, token: 'abc123', tokenIn: 'path' })).toEqual({
      rpcUrl: `${HOST}/abc123/`,
      rpcSubscriptionsUrl: 'wss://example-name.solana-devnet.quiknode.pro/abc123/',
      headers: undefined,
    });
  });

  test('scripts send it as a header and keep the HTTP URL token-free', () => {
    const endpoint = rpcEndpoint({
      url: `${HOST}/`,
      wsUrl: 'wss://example-name.solana-devnet.quiknode.pro/',
      token: 'abc123',
      tokenIn: 'header',
    });
    expect(endpoint.rpcUrl).toBe(`${HOST}/`);
    expect(endpoint.headers).toEqual({ 'x-token': 'abc123' });
    // WebSockets cannot carry headers.
    expect(endpoint.rpcSubscriptionsUrl).toBe('wss://example-name.solana-devnet.quiknode.pro/abc123/');
  });

  test('leave URLs alone without a token', () => {
    expect(rpcEndpoint({ url: 'https://api.devnet.solana.com', tokenIn: 'header' })).toEqual({
      rpcUrl: 'https://api.devnet.solana.com',
      rpcSubscriptionsUrl: undefined,
    });
  });
});
