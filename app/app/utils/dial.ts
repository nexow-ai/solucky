/** Radii of the landing's solar dial, in its SVG units (viewBox `-300 -300 600 600`). */
export const DIAL = {
  /** Outer edge, and the band the bezel text runs in. */
  bezel: 296,
  bezelText: 281,
  /** The hour ring: ticks point inwards from it, the sun rides on it. */
  ring: 264,
  labels: 240,
  /** Tickets sit between `inner` (number 0) and `outer` (the highest number). */
  outer: 218,
  inner: 126,
  /** The disc in the middle holding the pot. */
  core: 112,
} as const;

const DAY_MS = 86_400_000;

/** Share of its UTC day a moment has reached, from 0 (00:00) to 1 (24:00). */
export function dayProgress(ms: number): number {
  return (((ms % DAY_MS) + DAY_MS) % DAY_MS) / DAY_MS;
}

/** Angle of a moment on the dial, in radians clockwise from 3 o'clock, with 00:00 UTC at the top. */
export function dialAngle(ms: number): number {
  return -Math.PI / 2 + dayProgress(ms) * 2 * Math.PI;
}

export function dialPoint(angle: number, radius: number): { x: number; y: number } {
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}
