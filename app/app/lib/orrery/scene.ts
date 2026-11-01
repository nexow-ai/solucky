/**
 * The S☉Lucky orrery: the landing's 3D scene, drawn on one fixed, transparent
 * canvas behind the page.
 *
 * The idea, in one sentence: scrolling the landing goes through one UTC day;
 * the camera follows the S☉Lucky sun, with every real ticket of today's round
 * in orbit around it, from now to its midnight eclipse, when the draw happens.
 * Every light in it is real data: today's tickets are beads, past winners are
 * stars. Nothing decorative is added, and there is no post-processing: the
 * one effect is the corona.
 *
 * Budget, enforced by design: the lazy chunk stays under 180 KB gzipped,
 * three included; no textures or models (everything is procedural); at most
 * 12 draw calls; a device pixel ratio of at most 1.5 (1 on touch screens);
 * 60 fps through a full scroll at 4× CPU throttling.
 *
 * The scene works in the solar dial's own units (`DIAL`, a 600-unit square):
 * the 3D ring lines up with the page's SVG dial while that shows. `Orrery.vue`
 * owns the render loop and the page; this module only draws a pose.
 */
import {
  AdditiveBlending,
  type Blending,
  BufferGeometry,
  CircleGeometry,
  type Color,
  DataTexture,
  Float32BufferAttribute,
  FloatType,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  NormalBlending,
  PerspectiveCamera,
  Points,
  RedFormat,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';

import { DIAL } from '../../utils/dial';
import type { Pose } from './beats';

/** An sRGB colour, each channel from 0 to 1. */
export type Rgb = [number, number, number];

export interface OrreryPalette {
  /** The light theme draws deeper colours with normal blending; the dark one glows. */
  dark: boolean;
  /** Colours over a dark background… */
  bright: { primary: Rgb; glow: Rgb; secondary: Rgb };
  /** …and over a light one (only used by the light theme). */
  deep: { primary: Rgb; glow: Rgb; secondary: Rgb };
  /** The moon's disc: the night background. */
  moon: Rgb;
}

/** A ticket on the dial: its angle (radians clockwise from 3 o'clock, 00:00 UTC at -π/2) and radius in dial units. */
export interface OrreryTicket {
  angle: number;
  radius: number;
  mine: boolean;
}

/** A past winner: a seed placing its star, and its payout in SOL (bigger pots shine bigger). */
export interface OrreryStar {
  seed: number;
  sol: number;
}

export interface OrreryInput {
  /** Pointer position in CSS pixels, or null when there is none. */
  pointer: { x: number; y: number } | null;
  /** The hero dial's own pointer tilt (`useTilt`), -1 to 1, so the 3D leans like the SVG face. */
  dialTilt: { x: number; y: number };
}

const FOV = 35;
const DISTANCE = 1000;
const CORONA_OUTER = 900;
const FLARE_MS = 3_000;
const MAX_FLARES = 4;
const RAYS = 320;
const REACH = 228;
const TAU = Math.PI * 2;

const GLOW_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uScale;
  uniform float uSize;
  uniform float uTime;
  uniform float uTwinkle;
  varying vec3 vColor;
  varying float vFlicker;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(1.0, aSize * uSize * uScale / -mv.z);
    vColor = aColor;
    vFlicker = 1.0 - uTwinkle * 0.45 * (0.5 + 0.5 * sin(uTime * (1.1 + aSeed) + aSeed * 40.0));
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  uniform float uWhite;
  varying vec3 vColor;
  varying float vFlicker;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = 1.0 - smoothstep(0.16, 0.3, d);
    float glow = exp(-d * d * 7.0) * 0.55;
    float a = (core + glow) * uOpacity * vFlicker;
    if (a < 0.004) discard;
    gl_FragColor = vec4(mix(vColor, vec3(1.0), core * uWhite), min(1.0, a));
  }
