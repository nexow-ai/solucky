import { lamportsToSol } from '@solucky/client';

// Building an Intl.NumberFormat is slow and the panels format numbers on every
// clock tick, so each formatter is created once.
const integers = new Intl.NumberFormat('en-US');
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const sol = new Map<number, Intl.NumberFormat>();

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
export function formatUsd(lamports: bigint | number, solUsd: number | null): string {
  if (solUsd === null) return '—';
  return usd.format(lamportsToSol(lamports) * solUsd);
}

/** `4HKHnE…18dbiA`-style short address. */
export function shortAddress(address: string, size = 4): string {
  return address.length <= size * 2 + 1 ? address : `${address.slice(0, size)}…${address.slice(-size)}`;
}

/** `HH:MM:SS` in UTC for a Unix timestamp in seconds. */
export function formatUtcTime(unixSeconds: bigint | number): string {
  return new Date(Number(unixSeconds) * 1000).toISOString().slice(11, 19);
}

/** Percentage with one decimal, `—` when undefined. */
export function formatPercent(ratio: number | null): string {
  if (ratio === null || !Number.isFinite(ratio)) return '—';
  return `${(ratio * 100).toFixed(ratio > 0 && ratio < 0.001 ? 3 : 1)}%`;
}
