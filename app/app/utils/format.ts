import { formatPeriod, GAME_SLUGS, GameKind, lamportsToSol } from '@solucky/client';

// Building an Intl.NumberFormat is slow and the panels format numbers on every
// clock tick, so each formatter is created once.
const integers = new Intl.NumberFormat('en-US');
const sol = new Map<number, Intl.NumberFormat>();
const cache = new Map<string, Intl.NumberFormat>();

/** A cached `Intl.NumberFormat`. */
function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale} ${JSON.stringify(options)}`;
  let format = cache.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale, options);
    cache.set(key, format);
  }
  return format;
}

// Numbers, lottery numbers and SOL amounts look the same in every language:
// digits grouped by spaces, a point before decimals. Dollars, percentages and
// units follow the page's language (`locale` is an Intl tag, see i18n/languages.ts).

/**
 * Digits are grouped by a no-break space: a number never wraps across lines,
 * and Arabic and Hebrew text keep it whole (a plain space would let the
 * groups swap places in right-to-left text).
 */
const GROUP = '\u00a0';

/** `1234567` → `1 234 567`, the way S☉Lucky has always shown numbers. */
export function formatNumber(value: number | bigint): string {
  return integers.format(value).replaceAll(',', GROUP);
}

/** Lamports → `12.5`, trimmed to at most `digits` decimals. */
export function formatSol(lamports: bigint | number, digits = 4): string {
  let format = sol.get(digits);
  if (!format) {
    format = new Intl.NumberFormat('en-US', { maximumFractionDigits: digits });
    sol.set(digits, format);
  }
  return format.format(lamportsToSol(lamports)).replaceAll(',', GROUP);
}

/** A SOL amount in US dollars, or an em dash while the price is unknown. */
export function formatUsd(lamports: bigint | number, solUsd: number | null, locale = 'en-US'): string {
  if (solUsd === null) return '—';
  return numberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    lamportsToSol(lamports) * solUsd,
  );
}

/** `4HKHnE…18dbiA`-style short address. */
export function shortAddress(address: string, size = 4): string {
  return address.length <= size * 2 + 1 ? address : `${address.slice(0, size)}…${address.slice(-size)}`;
}

/** `HH:MM:SS` in UTC for a Unix timestamp in seconds. */
export function formatUtcTime(unixSeconds: bigint | number): string {
  return new Date(Number(unixSeconds) * 1000).toISOString().slice(11, 19);
}

/**
 * A share as a percentage, in parts: `head` at the usual precision (one
 * decimal, three below 0.1%), `tail` the further decimals a tiny share needs
 * to show its first two digits, so it never reads as 0% (the page prints them
 * smaller, `LotteryPercent`), and `rest` what follows the number (the percent
 * sign, in most languages). 0.000000048 is `0.000` + `0048` + `%`.
 */
export function percentParts(ratio: number | null, locale = 'en-US'): { head: string; tail: string; rest: string } {
  if (ratio === null || !Number.isFinite(ratio)) return { head: '—', tail: '', rest: '' };
  const tiny = ratio > 0 && ratio < 0.001;
  const base = tiny ? 3 : 1;
  // Decimals of the percentage up to its second significant digit.
  const digits = tiny ? Math.min(20, Math.max(base, Math.ceil(-Math.log10(ratio * 100)) + 1)) : base;
  const parts = numberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).formatToParts(ratio);
  let head = '';
  let tail = '';
  let rest = '';
  let past = false;
  for (const part of parts) {
    if (part.type === 'fraction') {
      head += part.value.slice(0, base);
      tail += part.value.slice(base);
      past = true;
    } else if (past) rest += part.value;
    else head += part.value;
  }
  return { head, tail, rest };
}

/** Percentage with one decimal (three below 0.1%, and more for a tiny one, to its first two digits), `—` when undefined. */
export function formatPercent(ratio: number | null, locale = 'en-US'): string {
  const { head, tail, rest } = percentParts(ratio, locale);
  return head + tail + rest;
}

/** `12 s`, `3 min`, `2 hours`, in the language's own words. */
export function formatUnit(
  value: number,
  unit: 'second' | 'minute' | 'hour',
  locale = 'en-US',
  display: 'long' | 'short' | 'narrow' = 'short',
): string {
  return numberFormat(locale, { style: 'unit', unit, unitDisplay: display }).format(value);
}

/** `2026-10-21` → `21 October 2026`, in the language's own words. */
export function formatDate(isoDay: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${isoDay}T00:00:00Z`),
  );
}

/** A round's name on screen: `2026-10-21`, `2026-10-21 14:00 UTC` or `#3`. */
export function roundTitle(kind: number, period: number): string {
  const label = formatPeriod(kind, period);
  if (kind === GameKind.Daily) return label;
  return kind === GameKind.Hourly ? `${label.replace('T', ' ')}:00 UTC` : `#${label}`;
}

/** Path of a round's page: `/rounds/daily/2026-10-21`, `/rounds/guess/3`. */
export function roundPath(kind: number, period: number): string {
  return `/rounds/${GAME_SLUGS[kind as GameKind]}/${formatPeriod(kind, period)}`;
}
