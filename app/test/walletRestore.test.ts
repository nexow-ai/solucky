import type { WalletState } from '@solana/kit-plugin-wallet';
import { describe, expect, it } from 'vitest';

import { walletToRestore } from '../app/utils/walletRestore';

const ADDRESS = '4ZsU5fuagtKnizPosGgyhL6RQJ9bEEMUCzdzyafyzncG';

function wallet(name: string, addresses: string[] = []) {
  return { name, accounts: addresses.map((address) => ({ address })) } as unknown as WalletState['wallets'][number];
}

function snapshot(wallets: WalletState['wallets'], overrides: Partial<WalletState> = {}): WalletState {
  return { connected: null, reconnectingTo: null, status: 'disconnected', wallets, ...overrides } as WalletState;
}

describe('walletToRestore', () => {
  it('restores the one listed wallet that already exposes the saved account', () => {
    const metaMask = wallet('MetaMask', [ADDRESS]);
    expect(walletToRestore(snapshot([wallet('Phantom'), metaMask]), `MetaMask:${ADDRESS}`)).toBe(metaMask);
  });

  it('waits until the wallet exposes the saved account, so connecting never prompts', () => {
    expect(walletToRestore(snapshot([wallet('MetaMask')]), `MetaMask:${ADDRESS}`)).toBeNull();
    expect(
      walletToRestore(
        snapshot([wallet('MetaMask', ['Other1111111111111111111111111111111111111'])]),
        `MetaMask:${ADDRESS}`,
      ),
    ).toBeNull();
  });

  it('refuses when two listed wallets carry the saved name', () => {
    const wallets = [wallet('MetaMask', [ADDRESS]), wallet('MetaMask', [ADDRESS])];
    expect(walletToRestore(snapshot(wallets), `MetaMask:${ADDRESS}`)).toBeNull();
  });

  it('does nothing without a saved wallet, while warming up or when connected', () => {
    const wallets = [wallet('MetaMask', [ADDRESS])];
    expect(walletToRestore(snapshot(wallets), null)).toBeNull();
    expect(walletToRestore(snapshot(wallets), 'malformed')).toBeNull();
    expect(walletToRestore(snapshot(wallets, { status: 'reconnecting' }), `MetaMask:${ADDRESS}`)).toBeNull();
    expect(
      walletToRestore(
        snapshot(wallets, { connected: {} as WalletState['connected'], status: 'connected' }),
        `MetaMask:${ADDRESS}`,
      ),
    ).toBeNull();
  });
});
