import { describe, expect, it } from 'vitest';

import {
  anchoredPose,
  beatEase,
  clamp,
  dampFactor,
  dampPose,
  lerpPose,
  type Pose,
  poseAt,
  smootherstep,
  viewPoses,
} from '../app/lib/orrery/beats';

const pose = (overrides: Partial<Pose> = {}): Pose => ({
  x: 0,
  y: 0,
  radius: 100,
  tilt: 0,
  spin: 0,
  dim: 1,
  face: 0,
  eclipse: 0,
  stars: 0,
  light: 0,
  ...overrides,
});

describe('easing', () => {
  it('clamps and eases from 0 to 1, still at both ends', () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(2)).toBe(1);
    expect(smootherstep(0)).toBe(0);
    expect(smootherstep(1)).toBe(1);
    expect(smootherstep(0.5)).toBeCloseTo(0.5);
  });

  it('holds still at both ends of a move between beats', () => {
    expect(beatEase(0)).toBe(0);
    expect(beatEase(0.2)).toBe(0);
    expect(beatEase(0.5)).toBeCloseTo(0.5);
    expect(beatEase(0.8)).toBe(1);
    expect(beatEase(1)).toBe(1);
  });

  it('damps the same way at any frame rate', () => {
    const once = dampFactor(6, 1 / 30);
    const twice = 1 - (1 - dampFactor(6, 1 / 60)) ** 2;
    expect(once).toBeCloseTo(twice);
  });
});

describe('poseAt', () => {
  const a = pose({ x: 0, tilt: 0 });
  const b = pose({ x: 100, tilt: 1 });
  const c = pose({ x: 300, tilt: 2 });
  const beats = [
    { at: 0, pose: a },
    { at: 1000, pose: b },
    { at: 2000, pose: c },
  ];

  it('holds the first and last poses beyond the beats', () => {
    expect(poseAt(beats, -50)).toEqual(a);
    expect(poseAt(beats, 5000)).toEqual(c);
  });

  it('holds a beat while its section is read, then moves', () => {
    expect(poseAt(beats, 100).x).toBe(0);
    expect(poseAt(beats, 500).x).toBeCloseTo(50);
    expect(poseAt(beats, 900).x).toBe(100);
    expect(poseAt(beats, 1500).tilt).toBeCloseTo(1.5);
  });

  it('copes with two beats at the same place', () => {
    expect(
      poseAt(
        [
          { at: 0, pose: a },
          { at: 0, pose: b },
        ],
        0,
      ),
    ).toEqual(a);
    expect(
      poseAt(
        [
          { at: 0, pose: a },
          { at: 0, pose: b },
        ],
        1,
      ),
    ).toEqual(b);
  });

  it('needs a beat', () => {
    expect(() => poseAt([], 0)).toThrow();
  });
});

describe('dampPose', () => {
  it('eases every field towards the target', () => {
    const next = dampPose(pose({ x: 0, dim: 0 }), pose({ x: 100, dim: 1 }), 0.5);
    expect(next.x).toBe(50);
    expect(next.dim).toBe(0.5);
  });

  it('pins the position and size under the page face while it shows', () => {
    const next = dampPose(pose({ x: 0, radius: 10 }), pose({ x: 100, radius: 200, face: 1, tilt: 1 }), 0.1);
    expect(next.x).toBe(100);
    expect(next.radius).toBe(200);
    expect(next.tilt).toBeCloseTo(0.1);
  });
});

describe('poses', () => {
  it('centres an anchored pose on its element', () => {
    const anchored = anchoredPose({ left: 100, top: 50, width: 400, height: 400 }, pose());
    expect(anchored).toMatchObject({ x: 300, y: 250, radius: 200 });
  });

  it('mirrors the side poses for right-to-left pages', () => {
    const ltr = viewPoses(1000, 800, false);
    const rtl = viewPoses(1000, 800, true);
    expect(ltr.fairness.x).toBeCloseTo(840);
    expect(rtl.fairness.x).toBeCloseTo(160);
    expect(rtl.games.x).toBe(ltr.games.x);
  });

  it('interpolates halfway', () => {
    expect(lerpPose(pose({ y: 0 }), pose({ y: 10 }), 0.5).y).toBe(5);
  });
});