`;

const PLANE_VERTEX = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// The corona: 320 combed rays from the dial's rim, their lengths drifting with slow waves, leaning
// towards the pointer and flaring where a ticket lands (a port of `components/landing/Corona.vue`).
// The lengths are worked out once per frame on the CPU (`rayLengths`) and read from a 320×1 data
// texture, so each pixel only finds its ray.
const CORONA_FRAGMENT = /* glsl */ `
  uniform sampler2D uRays;
  uniform float uOpacity;
  uniform float uEclipse;
  uniform float uReach;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  varying vec2 vPos;
  const float RAYS = ${RAYS.toFixed(1)};
  const float R0 = ${DIAL.bezel.toFixed(1)};
  const float REACH = ${REACH.toFixed(1)};
  const float TAU = 6.28318530718;
  void main() {
    float r = length(vPos);
    float glowReach = 34.0 + uEclipse * 50.0;
    if (r > uReach && r > R0 + glowReach * 4.0) discard;
    float u = atan(vPos.y, vPos.x) / TAU * RAYS;
    float k = mod(floor(u), RAYS);
    // One pixel wide at any zoom, without the seam fwidth(atan) has on the left.
    float px = (fwidth(vPos.x) + fwidth(vPos.y)) / max(r, 1.0) / TAU * RAYS;
    float line = 1.0 - smoothstep(px * 0.5, px * 1.5, abs(fract(u) - 0.5));
    float end = R0 + REACH * texture2D(uRays, vec2((k + 0.5) / RAYS, 0.5)).r;
    float ray = step(R0, r) * (1.0 - smoothstep(end - 8.0, end, r));
    float fade = 1.0 - smoothstep(R0, R0 + REACH * (1.4 + uEclipse * 0.8), r);
    bool accent = mod(k, 9.0) < 0.5;
    float alpha = line * ray * fade * (accent ? 0.75 : 0.5);
    float rim = step(R0 - 2.0, r) * exp(-(r - R0) / glowReach) * (0.16 + uEclipse * 0.4);
    float a = (alpha + rim) * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(accent ? uSecondary : uPrimary, min(1.0, a));
  }
`;

/** A fixed jitter per ray, so the corona looks combed rather than uniform. */
const JITTER = Array.from({ length: RAYS }, (_, i) => 0.55 + 0.45 * Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1));

/** The shortest way round between two angles. */
function apart(a: number, b: number) {
  const d = Math.abs(a - b) % TAU;
  return Math.min(d, TAU - d);
}

/**
 * Each ray's length, in reaches past the rim, into `out`: slow waves, the pointer's lean and the
 * flares (angle in the plane, age from 0 to 1). Returns the longest.
 */
function rayLengths(
  out: Float32Array,
  time: number,
  lean: number,
  pointer: number,
  flares: readonly { angle: number; age: number }[],
  eclipse: number,
) {
  let longest = 0;
  for (let k = 0; k < RAYS; k++) {
    const centre = ((k + 0.5) / RAYS) * TAU;
    let length =
      0.5 +
      0.22 * Math.sin(3 * centre + time * 0.35) +
      0.16 * Math.sin(7 * centre - time * 0.6 + 1.3) +
      0.1 * Math.sin(17 * centre + time * 1.1 + 0.7);
    length *= JITTER[k]!;
    if (lean > 0.01) length += 0.45 * lean * Math.exp(-((apart(centre, pointer) / 0.3) ** 2));
    for (const flare of flares)
      length += 0.9 * Math.sin(Math.PI * flare.age) * Math.exp(-((apart(centre, flare.angle) / 0.12) ** 2));
    length = Math.max(0.08, length * (1 + eclipse * 0.7));
    out[k] = length;
    if (length > longest) longest = length;
  }
  return longest;
}

// The sun's body, seen once the page's dial face is gone: brightest in the middle, soft at the rim.
const BODY_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vPos;
  void main() {
    float r = length(vPos) / ${DIAL.bezel.toFixed(1)};
    float a = (0.08 + 0.5 * pow(1.0 - r, 2.0)) * (1.0 - smoothstep(0.97, 1.0, r));
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`;

