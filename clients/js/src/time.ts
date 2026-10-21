/** The three games, numbered as in the program (`DAILY`, `HOURLY`, `GUESS`). */
export const GameKind = { Daily: 0, Hourly: 1, Guess: 2 } as const;
export type GameKind = (typeof GameKind)[keyof typeof GameKind];
/** The games whose rounds follow the clock. */
export type LotteryKind = typeof GameKind.Daily | typeof GameKind.Hourly;

/** URL names of the games, indexed by `GameKind`. */
export const GAME_SLUGS = ['daily', 'hourly', 'guess'] as const;
export type GameSlug = (typeof GAME_SLUGS)[number];

/** The game a URL name points to, or `null`. */
export function gameFromSlug(slug: string): GameKind | null {
  const kind = GAME_SLUGS.indexOf(slug as GameSlug);
  return kind < 0 ? null : (kind as GameKind);
}

export function isLottery(kind: number): kind is LotteryKind {
  return kind !== GameKind.Guess;
}

/** Round `d` of the daily lottery runs from `d * 86 400` to `(d + 1) * 86 400` seconds. */
export const DAY_MS = 86_400_000;
/** Round `h` of the hourly lottery runs from `h * 3 600` to `(h + 1) * 3 600` seconds. */
export const HOUR_MS = 3_600_000;

function periodMs(kind: LotteryKind): number {
  return kind === GameKind.Daily ? DAY_MS : HOUR_MS;
}

/** The lottery round on sale at a date: days or hours since the Unix epoch (UTC). */
export function periodOf(kind: LotteryKind, date: Date | number = Date.now()): number {
  return Math.floor(Number(date) / periodMs(kind));
}

/** When a lottery round opens. */
export function periodStart(kind: LotteryKind, period: number): Date {
  return new Date(period * periodMs(kind));
}

/** When a lottery round stops selling tickets. */
export function periodEnd(kind: LotteryKind, period: number): Date {
  return new Date((period + 1) * periodMs(kind));
}

/** Milliseconds left before a lottery round closes, never negative. */
export function msUntilClose(kind: LotteryKind, period: number, now: Date | number = Date.now()): number {
  return Math.max(0, periodEnd(kind, period).getTime() - Number(now));
}

/** A round's label in URLs: `YYYY-MM-DD` (daily), `YYYY-MM-DDTHH` (hourly, UTC) or the Guess round number. */
export function formatPeriod(kind: number, period: number): string {
  if (!isLottery(kind)) return String(period);
  const iso = periodStart(kind, period).toISOString();
  return kind === GameKind.Daily ? iso.slice(0, 10) : iso.slice(0, 13);
}

/** Parses a label from `formatPeriod` back to its period, or `null`. */
export function parsePeriod(kind: number, label: string): number | null {
  if (!isLottery(kind)) return /^\d{1,10}$/.test(label) ? Number(label) : null;
  const daily = kind === GameKind.Daily;
  if (!(daily ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{4}-\d{2}-\d{2}T\d{2}$/).test(label)) return null;
  const ms = Date.parse(daily ? `${label}T00:00:00Z` : `${label}:00:00Z`);
  return Number.isNaN(ms) ? null : periodOf(kind, ms);
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
