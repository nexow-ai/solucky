export interface SolarFlare {
  /** Angle on the solar dial, in radians, clockwise from 3 o'clock (00:00 UTC is -π/2). */
  angle: number;
  /** `performance.now()` when it fired. */
  at: number;
}

const FLARE_MS = 3_000;
const flares = shallowRef<SolarFlare[]>([]);

/**
 * Flares on the landing's corona: the solar dial fires one where each new
 * ticket lands, and the corona draws it for a few seconds.
 */
export function useSolarFlares() {
  function flare(angle: number) {
    const now = performance.now();
    flares.value = [...flares.value.filter((f) => now - f.at < FLARE_MS), { angle, at: now }];
  }
  return { flares: readonly(flares), flare, FLARE_MS };
}
