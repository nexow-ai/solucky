/**
 * The screenshots browsers show in their install dialog
 * (app/public/manifest.webmanifest): the daily lottery's play page, wide and
 * narrow, taken from a running site. Retake them when the page changes.
 *
 *   bun run screenshots                      the app on http://127.0.0.1:3000
 *   bun run screenshots https://solucky.me   the live site
 *
 * Uses Playwright's Chromium (`bunx playwright install chromium`), or the
 * browser at CHROME_PATH.
 */
import { mkdirSync } from 'node:fs';

import { chromium } from '@playwright/test';

const site = (process.argv[2] ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const dir = new URL('../app/public/screenshots/', import.meta.url).pathname;
// The sizes the manifest declares: 1280×800, and 780×1688 (390×844 at 2×).
const SHOTS = [
  { file: 'play-wide.jpg', viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  { file: 'play-narrow.jpg', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
];

mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
for (const { file, ...options } of SHOTS) {
  const page = await browser.newPage({ ...options, colorScheme: 'dark', locale: 'en-US' });
  await page.goto(`${site}/play`);
  // The round, the pot and the live table come in after the page loads.
  await page.waitForTimeout(6_000);
  await page.screenshot({ path: dir + file, type: 'jpeg', quality: 85 });
  console.log(`app/public/screenshots/${file}`);
  await page.close();
}
await browser.close();
