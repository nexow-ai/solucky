/**
 * Draw notifications: which browsers asked for which games, and what each one
 * is told when a round is won. Browsers subscribe through /api/push; the crank
 * reports each draw to /api/push/draw. Web Push itself is in webpush.ts.
 */
import { GAME_SLUGS, GameKind, isLottery } from '@solucky/client';

import { formatNumber, formatSol, roundPath, roundTitle } from '../../app/utils/format';
import { DEFAULT_LOCALE, type Locale, LOCALES, localeInfo } from '../../i18n/languages';
import type { Dict } from '../../i18n/locales/en';
import { type Subscription, toBase64Url } from './webpush';

/** What the server keeps for one browser, under the hash of its endpoint. */
export interface PushRecord {
  subscription: Subscription;
  games: GameKind[];
  locale: Locale;
}

/** A round the crank has just drawn, with a winner. */
export interface Draw {
  kind: GameKind;
  period: number;
  drawnNumber: number;
  winningNumber: number;
  payout: bigint;
}

/**
 * The push services of the browsers that support Web Push. The server only
 * ever posts to these, so a subscription cannot point it anywhere else.
 */
const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /^updates\.push\.services\.mozilla\.com$/,
  /(^|\.)push\.apple\.com$/,
  /\.notify\.windows\.com$/,
];

const GAMES: readonly number[] = Object.values(GameKind);
const isBase64Url = (value: unknown, bytes: number): value is string =>
  typeof value === 'string' && /^[\w-]+$/.test(value) && Buffer.from(value, 'base64url').length === bytes;
const isWhole = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;

/** A subscription from a browser, or null when it is not one we can send to. */
export function parseSubscription(value: unknown): Subscription | null {
  const { endpoint, keys } = (value ?? {}) as Partial<Subscription>;
  if (typeof endpoint !== 'string' || endpoint.length > 1024 || !URL.canParse(endpoint)) return null;
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || !PUSH_HOSTS.some((host) => host.test(url.hostname))) return null;
  if (!isBase64Url(keys?.p256dh, 65) || !isBase64Url(keys?.auth, 16)) return null;
  return { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } };
}

/** The games a browser asks for, each once; null if one of them is not a game. */
export function parseGames(value: unknown): GameKind[] | null {
  if (!Array.isArray(value) || !value.every((kind) => GAMES.includes(kind))) return null;
  return [...new Set(value as GameKind[])].sort();
}

export function parseLocale(value: unknown): Locale {
  return LOCALES.find((l) => l.code === value)?.code ?? DEFAULT_LOCALE;
}

/** A draw as the crank reports it (`payout` in lamports, as a string), or null. */
export function parseDraw(value: unknown): Draw | null {
  const { kind, period, drawnNumber, winningNumber, payout } = (value ?? {}) as Record<string, unknown>;
  if (!GAMES.includes(kind as number) || ![period, drawnNumber, winningNumber].every(isWhole)) return null;
  if (typeof payout !== 'string' || !/^\d{1,20}$/.test(payout)) return null;
  return {
    kind: kind as GameKind,
    period: period as number,
    drawnNumber: drawnNumber as number,
    winningNumber: winningNumber as number,
    payout: BigInt(payout),
  };
}

const sha256 = async (text: string) =>
  toBase64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))));

/** Where a browser's record is kept: its endpoint is a long URL, the hash is a safe key. */
export const recordKey = (endpoint: string) => sha256(endpoint);

/** Whether a request carries the secret. Compared as hashes, so the time it takes tells nothing about it. */
export async function sameSecret(given: string | undefined, secret: string): Promise<boolean> {
  return given !== undefined && (await sha256(given)) === (await sha256(secret));
}

/** Each language's words, loaded the first time a browser that reads it is notified. */
const DICTIONARIES: Record<Locale, () => Promise<{ default: Dict }>> = {
  en: () => import('../../i18n/locales/en'),
  es: () => import('../../i18n/locales/es'),
  fr: () => import('../../i18n/locales/fr'),
  de: () => import('../../i18n/locales/de'),
  it: () => import('../../i18n/locales/it'),
  pt: () => import('../../i18n/locales/pt'),
  nl: () => import('../../i18n/locales/nl'),
  tr: () => import('../../i18n/locales/tr'),
  ru: () => import('../../i18n/locales/ru'),
  uk: () => import('../../i18n/locales/uk'),
  ar: () => import('../../i18n/locales/ar'),
  he: () => import('../../i18n/locales/he'),
  hi: () => import('../../i18n/locales/hi'),
  th: () => import('../../i18n/locales/th'),
  vi: () => import('../../i18n/locales/vi'),
  id: () => import('../../i18n/locales/id'),
  'zh-cn': () => import('../../i18n/locales/zh-cn'),
  'zh-tw': () => import('../../i18n/locales/zh-tw'),
  ja: () => import('../../i18n/locales/ja'),
  ko: () => import('../../i18n/locales/ko'),
};

/**
 * The notification for a draw, in one language: the game, the numbers and
 * the prize as the app shows them, and the round's page to open. Values are
 * set off in their own direction in right-to-left languages, as on the site
 * (plugins/bidi.ts). The tag lets a game's newer result replace an older one.
 */
export async function drawMessage(draw: Draw, locale: Locale) {
  const { games, push } = (await DICTIONARIES[locale]()).default;
  const values: Record<string, string> = {
    round: roundTitle(draw.kind, draw.period),
    drawn: formatNumber(draw.drawnNumber),
    winning: formatNumber(draw.winningNumber),
    prize: formatSol(draw.payout),
  };
  const rtl = localeInfo(locale).dir === 'rtl';
  const template = isLottery(draw.kind) ? push.lottery : push.guess;
  return {
    title: games[GAME_SLUGS[draw.kind]].name,
    body: template.replace(/\{(\w+)\}/g, (_, name: string) => (rtl ? `⁨${values[name]}⁩` : values[name]!)),
    url: `${locale === DEFAULT_LOCALE ? '' : `/${locale}`}${roundPath(draw.kind, draw.period)}`,
    tag: `draw-${draw.kind}`,
  };
}
