import { DAY_MS, GameKind, HOUR_MS } from '@solucky/client';

/**
 * The dial on each game's page (`HeroDial`). A lottery's dial is its round:
 * the UTC day for the daily lottery, the hour for the hourly one, starting at
 * the top. Guess the number's dial is its range of numbers, 0 at the top.
 */

/** Share of its round a moment has reached in a lottery, from 0 (the round opens) to 1 (it closes). */
export function roundShare(kind: number, ms: number): number {
  const length = kind === GameKind.Hourly ? HOUR_MS : DAY_MS;
  return (((ms % length) + length) % length) / length;
}

/** Angle of a share of the dial, in radians clockwise from 3 o'clock, with 0 at the top. */
export function dialAngle(share: number): number {
  return -Math.PI / 2 + share * 2 * Math.PI;
}

/**
 * Point on the dial, rounded to 0.01 units: the server and the browser may
 * disagree on the last digits of `Math.sin`, which would break hydration.
 */
export function dialPoint(angle: number, radius: number): { x: number; y: number } {
  const round = (v: number) => Math.round(v * 100) / 100;
  return { x: round(Math.cos(angle) * radius), y: round(Math.sin(angle) * radius) };
}
