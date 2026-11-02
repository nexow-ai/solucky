import { describe, expect, it } from 'vitest';

import { RECOMMENDED_WALLET, recommendedFirst } from '../app/utils/wallets';

const names = (wallets: { name: string }[]) => wallets.map((wallet) => wallet.name);

describe('recommendedFirst', () => {
  it('recommends Solflare', () => {
    expect(RECOMMENDED_WALLET).toBe('Solflare');
  });

  it('lists the recommended wallet first and keeps the others in their order', () => {
    const wallets = [{ name: 'Phantom' }, { name: 'Backpack' }, { name: 'Solflare' }, { name: 'MetaMask' }];
    expect(names(recommendedFirst(wallets))).toEqual(['Solflare', 'Phantom', 'Backpack', 'MetaMask']);
    // The browser's list is left as it was.
    expect(names(wallets)).toEqual(['Phantom', 'Backpack', 'Solflare', 'MetaMask']);
  });

  it('leaves the list as it is without the recommended wallet', () => {
    expect(names(recommendedFirst([{ name: 'Phantom' }, { name: 'Backpack' }]))).toEqual(['Phantom', 'Backpack']);
    expect(recommendedFirst([])).toEqual([]);
  });
});
