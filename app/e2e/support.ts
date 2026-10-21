import { generateKeyPairSync } from 'node:crypto';

import type { Page } from '@playwright/test';
import { getAddressDecoder } from '@solana/kit';

const RPC_URL = process.env.SOLANA_RPC_URL || 'http://127.0.0.1:8899';
const DAY_MS = 86_400_000;

/** Calls the local RPC, including Surfpool cheatcodes. */
export async function rpc<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const body = (await response.json()) as { error?: { message: string }; result: T };
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}

/** The cluster's clock, in milliseconds. */
export async function clusterNow(): Promise<number> {
  const info = await rpc<{ value: { data: [string, string] } }>('getAccountInfo', [
    'SysvarC1ock11111111111111111111111111111111',
    { encoding: 'base64' },
  ]);
  return Number(Buffer.from(info.value.data[0], 'base64').readBigInt64LE(32)) * 1000;
}

/** Moves the cluster to `offsetMs` after the start of the next UTC day. */
export async function jumpToNextDay(offsetMs = 60_000): Promise<number> {
  const day = Math.floor((await clusterNow()) / DAY_MS) + 1;
  await rpc('surfnet_timeTravel', [{ absoluteTimestamp: day * DAY_MS + offsetMs }]);
  return day;
}

export async function airdrop(address: string, lamports: number): Promise<void> {
  await rpc('requestAirdrop', [address, lamports]);
  for (let i = 0; i < 30; i++) {
    const { value } = await rpc<{ value: number }>('getBalance', [address]);
    if (value >= lamports) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`airdrop to ${address} did not land`);
}

export interface TestWallet {
  address: string;
  jwk: JsonWebKey;
}

/** A fresh Ed25519 keypair, kept by the test so the same wallet survives reloads. */
export function createTestWallet(): TestWallet {
  const { privateKey } = generateKeyPairSync('ed25519');
  const jwk = privateKey.export({ format: 'jwk' });
  const address = getAddressDecoder().decode(Buffer.from(jwk.x!, 'base64url'));
  return { address, jwk };
}

/**
 * Registers `wallet` in the page as a Wallet Standard wallet that signs every
 * transaction it is asked to, like a real extension would after approval.
 */
export async function installTestWallet(page: Page, wallet: TestWallet): Promise<void> {
  await page.addInitScript(({ address, jwk }) => {
    const base64url = (value: string) =>
      Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    const key = crypto.subtle.importKey('jwk', jwk, { name: 'Ed25519' }, false, ['sign']);
    const account = {
      address,
      publicKey: base64url(jwk.x!),
      chains: ['solana:localnet'],
      features: ['solana:signTransaction'],
      label: 'Test',
    };
    const listeners = new Set<(event: { accounts: (typeof account)[] }) => void>();
    const shortvec = (bytes: Uint8Array) => {
      let value = 0;
      let size = 0;
      for (;;) {
        const byte = bytes[size]!;
        value |= (byte & 0x7f) << (7 * size);
        size++;
        if (!(byte & 0x80)) return [value, size] as const;
      }
    };
    const icon = `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#a21caf"/></svg>',
    )}`;
    const wallet = {
      version: '1.0.0',
      name: 'Test Wallet',
      icon,
      chains: ['solana:localnet'],
      accounts: [] as (typeof account)[],
      features: {
        'standard:connect': {
          version: '1.0.0',
          connect: async () => {
            wallet.accounts = [account];
            listeners.forEach((listener) => listener({ accounts: wallet.accounts }));
            return { accounts: wallet.accounts };
          },
        },
        'standard:disconnect': {
          version: '1.0.0',
          disconnect: async () => {
            wallet.accounts = [];
            listeners.forEach((listener) => listener({ accounts: [] }));
          },
        },
        'standard:events': {
          version: '1.0.0',
          on: (_event: string, listener: (event: { accounts: (typeof account)[] }) => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
          },
        },
        'solana:signTransaction': {
          version: '1.0.0',
          supportedTransactionVersions: ['legacy', 0],
          signTransaction: (...inputs: { transaction: Uint8Array }[]) =>
            Promise.all(
              inputs.map(async ({ transaction }) => {
                // Wire format: shortvec signature count, signatures, then the message.
                const signed = new Uint8Array(transaction);
                const [count, size] = shortvec(signed);
                const message = signed.slice(size + 64 * count);
                const signature = await crypto.subtle.sign({ name: 'Ed25519' }, await key, message);
                signed.set(new Uint8Array(signature), size);
                return { signedTransaction: signed };
              }),
            ),
        },
      },
    };
    const register = (api: { register: (w: typeof wallet) => void }) => api.register(wallet);
    window.addEventListener('wallet-standard:app-ready', (event) =>
      register((event as CustomEvent<{ register: (w: typeof wallet) => void }>).detail),
    );
    window.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', { detail: register }));
  }, wallet);
}

/** Records Content Security Policy violations and uncaught errors on the page. */
export function watchForPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /Content Security Policy/i.test(message.text())) errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

/** `482613957` → `482 613 957`, as the app shows numbers. */
export function spaced(number: number): string {
  return new Intl.NumberFormat('en-US').format(number).replaceAll(',', ' ');
}