const paint = (color: Color, rgb: Rgb) => color.setRGB(rgb[0], rgb[1], rgb[2], SRGBColorSpace);
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
/** A dial angle (clockwise, y down) as an angle in the scene's plane (counter-clockwise, y up). */
const planeAngle = (dialAngle: number) => -dialAngle;

function glowMaterial(twinkle = 0) {
  return new ShaderMaterial({
    vertexShader: GLOW_VERTEX,
    fragmentShader: GLOW_FRAGMENT,
    uniforms: {
      uScale: { value: 1 },
      uSize: { value: 1 },
      uTime: { value: 0 },
      uTwinkle: { value: twinkle },
      uOpacity: { value: 1 },
      uWhite: { value: 0.55 },
    },
    transparent: true,
    depthWrite: false,
  });
}

/**
 * Points with a colour, a size (in scene units) and a seed each. `set` replaces them all (and frees
 * the old buffers); `move` shifts one point without new buffers, for the points that move every frame.
 */
function glowPoints(material: ShaderMaterial) {
  const geometry = new BufferGeometry();
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  function set(items: readonly { position: [number, number, number]; color: Rgb; size: number; seed: number }[]) {
    geometry.dispose();
    geometry.setAttribute(
      'position',
      new Float32BufferAttribute(
        items.flatMap((p) => p.position),
        3,
      ),
    );
    geometry.setAttribute(
      'aColor',
      new Float32BufferAttribute(
        items.flatMap((p) => p.color),
        3,
      ),
    );
    geometry.setAttribute(
      'aSize',
      new Float32BufferAttribute(
        items.map((p) => p.size),
        1,
      ),
    );
    geometry.setAttribute(
      'aSeed',
      new Float32BufferAttribute(
        items.map((p) => p.seed),
        1,
      ),
    );
    geometry.setDrawRange(0, items.length);
  }
  function move(index: number, x: number, y: number, z: number) {
    const position = geometry.getAttribute('position') as Float32BufferAttribute | undefined;
    if (!position || index >= position.count) return;
    position.setXYZ(index, x, y, z);
    position.needsUpdate = true;
  }
  function recolor(rgb: Rgb) {
    const color = geometry.getAttribute('aColor') as Float32BufferAttribute | undefined;
    if (!color) return;
    for (let i = 0; i < color.count; i++) color.setXYZ(i, rgb[0], rgb[1], rgb[2]);
    color.needsUpdate = true;
  }
  return { points, set, move, recolor };
}

/** The dial's rings and quarter-hour ticks, as one set of line segments. */
function dialLines() {
  const vertices: number[] = [];
  for (const radius of [DIAL.inner, DIAL.outer, DIAL.ring, DIAL.bezel]) {
    const steps = 192;
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * TAU;
      const b = ((i + 1) / steps) * TAU;
      vertices.push(Math.cos(a) * radius, Math.sin(a) * radius, 0, Math.cos(b) * radius, Math.sin(b) * radius, 0);
    }
  }
  for (let i = 0; i < 96; i++) {
    const a = Math.PI / 2 - (i / 96) * TAU;
    const inner = DIAL.ring - (i % 4 === 0 ? 14 : 6);
    vertices.push(Math.cos(a) * DIAL.ring, Math.sin(a) * DIAL.ring, 0, Math.cos(a) * inner, Math.sin(a) * inner, 0);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  return geometry;
}

