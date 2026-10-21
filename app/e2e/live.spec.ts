import { expect, test } from '@playwright/test';

import { airdrop, createTestWallet, installTestWallet, spaced, watchForPageErrors } from './support';

// Two players at the table. One watches; the other walks in and buys a
// number. The watcher sees the newcomer join over the live socket, then the
// ticket land, read from the chain.
test('a player at the table sees another join and buy, live', async ({ browser }) => {
  const player = createTestWallet();
  await airdrop(player.address, 2_000_000_000);
  const number = 100_000_000 + Math.floor(Math.random() * 800_000_000);

  const watcher = await (await browser.newContext()).newPage();
  const watcherErrors = watchForPageErrors(watcher);
  await watcher.goto('/play');
  await expect(watcher.getByText('Live', { exact: true })).toBeVisible();

  const page = await (await browser.newContext()).newPage();
  const errors = watchForPageErrors(page);
  await installTestWallet(page, player);
  await page.goto('/play');
  // The toast and the ticker can both show the line.
  await expect(watcher.getByText('A new player joined the table').first()).toBeVisible();

  await page.getByRole('banner').getByRole('button', { name: 'Connect wallet' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Test Wallet' }).click();
  await expect(page.getByRole('banner').getByText(player.address.slice(0, 4))).toBeVisible();
  await page.keyboard.type(String(number));
  await page.getByRole('button', { name: `Buy ${spaced(number)} for ◎0.1` }).click();
  await expect(page.getByText(`Number ${spaced(number)} is yours. Good luck!`)).toBeVisible();

  // A string, not a RegExp: only string matching treats the app's no-break
  // digit spaces as spaces.
  await expect(watcher.getByText(`locked in ${spaced(number)}`).first()).toBeVisible();
  await expect(watcher.getByRole('list').getByText(spaced(number), { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  expect(watcherErrors).toEqual([]);
});
