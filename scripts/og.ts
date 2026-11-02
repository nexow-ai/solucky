/**
 * The images that shared links show (1200×630), one per game: each game's
 * own page's hero, laid out as a card and taken from a running site. The
 * daily lottery's is the site's own card, app/public/og.png; the others are
 * og-hourly.png and og-guess.png (`shareImagePath`). Retake them when a hero
 * changes.
 *
 *   bun run og                       the app on http://127.0.0.1:3000
 *   bun run og https://solucky.me    the live site
 *
 * A card keeps what lasts: the headline, the games, and the dial with its
 * draw time (or, for Guess the number, its open hunt), not the pot or the
 * countdown, which would be stale wherever the card is shared. It finds the
 * hero by its `data-hero*` marks in app/app/pages/[[game]].vue and the dial's
 * core by its `data-dial-*` marks in components/landing/HeroDialLive.vue;
 * keep them when changing those.
 *
 * Uses Playwright's Chromium (`bunx playwright install chromium`), or the
 * browser at CHROME_PATH.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';

import { GAME_SLUGS, type GameSlug } from '@solucky/client';

import { homePath, shareImagePath } from '../app/app/utils/play';
import en from '../app/i18n/locales/en';

const site = (process.argv[2] ?? 'http://127.0.0.1:3000').replace(/\/$/, '');

/** What a card's dial core says instead of the live pot and clock: the draw's time, or Guess's open hunt. */
const CORES: Record<GameSlug, { label: string; big: string; small: string | null }> = {
  daily: { label: en.dial.draw, big: '00:00', small: 'UTC' },
  hourly: { label: en.dial.draw, big: ':00', small: 'UTC' },
  guess: { label: en.guess.noDeadline, big: '?', small: null },
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
for (const slug of GAME_SLUGS) {
  const words = {
    // The live site's address, whichever site the card is taken from.
    address: 'solucky.me',
    games: [en.games.daily.name, en.games.hourly.name, en.games.guess.name].join(' · '),
    beta: en.header.beta,
    ...CORES[slug],
  };
  const file = new URL(`../app/public${shareImagePath(slug)}`, import.meta.url).pathname;
  await card(`${site}${homePath(slug)}`, words, file);
  console.log(`app/public${shareImagePath(slug)}`);
}
await browser.close();

type Words = { address: string; games: string; beta: string; label: string; big: string; small: string | null };

/** Takes one game's card from its page. */
async function card(url: string, words: Words, file: string) {
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
  await page.goto(url);
  // The pot (and the tickets with it) loads after the page.
  await page.waitForSelector('[data-hero-dial] [data-dial-pot]', { timeout: 60_000 });
  await page.evaluate(layOut, words);
  await page.waitForTimeout(1_000);
  const shot = await page.screenshot();
  await page.close();

  // A 256-colour palette keeps the file small; the card has few colours.
  await sharp(shot).png({ palette: true, colours: 256, dither: 1, effort: 10 }).toFile(file);
}

/** Runs in the page: lays the hero out as the card. */
function layOut(words: Words) {
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

  // The dial's core: what lasts (the draw's time, or Guess's open hunt) instead of the pot and the clock.
  label.textContent = words.label;
  pot.textContent = words.big;
  if (words.small) day.textContent = words.small;
  else day.remove();
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