/** A deterministic direction for a winner's star, behind the sun, from its seed. */
function starPosition(seed: number): [number, number, number] {
  const random = (n: number) => {
    const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const theta = random(1) * TAU;
  const z = -0.15 - random(2) * 0.85; // the hemisphere behind the sun, away from the camera
  const ring = Math.sqrt(1 - z * z);
  const distance = 3200 + random(3) * 2600;
  return [Math.cos(theta) * ring * distance, Math.sin(theta) * ring * distance, z * distance];
}

export function createOrrery(canvas: HTMLCanvasElement, initial: OrreryPalette) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 10, 20_000);
  camera.position.set(0, 0, DISTANCE);

  // The orrery itself; `sky` holds the winners' stars, which only drift a little with it.
  const world = new Group();
  world.rotation.order = 'XYZ';
  const sky = new Group();
  scene.add(sky, world);

  const body = new Mesh(
    new CircleGeometry(DIAL.bezel, 128),
    new ShaderMaterial({
      vertexShader: PLANE_VERTEX,
      fragmentShader: BODY_FRAGMENT,
      uniforms: { uColor: { value: new Vector3() }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
    }),
  );

  const lines = new LineSegments(dialLines(), new LineBasicMaterial({ transparent: true, depthWrite: false }));

  const arcMaterial = new MeshBasicMaterial({ transparent: true, depthWrite: false });
  const arc = new Mesh(new RingGeometry(DIAL.ring - 2, DIAL.ring + 2, 8), arcMaterial);
  const arcGlowMaterial = new MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0.22 });
  const arcGlow = new Mesh(new RingGeometry(DIAL.ring - 7, DIAL.ring + 7, 8), arcGlowMaterial);
  let arcProgress = -1;

  const rays = new Float32Array(RAYS);
  const rayTexture = new DataTexture(rays, RAYS, 1, RedFormat, FloatType);
  rayTexture.minFilter = NearestFilter;
  rayTexture.magFilter = NearestFilter;
  const corona = new Mesh(
    new RingGeometry(DIAL.bezel - 4, CORONA_OUTER, 256, 1),
    new ShaderMaterial({
      vertexShader: PLANE_VERTEX,
      fragmentShader: CORONA_FRAGMENT,
      uniforms: {
        uRays: { value: rayTexture },
        uOpacity: { value: 1 },
        uEclipse: { value: 0 },
        uReach: { value: CORONA_OUTER },
        uPrimary: { value: new Vector3() },
        uSecondary: { value: new Vector3() },
      },
      transparent: true,
      depthWrite: false,
    }),
  );

  const beadMaterial = glowMaterial(0.35);
  const beads = glowPoints(beadMaterial);
  const sunMaterial = glowMaterial(0);
  const sun = glowPoints(sunMaterial);
  const starMaterial = glowMaterial(1);
  const stars = glowPoints(starMaterial);
  const baileyMaterial = glowMaterial(0);
  const bailey = glowPoints(baileyMaterial);

  const moonMaterial = new MeshBasicMaterial();
  const moon = new Mesh(new CircleGeometry(DIAL.bezel + 2, 128), moonMaterial);
  moon.position.z = 10;

  world.add(body, lines, arcGlow, arc, corona, beads.points, sun.points, moon, bailey.points);
  sky.add(stars.points);

  const transparent = [
    body.material,
    lines.material,
    arcMaterial,
    arcGlowMaterial,
    corona.material,
    beadMaterial,
    sunMaterial,
    starMaterial,
    baileyMaterial,
  ];

  let palette = initial;
  let tickets: readonly OrreryTicket[] = [];
  let starList: readonly OrreryStar[] = [];
  let flares: { angle: number; at: number }[] = [];
  let lean = 0;
  let pointerAngle = 0;
  let tiltX = 0;
  let tiltY = 0;
  let width = 1;
  let height = 1;
  let lastLight = -1;

  function applyPalette() {
    const blending: Blending = palette.dark ? AdditiveBlending : NormalBlending;
    for (const material of transparent) {
      material.blending = blending;
      material.needsUpdate = true;
    }
    for (const material of [beadMaterial, sunMaterial, starMaterial, baileyMaterial]) {
      material.uniforms.uWhite!.value = palette.dark ? 0.55 : 0;
    }
    paint(moonMaterial.color, palette.moon);
    setTickets(tickets);
    setStars(starList);
    sun.set([{ position: [0, DIAL.ring, 2], color: palette.bright.glow, size: 86, seed: 0 }]);
    bailey.set([{ position: [0, DIAL.bezel, 11], color: [1, 1, 1], size: 70, seed: 0 }]);
  }

  function setTickets(next: readonly OrreryTicket[]) {
    tickets = next;
    beads.set(
      next.map((ticket, i) => {
        const a = planeAngle(ticket.angle);
        return {
          position: [Math.cos(a) * ticket.radius, Math.sin(a) * ticket.radius, 1] as [number, number, number],
          color: ticket.mine ? palette.bright.secondary : palette.bright.glow,
          size: ticket.mine ? 34 : 24,
          seed: (i * 0.37) % 4,
        };
      }),
    );
  }

  function setStars(next: readonly OrreryStar[]) {
    starList = next;
    stars.set(
      next.map((star) => ({
        position: starPosition(star.seed),
        color: mix(palette.bright.glow, [1, 1, 1], 0.6),
        size: 40 + Math.min(80, Math.log10(1 + star.sol * 10) * 40),
        seed: star.seed % 1,
      })),
    );
  }

  function flare(dialAngle: number) {
    const now = performance.now();
    flares = [...flares.filter((f) => now - f.at < FLARE_MS), { angle: planeAngle(dialAngle), at: now }].slice(
      -MAX_FLARES,
    );
  }

  // Resolution: the device's, capped, times `quality`, which the loop lowers on slow devices.
  let quality = 1;
  function applySize() {
    const touch = matchMedia('(pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touch ? 1 : 1.5) * quality);
    renderer.setSize(width, height, false);
  }
  function setQuality(next: number) {
    if (next === quality) return;
    quality = next;
    applySize();
  }

  function resize(w: number, h: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    applySize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  /** CSS pixels per scene unit on the plane through the origin. */
  const pixelsPerUnit = () => height / (2 * DISTANCE * Math.tan(((FOV / 2) * Math.PI) / 180));

  /** Draws one frame: the orrery in `pose`, `time` in seconds, the sun at `day` (0 to 1 of the UTC day). */
  function render(pose: Pose, time: number, day: number, input: OrreryInput) {
    const ppu = pixelsPerUnit();
    const scale = pose.radius / (DIAL.bezel * ppu);
    world.position.set((pose.x - width / 2) / ppu, -(pose.y - height / 2) / ppu, 0);
    world.scale.setScalar(scale);

    // Lean like the SVG face while it shows (same angles as the dial's CSS), and with the pointer after.
    const face = pose.face;
    const px = input.pointer ? (input.pointer.x / width) * 2 - 1 : 0;
    const py = input.pointer ? (input.pointer.y / height) * 2 - 1 : 0;
    const wantX = face * input.dialTilt.y * ((7 * Math.PI) / 180) + (1 - face) * py * 0.08;
    const wantY = face * input.dialTilt.x * ((7 * Math.PI) / 180) + (1 - face) * px * 0.12;
    tiltX += (wantX - tiltX) * 0.12;
    tiltY += (wantY - tiltY) * 0.12;
    world.rotation.set(-pose.tilt + tiltX, tiltY, -pose.spin);

    sky.position.set(world.position.x * 0.25, world.position.y * 0.25, 0);
    sky.rotation.z = -pose.spin * 0.15 + time * 0.004;

    // Colours: bright over dark sections, deeper over light ones (light theme only).
    const light = palette.dark ? 0 : pose.light;
    const primary = mix(palette.bright.primary, palette.deep.primary, light);
    const glow = mix(palette.bright.glow, palette.deep.glow, light);
    const secondary = mix(palette.bright.secondary, palette.deep.secondary, light);

    const bodyUniforms = (body.material as ShaderMaterial).uniforms;
    bodyUniforms.uColor!.value.set(...glow);
    bodyUniforms.uOpacity!.value = (1 - face * 0.85) * (1 - pose.eclipse);

    const lineMaterial = lines.material as LineBasicMaterial;
    paint(lineMaterial.color, primary);
    lineMaterial.opacity = (1 - face) * 0.4;

    // The day so far, from 00:00 UTC (the top) to now, clockwise.
    if (Math.abs(day - arcProgress) > 0.0004) {
      arcProgress = day;
      const length = Math.max(0.0001, day * TAU);
      arc.geometry.dispose();
      arcGlow.geometry.dispose();
      const segments = Math.max(8, Math.ceil(day * 160));
      arc.geometry = new RingGeometry(DIAL.ring - 2, DIAL.ring + 2, segments, 1, Math.PI / 2 - length, length);
      arcGlow.geometry = new RingGeometry(DIAL.ring - 7, DIAL.ring + 7, segments, 1, Math.PI / 2 - length, length);
    }
    paint(arcMaterial.color, primary);
    paint(arcGlowMaterial.color, glow);
    const sunAngle = Math.PI / 2 - day * TAU;
    sun.move(0, Math.cos(sunAngle) * DIAL.ring, Math.sin(sunAngle) * DIAL.ring, 2);
    if (light !== lastLight) {
      lastLight = light;
      sun.recolor(glow);
    }

    // The corona leans towards the pointer while it is near the sun.
    let near = false;
    if (input.pointer) {
      const dx = input.pointer.x - pose.x;
      const dy = input.pointer.y - pose.y;
      near = Math.hypot(dx, dy) < pose.radius * 1.7;
      if (near) pointerAngle = Math.atan2(-dy, dx) + pose.spin;
    }
    lean += ((near ? 1 : 0) - lean) * 0.06;
    const now = performance.now();
    flares = flares.filter((f) => now - f.at < FLARE_MS);
    const longest = rayLengths(
      rays,
      time,
      lean,
      pointerAngle,
      flares.map((f) => ({ angle: f.angle, age: (now - f.at) / FLARE_MS })),
      pose.eclipse,
    );
    rayTexture.needsUpdate = true;
    const coronaUniforms = (corona.material as ShaderMaterial).uniforms;
    coronaUniforms.uReach!.value = DIAL.bezel + REACH * longest + 8;
    coronaUniforms.uEclipse!.value = pose.eclipse;
    coronaUniforms.uPrimary!.value.set(...primary);
    coronaUniforms.uSecondary!.value.set(...secondary);

    // Points are sized in scene units; their screen size follows the camera and the orrery's scale.
    const pointScale = (height * renderer.getPixelRatio()) / (2 * Math.tan(((FOV / 2) * Math.PI) / 180));
    for (const material of [beadMaterial, sunMaterial, baileyMaterial]) {
      material.uniforms.uScale!.value = pointScale;
      material.uniforms.uSize!.value = scale;
      material.uniforms.uTime!.value = time;
    }
    starMaterial.uniforms.uScale!.value = pointScale;
    starMaterial.uniforms.uTime!.value = time;
    starMaterial.uniforms.uOpacity!.value = pose.stars;
    stars.points.visible = pose.stars > 0.01 && starList.length > 0;
    beadMaterial.uniforms.uOpacity!.value = 1 - pose.eclipse * 0.6;

    // Midnight: the moon slides across, and one bead of sunlight runs round its rim.
    moon.visible = pose.eclipse > 0.002;
    moon.position.x = -(1 - pose.eclipse) * DIAL.bezel * 2.6;
    const beadAngle = time * 0.4;
    bailey.points.visible = pose.eclipse > 0.9;
    bailey.move(
      0,
      moon.position.x + Math.cos(beadAngle) * DIAL.bezel,
      Math.sin(beadAngle) * DIAL.bezel,
      moon.position.z + 1,
    );
    baileyMaterial.uniforms.uOpacity!.value = smooth(0.9, 1, pose.eclipse);

    renderer.render(scene, camera);
  }

  function setPalette(next: OrreryPalette) {
    palette = next;
    lastLight = -1;
    applyPalette();
  }

  function dispose() {
    scene.traverse((object) => {
      if ('geometry' in object && object.geometry instanceof BufferGeometry) object.geometry.dispose();
    });
    for (const material of [...transparent, moonMaterial]) material.dispose();
    rayTexture.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  applyPalette();
  return { render, resize, setQuality, setTickets, setStars, setPalette, flare, dispose, renderer };
}

export type Orrery = ReturnType<typeof createOrrery>;
