import { expect, test } from '@playwright/test';

import {
  airdrop,
  createTestWallet,
  installTestWallet,
  jumpToNextDay,
  spaced,
  type TestWallet,
  watchForPageErrors,
} from './support';

// One player goes through a whole day: buy a ticket, settle the round after
// midnight, and check the draw in the browser.
test.describe.serial('a day of S☉Lucky', () => {
  let wallet: TestWallet;
  let day: number;
  const number = 100_000_000 + Math.floor(Math.random() * 800_000_000);

  test.beforeAll(async () => {
    wallet = createTestWallet();
    await airdrop(wallet.address, 5_000_000_000);
    // A fresh day, so this player's ticket is the only one in the round.
    day = await jumpToNextDay();
  });

  test('the landing page shows the live pot', async ({ page }) => {
    const errors = watchForPageErrors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Pick a number/ })).toBeVisible();
    await expect(page.getByText(/Today's pot/i)).toBeVisible();
    await expect(page.getByText('Localnet').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('a player connects a wallet and buys a number', async ({ page }) => {
    const errors = watchForPageErrors(page);
    await installTestWallet(page, wallet);
    await page.goto('/play');

    await page.getByRole('banner').getByRole('button', { name: 'Connect wallet' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Test Wallet' }).click();
    await expect(page.getByRole('banner').getByText(wallet.address.slice(0, 4))).toBeVisible();

    await page.keyboard.type(String(number));
    const buy = page.getByRole('button', { name: `Buy ${spaced(number)} for ◎0.1` });
    await expect(buy).toBeEnabled();
    await buy.click();

    await expect(page.getByText(`Number ${spaced(number)} is yours. Good luck!`)).toBeVisible();
    await expect(page.getByRole('button', { name: `${spaced(number)} is taken today` })).toBeDisabled();
    await expect(page.getByRole('list').getByText(spaced(number), { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('after midnight the player settles the round and wins', async ({ page }) => {
    const errors = watchForPageErrors(page);
    await jumpToNextDay(2_000);
    await installTestWallet(page, wallet);
    await page.goto('/play');

    // The wallet reconnects on its own.
    await expect(page.getByRole('banner').getByText(wallet.address.slice(0, 4))).toBeVisible();
    await page.getByRole('button', { name: 'Settle' }).click();

    const label = new Date(day * 86_400_000).toISOString().slice(0, 10);
    const winner = page.getByRole('link', { name: new RegExp(`${label.slice(2)}.*${spaced(number)}`) });
    await expect(winner).toBeVisible({ timeout: 60_000 });
    expect(errors).toEqual([]);
  });

  test('the round page recomputes the draw', async ({ page }) => {
    const errors = watchForPageErrors(page);
    const label = new Date(day * 86_400_000).toISOString().slice(0, 10);
    await page.goto(`/rounds/${label}`);

    await expect(page.getByRole('heading', { name: label })).toBeVisible();
    await expect(page.getByText(spaced(number)).first()).toBeVisible();
    await page.getByRole('button', { name: 'Recompute in my browser' }).click();
    await expect(page.getByText('The draw checks out.')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
