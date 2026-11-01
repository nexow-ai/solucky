/**
 * The orrery's choreography, as pure functions: where the S☉Lucky sun stands
 * on screen for each section of the landing ("beat"), and how it moves from
 * one to the next as the page scrolls. Each move has a hold at both ends, so
 * the scene stays still while a section is read.
 */

/** How the orrery stands on screen. Every field eases on its own. */
export interface Pose {
  /** Centre, in CSS pixels from the viewport's top left. */
  x: number;
  y: number;
  /** The dial's outer edge (300 dial units) in CSS pixels, before tilting. */
  radius: number;
  /** How far the orbit plane leans back, in radians: 0 faces the viewer. */
  tilt: number;
  /** How far the dial has turned about its axis, in radians. */
  spin: number;
  /** How much of the scene shows, 0 to 1. */
  dim: number;
  /** How much of the page's own SVG dial face shows, 0 to 1; the 3D draws the rest. */
  face: number;
  /** The moon's way across the sun, 0 to 1. */
  eclipse: number;
  /** How much the winners' stars show, 0 to 1. */
  stars: number;
  /** How light the page behind is, 0 (a dark section) to 1 (a light one, in the light theme). */
  light: number;
}

export const POSE_KEYS = ['x', 'y', 'radius', 'tilt', 'spin', 'dim', 'face', 'eclipse', 'stars', 'light'] as const;

/** A section's pose and the scroll position where it is centred in the viewport. */
export interface Beat {
  at: number;
  pose: Pose;
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Ken Perlin's smootherstep: still at both ends, fastest in the middle. */
export function smootherstep(t: number): number {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** The ease from one beat to the next: a hold, the move, and a hold. */
export function beatEase(t: number, hold = 0.2): number {
  return smootherstep((t - hold) / (1 - 2 * hold));
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const out = { ...a };
  for (const key of POSE_KEYS) out[key] = a[key] + (b[key] - a[key]) * t;
  return out;
}

/**
 * The pose at a scroll position: the beats' poses, eased between the two
 * around it. Before the first beat and after the last, it holds theirs.
 * Beats must be sorted by `at`.
 */
export function poseAt(beats: readonly Beat[], scroll: number): Pose {
  if (!beats.length) throw new Error('poseAt needs at least one beat');
  if (scroll <= beats[0]!.at) return beats[0]!.pose;
  for (let i = 1; i < beats.length; i++) {
    const a = beats[i - 1]!;
    const b = beats[i]!;
    if (scroll <= b.at) {
      const span = b.at - a.at;
      return span <= 0 ? b.pose : lerpPose(a.pose, b.pose, beatEase((scroll - a.at) / span));
    }
  }
  return beats.at(-1)!.pose;
}

/** The share of the way to the target to cover this frame: frame-rate independent damping. */
export function dampFactor(rate: number, dt: number): number {
  return 1 - Math.exp(-rate * dt);
}

/**
 * Eases `current` towards `target` by `k`. While the page's SVG face shows,
 * the position and size follow at once instead: the 3D must sit exactly
 * under the face as the page scrolls.
 */
export function dampPose(current: Pose, target: Pose, k: number): Pose {
  const out = lerpPose(current, target, k);
  const pin = clamp((target.face - 0.5) * 2);
  if (pin > 0) {
    out.x += (target.x - out.x) * pin;
    out.y += (target.y - out.y) * pin;
    out.radius += (target.radius - out.radius) * pin;
  }
  return out;
}

/** A pose centred on an element of the page (the hero's dial, the finale's eclipse), as big as it is. */
export function anchoredPose(
  rect: { left: number; top: number; width: number; height: number },
  rest: Omit<Pose, 'x' | 'y' | 'radius'>,
): Pose {
  return { ...rest, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, radius: rect.width / 2 };
}

/**
 * The poses of the sections between the hero and the finale, for a viewport
 * of `width` × `height`; `rtl` mirrors them for right-to-left pages, so the
 * sun stays on the side the text does not start from.
 */
export function viewPoses(width: number, height: number, rtl: boolean) {
  const side = (share: number) => (rtl ? 1 - share : share) * width;
  const short = Math.min(width, height);
  const phone = width < 640;
  return {
    games: {
      x: side(0.5),
      y: height * 0.42,
      radius: short * 0.46,
      tilt: 1.05,
      spin: 0.35,
      dim: 0.85,
      face: 0,
      eclipse: 0,
      stars: 0.3,
      light: 1,
    },
    practice: {
      x: side(0.5),
      y: height * 0.5,
      radius: Math.min(width * (phone ? 0.9 : 0.62), 980),
      tilt: 1.36,
      spin: 0.95,
      dim: 0.8,
      face: 0,
      eclipse: 0,
      stars: 0.3,
      light: 1,
    },
    split: {
      x: side(phone ? 0.5 : 0.2),
      y: height * (phone ? 0.3 : 0.5),
      radius: short * 0.3,
      tilt: 0.3,
      spin: 1.5,
      dim: 1,
      face: 0,
      eclipse: 0,
      stars: 0.4,
      light: 1,
    },
    // Pulled far back, below the wall's words, among the winners' stars.
    winners: {
      x: side(0.5),
      y: height * 0.9,
      radius: short * 0.15,
      tilt: 0.95,
      spin: 2.1,
      dim: 0.75,
      face: 0,
      eclipse: 0,
      stars: 1,
      light: 1,
    },
    fairness: {
      x: side(phone ? 0.5 : 0.84),
      y: height * 0.28,
      radius: short * 0.22,
      tilt: 0.6,
      spin: 2.6,
      dim: 0.35,
      face: 0,
      eclipse: 0,
      stars: 0.5,
      light: 1,
    },
    faq: {
      x: side(phone ? 0.5 : 0.84),
      y: height * 0.72,
      radius: short * 0.2,
      tilt: 0.35,
      spin: 3.4,
      dim: 0.3,
      face: 0,
      eclipse: 0,
      stars: 0.6,
      light: 1,
    },
  } satisfies Record<string, Pose>;
}

export type ViewBeat = keyof ReturnType<typeof viewPoses>;
