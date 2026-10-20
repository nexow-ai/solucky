/** Rounds follow UTC days: round `d` runs from `d * 86 400` to `(d + 1) * 86 400` seconds. */
export const DAY_MS = 86_400_000;

/** UTC day number of a date (days since the Unix epoch). */
export function dayOf(date: Date | number = Date.now()): number {
  return Math.floor(Number(date) / DAY_MS);
}

/** When round `day` opens. */
export function dayStart(day: number): Date {
  return new Date(day * DAY_MS);
}

/** When round `day` stops selling tickets (next midnight UTC). */
export function dayEnd(day: number): Date {
  return new Date((day + 1) * DAY_MS);
}

/** `YYYY-MM-DD` label of round `day`. */
export function formatDay(day: number): string {
  return dayStart(day).toISOString().slice(0, 10);
}

/** Parses a `YYYY-MM-DD` label back to its day number, or `null`. */
export function parseDay(label: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) return null;
  const ms = Date.parse(`${label}T00:00:00Z`);
  return Number.isNaN(ms) ? null : dayOf(ms);
}

/** Milliseconds left before round `day` closes, never negative. */
export function msUntilClose(day: number, now: Date | number = Date.now()): number {
  return Math.max(0, dayEnd(day).getTime() - Number(now));
}

/** `HHh MMm SSs`, as shown on the countdown. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, '0');
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}
