import { expect, type Page, test } from '@playwright/test';

import { airdrop, createTestWallet, installTestWallet, spaced, toasts, watchForPageErrors } from './support';

// Wallet behaviour seen in real extensions: MetaMask registers a Bitcoin
// wallet under the same name and may have no Solana account, and a wallet
// whose window never opens leaves its request unanswered.

const pick = () => 100_000 + Math.floor(Math.random() * 20_000_000);

function banner(page: Page) {
  return page.getByRole('banner');
}

async function chooseWallet(page: Page, name: string) {
  await banner(page).getByRole('button', { name: 'Connect wallet' }).click();
  await page.getByRole('dialog').getByRole('button', { name }).click();
}

async function startBuying(page: Page, number: number) {
  await page.keyboard.type(String(number));
  const buy = page.getByRole('button', { name: `Buy ${spaced(number)} for ◎0.1` });
  await expect(buy).toBeEnabled();
  await buy.click();
  return buy;
}

test('a wallet without sign-and-send (sign only) buys a number', async ({ page }) => {
  const errors = watchForPageErrors(page);
  const wallet = createTestWallet();
  await airdrop(wallet.address, 2_000_000_000);
  await installTestWallet(page, wallet);
  await page.goto('/play');
  await chooseWallet(page, 'Test Wallet');
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();

  const number = pick();
  await startBuying(page, number);
  await expect(page.getByText(`Number ${spaced(number)} is yours. Good luck!`)).toBeVisible();
  expect(errors).toEqual([]);
});

test('MetaMask-like: a wallet sharing its name with a Bitcoin wallet reconnects after a reload and buys', async ({
  page,
}) => {
  const errors = watchForPageErrors(page);
  const wallet = createTestWallet();
  await airdrop(wallet.address, 2_000_000_000);
  await installTestWallet(page, wallet, { name: 'MetaMask', twin: true, restoresSession: true, signAndSend: true });
  await page.goto('/play');
  await chooseWallet(page, 'MetaMask');
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();

  await page.reload();
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();

  const number = pick();
  await startBuying(page, number);
  await expect(page.getByText(`Number ${spaced(number)} is yours. Good luck!`)).toBeVisible();
  expect(errors).toEqual([]);
});

test('MetaMask-like: a wallet without a Solana account says so', async ({ page }) => {
  await installTestWallet(page, createTestWallet(), { name: 'MetaMask', twin: true, noAccounts: true });
  await page.goto('/play');
  await chooseWallet(page, 'MetaMask');

  await expect(toasts(page).getByText('Could not connect MetaMask')).toBeVisible();
  await expect(
    toasts(page).getByText(
      'MetaMask did not share a Solana account. Add or select a Solana account in MetaMask, then connect again.',
    ),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(banner(page).getByRole('button', { name: 'Connect wallet' })).toBeEnabled();
});

test('a wallet that never answers connect does not block another one', async ({ page }) => {
  const wallet = createTestWallet();
  await installTestWallet(page, createTestWallet(), { name: 'Stuck Wallet', hangConnect: true });
  await installTestWallet(page, wallet);
  await page.goto('/play');

  await chooseWallet(page, 'Stuck Wallet');
  // The connect button stays usable while the stuck request is open.
  await page.keyboard.press('Escape');
  await expect(banner(page).getByRole('button', { name: 'Connect wallet' })).toBeEnabled();

  await chooseWallet(page, 'Test Wallet');
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();
});

test('a purchase the wallet never answers can be cancelled', async ({ page }) => {
  const errors = watchForPageErrors(page);
  const wallet = createTestWallet();
  await airdrop(wallet.address, 2_000_000_000);
  await installTestWallet(page, wallet, { signAndSend: true, hangSign: true });
  await page.goto('/play');
  await chooseWallet(page, 'Test Wallet');
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();

  const number = pick();
  const buy = await startBuying(page, number);
  await expect(toasts(page).getByText('Confirm in your wallet…')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await expect(page.getByText(`Buying number ${spaced(number)}: cancelled`)).toBeVisible();
  await expect(buy).toBeEnabled();
  expect(errors).toEqual([]);
});

test('Phantom-like "Unexpected error": the toast explains it and buying the other way works', async ({ page }) => {
  const errors = watchForPageErrors(page);
  const wallet = createTestWallet();
  await airdrop(wallet.address, 2_000_000_000);
  await installTestWallet(page, wallet, { signAndSend: true, failSignAndSend: true });
  await page.goto('/play');
  await chooseWallet(page, 'Test Wallet');
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();

  const number = pick();
  await startBuying(page, number);
  await expect(toasts(page).getByText(`Buying number ${spaced(number)} failed`)).toBeVisible();
  await expect(
    toasts(page).getByText(/reported “Unexpected error”.*Make sure your wallet is on Localnet/),
  ).toBeVisible();

  // The wallet signs, the app sends: the purchase goes through.
  await page.getByRole('button', { name: 'Try another way' }).click();
  await expect(toasts(page).getByText(`Number ${spaced(number)} is yours. Good luck!`)).toBeVisible();
  expect(errors).toEqual([]);
});

test('Enter on the toast’s Cancel cancels instead of buying a second ticket', async ({ page }) => {
  const errors = watchForPageErrors(page);
  const wallet = createTestWallet();
  await airdrop(wallet.address, 2_000_000_000);
  await installTestWallet(page, wallet, { signAndSend: true, hangSign: true });
  await page.goto('/play');
  await chooseWallet(page, 'Test Wallet');
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();

  const number = pick();
  const buy = await startBuying(page, number);
  await expect(toasts(page).getByText('Confirm in your wallet…')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).focus();
  await page.keyboard.press('Enter');

  await expect(toasts(page).getByText(`Buying number ${spaced(number)}: cancelled`)).toBeVisible();
  await expect(toasts(page).getByText(`Buying number ${spaced(number)}`, { exact: true })).toHaveCount(0);
  await expect(buy).toBeEnabled();
  expect(errors).toEqual([]);
});

test('a wallet without SOL is told so before it signs anything', async ({ page }) => {
  const errors = watchForPageErrors(page);
  const wallet = createTestWallet();
  await installTestWallet(page, wallet, { signAndSend: true });
  await page.goto('/play');
  await chooseWallet(page, 'Test Wallet');
  await expect(banner(page).getByText(wallet.address.slice(0, 4))).toBeVisible();

  await page.keyboard.type('7');
  await expect(page.getByRole('button', { name: 'Not enough SOL' })).toBeDisabled();
  expect(errors).toEqual([]);
});
