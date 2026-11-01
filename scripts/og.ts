/**
 * The image that shared links show (app/public/og.png, 1200×630): the
 * landing's hero, laid out as a card and taken from a running site. Retake it
 * when the hero changes.
 *
 *   bun run og                       the app on http://127.0.0.1:3000
 *   bun run og https://solucky.me    the live site
 *
 * The card keeps what lasts: the headline, the games, and the dial with its
 * draw time, not today's pot or countdown, which would be stale wherever the
 * card is shared. It finds the hero by its `data-hero*` marks in
 * app/app/pages/index.vue and the dial's core by its `data-dial-*` marks in
 * components/landing/HeroDialLive.vue; keep them when changing those.
 *
 * Uses Playwright's Chromium (`bunx playwright install chromium`), or the
 * browser at CHROME_PATH.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';

import en from '../app/i18n/locales/en';

const site = (process.argv[2] ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const file = new URL('../app/public/og.png', import.meta.url).pathname;

const words = {
  // The live site's address, whichever site the card is taken from.
  address: 'solucky.me',
  games: [en.games.daily.name, en.games.hourly.name, en.games.guess.name].join(' · '),
  draw: en.dial.draw,
  beta: en.header.beta,
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  colorScheme: 'dark',
  locale: 'en-US',
  // The entrances would still be running when the card is taken.
  reducedMotion: 'reduce',
});
await page.addInitScript(() => {
  try {
    localStorage.setItem('nuxt-color-mode', 'dark');
  } catch {
    // about:blank has no storage.
  }
});
await page.goto(site);
// Today's pot (and the tickets with it) loads after the page.
await page.waitForSelector('[data-hero-dial] [data-dial-pot]', { timeout: 60_000 });
await page.evaluate(layOut, words);
await page.waitForTimeout(1_000);
const shot = await page.screenshot();
await browser.close();

// A 256-colour palette keeps the file small; the card has few colours.
await sharp(shot).png({ palette: true, colours: 256, dither: 1, effort: 10 }).toFile(file);
console.log('app/public/og.png');

/** Runs in the page: lays the hero out as the card. */
function layOut(words: { address: string; games: string; draw: string; beta: string }) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const text = hero?.querySelector<HTMLElement>('[data-hero-text]');
  const dial = hero?.querySelector<HTMLElement>('[data-hero-dial]');
  const logo = document.querySelector('header a[href="/"]')?.cloneNode(true) as HTMLElement | undefined;
  const mark = (name: string) => dial?.querySelector<HTMLElement>(`[data-dial-${name}]`);
  const [label, pot, usd, countdown, day] = ['label', 'pot', 'usd', 'countdown', 'day'].map(mark);
  if (!hero || !text || !dial || !logo || !label || !pot || !usd || !countdown || !day) {
    throw new Error('The hero changed: update scripts/og.ts to its markup.');
  }

  // The logo, without the Beta badge: the card outlives it.
  for (const el of logo.querySelectorAll('*')) if (el.textContent?.trim() === words.beta) el.remove();
  logo.classList.add('og-logo');
  text.prepend(logo);

  const games = document.createElement('p');
  games.className = 'og-games font-mono text-muted';
  games.textContent = words.games;
  const address = document.createElement('p');
  address.className = 'og-address font-mono text-secondary';
  address.textContent = words.address;
  text.append(games, address);

  // The dial's core: the draw's time instead of today's pot and countdown.
  label.textContent = words.draw;
  pot.textContent = '00:00';
  day.textContent = 'UTC';
  usd.remove();
  countdown.remove();

  const style = document.createElement('style');
  style.textContent = `
    header, footer, [id^='nuxt-devtools'], nuxt-devtools-frame { display: none !important; }
    html, body { overflow: hidden !important; }
    [data-hero] { height: 630px; }
    [data-hero] ~ * { display: none !important; }
    [data-hero] > div { position: relative; display: block; max-width: none; height: 630px; padding: 0; }
    [data-hero-text] {
      position: absolute; inset-block: 0; left: 72px; width: 600px;
      display: flex; flex-direction: column; align-items: flex-start; justify-content: center;
    }
    [data-hero-more] { display: none !important; }
    .og-logo { position: absolute; top: 56px; left: 0; }
    .og-games { margin-top: 2.25rem; font-size: 17px; letter-spacing: 0.01em; }
    .og-address { position: absolute; bottom: 48px; left: 0; font-size: 19px; }
    [data-hero-dial] { position: absolute !important; left: 700px; top: 65px; width: 500px; margin: 0 !important; }
  `;
  document.head.append(style);
  scrollTo(0, 0);
  dispatchEvent(new Event('resize'));
}
