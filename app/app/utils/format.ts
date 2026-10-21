import { lamportsToSol } from '@solucky/client';

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

/** `1234567` → `1 234 567`, the way S☉Lucky has always shown numbers. */
export function formatNumber(value: number | bigint): string {
  return integers.format(value).replaceAll(',', ' ');
}

/** Lamports → `12.5`, trimmed to at most `digits` decimals. */
export function formatSol(lamports: bigint | number, digits = 4): string {
  let format = sol.get(digits);
  if (!format) {
    format = new Intl.NumberFormat('en-US', { maximumFractionDigits: digits });
    sol.set(digits, format);
  }
  return format.format(lamportsToSol(lamports)).replaceAll(',', ' ');
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

/** Percentage with one decimal (three below 0.1%), `—` when undefined. */
export function formatPercent(ratio: number | null, locale = 'en-US'): string {
  if (ratio === null || !Number.isFinite(ratio)) return '—';
  const digits = ratio > 0 && ratio < 0.001 ? 3 : 1;
  return numberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ratio);
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
