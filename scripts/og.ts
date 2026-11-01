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
 * card is shared. It follows the hero's markup in app/app/pages/index.vue and
 * components/landing/DialLive.vue; change it with them.
 *
 * Uses Playwright's Chromium (`bunx playwright install chromium`), or the
 * browser at CHROME_PATH. Without WebGL 2 the card gets the flat 2D dial.
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
  pot: en.dial.pot,
  beta: en.header.beta,
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, colorScheme: 'dark', locale: 'en-US' });
await page.addInitScript(() => {
  try {
    localStorage.setItem('nuxt-color-mode', 'dark');
  } catch {
    // about:blank has no storage.
  }
});
await page.goto(site);
// Today's pot (and the tickets with it) loads after the page.
await page.waitForFunction(
  (label) => {
    const readout = [...document.querySelectorAll('.dial-rise p')].find((p) => p.textContent?.trim() === label);
    return (readout?.parentElement?.querySelectorAll('.led').length ?? 0) >= 2;
  },
  words.pot,
  { timeout: 60_000 },
);
// The 3D dial starts once the page is idle; without WebGL 2 it never does.
await page.waitForSelector('.landing[data-orrery]', { timeout: 15_000 }).catch(() => {});
// The headline's entrance and the 3D dial's fade-in.
await page.waitForTimeout(3_000);
const orrery = await page.evaluate(layOut, words);
// The 3D dial eases to the dial's new place.
await page.waitForTimeout(3_000);
const shot = await page.screenshot();
await browser.close();

// A 256-colour palette keeps the file small; the card has few colours.
await sharp(shot).png({ palette: true, colours: 256, dither: 1, effort: 10 }).toFile(file);
console.log(`app/public/og.png${orrery ? '' : ' (with the 2D dial: no WebGL 2 in this browser)'}`);

/** Runs in the page: lays the hero out as the card. Returns whether the 3D dial is showing. */
function layOut(words: { address: string; games: string; draw: string; pot: string; beta: string }) {
  const hero = document.querySelector<HTMLElement>('section[data-beat="hero"]');
  const container = hero?.querySelector<HTMLElement>(':scope > div:not([aria-hidden])');
  const text = container?.firstElementChild as HTMLElement | null;
  const dial = hero?.querySelector<HTMLElement>('.dial-rise');
  const label = [...(dial?.querySelectorAll('p') ?? [])].find((p) => p.textContent?.trim() === words.pot);
  const readout = label?.parentElement;
  const logo = document.querySelector('header a[href="/"]')?.cloneNode(true) as HTMLElement | undefined;
  if (!hero || !container || !text || !dial || !readout || !logo) {
    throw new Error('The hero changed: update scripts/og.ts to its markup.');
  }
  const [pot, countdown] = readout.querySelectorAll<HTMLElement>('.led');
  if (!pot || !countdown) throw new Error("Today's pot has not loaded yet: try again.");

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

  // The dial's middle: the draw's time instead of today's pot and countdown.
  label.textContent = words.draw;
  pot.textContent = '00:00';
  countdown.remove();
  readout.querySelector('.text-muted')?.remove();
  const day = readout.lastElementChild;
  if (day) day.textContent = 'UTC';
  // The scale's ends: 0 and the cluster's highest number, which differs between clusters.
  [...dial.querySelectorAll('svg g')].find((g) => g.querySelector('text')?.textContent?.trim() === '0')?.remove();

  const style = document.createElement('style');
  style.textContent = `
    header, .section-index, [id^='nuxt-devtools'], nuxt-devtools-frame { display: none !important; }
    html, body { overflow: hidden !important; }
    section[data-beat='hero'] { height: 630px; }
    section[data-beat='hero'] ~ * { display: none !important; }
    section[data-beat='hero'] > div[aria-hidden] > div:last-child { display: none; }
    section[data-beat='hero'] > div:not([aria-hidden]) {
      position: relative; display: block; max-width: none; height: 630px; padding: 0;
    }
    section[data-beat='hero'] > div:not([aria-hidden]) > div:first-child {
      position: absolute; inset-block: 0; left: 72px; width: 620px;
      display: flex; flex-direction: column; align-items: flex-start; justify-content: center;
    }
    section[data-beat='hero'] > div:not([aria-hidden]) > div:first-child > :is(p.text-lg, div.mt-8, div.mt-10) {
      display: none;
    }
    .og-logo { position: absolute; top: 56px; left: 0; }
    .og-games { margin-top: 2.25rem; font-size: 17px; letter-spacing: 0.01em; }
    .og-address { position: absolute; bottom: 48px; left: 0; font-size: 19px; }
    .dial-rise { position: absolute !important; left: 664px; top: 45px; width: 540px; max-width: none !important; margin: 0 !important; }
    .dial-rise > :not(:first-child) { display: none !important; }
    .animate-blink { animation: none !important; opacity: 1 !important; }
  `;
  document.head.append(style);
  scrollTo(0, 0);
  dispatchEvent(new Event('resize'));
  return document.querySelector('.landing')?.hasAttribute('data-orrery') ?? false;
}
