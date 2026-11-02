import { describe, expect, it } from 'vitest';

import { isPhone, RECOMMENDED_WALLET, recommendedFirst, walletAppLinks } from '../app/utils/wallets';

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

describe('walletAppLinks', () => {
  it('opens the page in each wallet app, the recommended one first', () => {
    const links = walletAppLinks('https://solucky.me/play/hourly?x=1', 'https://solucky.me');
    expect(names(links)).toEqual(['Solflare', 'Phantom']);
    expect(links[0]!.to).toBe(
      'https://solflare.com/ul/v1/browse/https%3A%2F%2Fsolucky.me%2Fplay%2Fhourly%3Fx%3D1?ref=https%3A%2F%2Fsolucky.me',
    );
    expect(links[1]!.to).toBe(
      'https://phantom.com/ul/browse/https%3A%2F%2Fsolucky.me%2Fplay%2Fhourly%3Fx%3D1?ref=https%3A%2F%2Fsolucky.me',
    );
  });
});

describe('isPhone', () => {
  const IPHONE =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
  const ANDROID =
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
  const MAC =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
  const LINUX = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

  it('knows phones and tablets', () => {
    expect(isPhone({ userAgent: IPHONE })).toBe(true);
    expect(isPhone({ userAgent: ANDROID })).toBe(true);
    // An iPad asks for the desktop site: a Mac with a touch screen.
    expect(isPhone({ userAgent: MAC, maxTouchPoints: 5 })).toBe(true);
    expect(isPhone({ userAgent: LINUX, userAgentData: { mobile: true } })).toBe(true);
  });

  it('leaves computers out', () => {
    expect(isPhone({ userAgent: MAC, maxTouchPoints: 0 })).toBe(false);
    expect(isPhone({ userAgent: LINUX, userAgentData: { mobile: false } })).toBe(false);
  });
});
