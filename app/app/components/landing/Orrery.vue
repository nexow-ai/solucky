<script setup lang="ts">
import type { Account } from '@solana/kit';
import { GameKind, type Round } from '@solucky/client';

import type { Beat, Pose, ViewBeat } from '~/lib/orrery/beats';
import type { Orrery, OrreryPalette, Rgb } from '~/lib/orrery/scene';

/**
 * The landing's 3D orrery (see `lib/orrery/scene.ts` for the idea): a fixed
 * canvas behind the page, loaded after the page is idle. This component
 * measures the page, runs the render loop and feeds the scene the day's
 * tickets and the winners. It emits `active` when the scene takes over from
 * the 2D dial (and `false` if it stops), and never starts without WebGL 2,
 * with reduced motion or with data saving on: the 2D dial stays then.
 */
const emit = defineEmits<{ active: [boolean] }>();

const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
const colorMode = useColorMode();
const now = useNow();
const { flares } = useSolarFlares();
const { tickets, maxNumber, settled } = useLottery(GameKind.Daily);
const { address } = useWallet();

// The other games' winners only load once the winners wall is near (see OrreryFeed).
const winnersNear = ref(false);
const otherWins = shallowRef<Account<Round>[]>([]);

let orrery: Orrery | null = null;
let stop = () => {};

function supported() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/** Resolves the theme's colours (oklch included) to sRGB through a 1×1 canvas. */
function palette(): OrreryPalette {
  const probe = document.createElement('span');
  const night = document.createElement('div');
  night.className = 'dark';
  night.hidden = true;
  night.append(probe);
  document.body.append(night);
  const paint = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  const read = (variable: string, dark: boolean): Rgb => {
    night.className = dark ? 'dark' : '';
    probe.style.color = `var(${variable})`;
    paint.clearRect(0, 0, 1, 1);
    paint.fillStyle = getComputedStyle(probe).color;
    paint.fillRect(0, 0, 1, 1);
    const [r, g, b] = paint.getImageData(0, 0, 1, 1).data;
    return [r! / 255, g! / 255, b! / 255];
  };
  const result: OrreryPalette = {
    dark: colorMode.value === 'dark',
    bright: {
      primary: read('--ui-color-primary-400', true),
      glow: read('--ui-color-primary-300', true),
      secondary: read('--ui-color-secondary-400', true),
    },
    deep: {
      primary: read('--ui-color-primary-700', false),
      glow: read('--ui-color-primary-600', false),
      secondary: read('--ui-color-secondary-700', false),
    },
    moon: read('--ui-bg', true),
  };
  night.remove();
  return result;
}

const orreryTickets = computed(() =>
  tickets.value.map((ticket) => ({
    angle: dialAngle(Number(ticket.data.createdAt) * 1000),
    radius: DIAL.inner + (DIAL.outer - DIAL.inner) * Math.min(1, ticket.data.number / Math.max(1, maxNumber.value)),
    mine: ticket.data.owner === address.value,
  })),
);

/** A stable number from a round's address, to place its star. */
function seedOf(text: string) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0) / 4294967296;
}
const stars = computed(() =>
  [...settled.value, ...otherWins.value].map((round) => ({
    seed: seedOf(round.address) * 1000,
    sol: Number(round.data.payout) / 1e9,
  })),
);

onMounted(async () => {
  const el = canvas.value;
  const root = el?.closest<HTMLElement>('.landing');
  if (!el || !root || !supported()) return;
  // Let the page (and its headline) settle first: the scene is decoration on top of it.
  await new Promise<void>((resolve) =>
    'requestIdleCallback' in window
      ? requestIdleCallback(() => resolve(), { timeout: 2500 })
      : setTimeout(resolve, 600),
  );
  const [{ createOrrery }, beats] = await Promise.all([import('~/lib/orrery/scene'), import('~/lib/orrery/beats')]);
  if (!canvas.value) return;

  try {
    orrery = createOrrery(el, palette());
  } catch {
    return;
  }
  const scene = orrery;

  // The sections' places on the page, measured again whenever the page changes size.
  let measured: { key: string; at: number }[] = [];
  function measure() {
    const viewport = window.innerHeight;
    const max = Math.max(0, document.documentElement.scrollHeight - viewport);
    measured = [...root!.querySelectorAll<HTMLElement>('[data-beat]')]
      .map((section) => {
        const box = section.getBoundingClientRect();
        const key = section.dataset.beat!;
        const at = key === 'hero' ? 0 : box.top + window.scrollY + box.height / 2 - viewport / 2;
        return { key, at: Math.min(max, Math.max(0, at)) };
      })
      .sort((a, b) => a.at - b.at);
    scene.resize(window.innerWidth, window.innerHeight);
  }
  const resizer = new ResizeObserver(() => measure());
  resizer.observe(root);
  window.addEventListener('resize', measure);
  measure();

  const dial = root.querySelector<HTMLElement>('[data-dial]');
  const eclipse = root.querySelector<HTMLElement>('[data-eclipse]');
  const winners = root.querySelector<HTMLElement>('#winners');

  function target(): Pose {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const views = beats.viewPoses(width, height, document.documentElement.dir === 'rtl');
    const list: Beat[] = [];
    for (const { key, at } of measured) {
      if (key === 'hero' && dial) {
        const pose = beats.anchoredPose(dial.getBoundingClientRect(), {
          tilt: 0,
          spin: 0,
          dim: 1,
          face: 1,
          eclipse: 0,
          stars: 0.15,
          light: 0,
        });
        list.push({ at, pose });
      } else if (key === 'finale' && eclipse) {
        const box = eclipse.getBoundingClientRect();
        // Past midnight the sun leaves with the page, into the city at its foot.
        const pose = beats.anchoredPose(box, {
          tilt: 0,
          spin: Math.PI * 2,
          dim: beats.clamp((box.top + box.height) / (box.height * 1.2)),
          face: 0,
          eclipse: 1,
          stars: 0.6,
          light: 0,
        });
        list.push({ at, pose });
      } else if (key in views) {
        list.push({ at, pose: views[key as ViewBeat] });
      }
    }
    return beats.poseAt(list, window.scrollY);
  }

  let pointer: { x: number; y: number } | null = null;
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') pointer = { x: event.clientX, y: event.clientY };
  };
  const onLeave = () => (pointer = null);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  function dialTilt() {
    return {
      x: Number(dial?.style.getPropertyValue('--tilt-x')) || 0,
      y: Number(dial?.style.getPropertyValue('--tilt-y')) || 0,
    };
  }

  // Resolution follows the device: lower while frames run long, back up once they are short again.
  let quality = 1;
  let frameTime = 1 / 60;
  let slow = 0;
  let fast = 0;
  function adapt(dt: number) {
    if (dt <= 0 || dt > 0.25) return;
    frameTime += (dt - frameTime) * 0.05;
    slow = frameTime > 1 / 40 ? slow + 1 : 0;
    fast = frameTime < 1 / 55 ? fast + 1 : 0;
    if (slow > 90 && quality > 0.5) {
      quality -= 0.25;
      slow = 0;
      scene.setQuality(quality);
    } else if (fast > 600 && quality < 1) {
      quality += 0.25;
      fast = 0;
      scene.setQuality(quality);
    }
  }

  let pose: Pose | null = null;
  let frame = 0;
  let last = performance.now();
  let shownDim = -1;
  let shownFace = -1;
  function loop(ms: number) {
    frame = requestAnimationFrame(loop);
    const dt = Math.min(0.1, Math.max(0, (ms - last) / 1000));
    last = ms;
    const goal = target();
    // The scene fades in from nothing the first time, then eases.
    pose = beats.dampPose(pose ?? { ...goal, dim: 0 }, goal, beats.dampFactor(6, dt));
    const dim = Math.round(beats.clamp(pose.dim) * 1000) / 1000;
    if (dim !== shownDim) el!.style.opacity = String((shownDim = dim));
    // Set on the dial, not the page: a custom property restyles everything under where it is set.
    const face = Math.round(beats.clamp(pose.face) * 100) / 100;
    if (face !== shownFace) dial?.style.setProperty('--orrery-face', String((shownFace = face)));
    if (winners && !winnersNear.value && winners.getBoundingClientRect().top < window.innerHeight * 2) {
      winnersNear.value = true;
    }
    if (dim < 0.005) return;
    adapt(dt);
    scene.render(pose, ms / 1000, dayProgress(now.value), { pointer, dialTilt: dialTilt() });
  }
  function sync() {
    cancelAnimationFrame(frame);
    if (!document.hidden) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }
  }
  document.addEventListener('visibilitychange', sync);

  const lost = (event: Event) => {
    event.preventDefault();
    stop();
  };
  el.addEventListener('webglcontextlost', lost);

  const unwatch = [
    watch(orreryTickets, (list) => scene.setTickets(list), { immediate: true }),
    watch(stars, (list) => scene.setStars(list), { immediate: true }),
    watch(flares, (list, previous) => {
      const seen = new Set((previous ?? []).map((f) => f.at));
      for (const f of list) if (!seen.has(f.at)) scene.flare(f.angle);
    }),
    // The theme's class lands on <html> after the value changes.
    watch(
      () => colorMode.value,
      () => nextTick(() => scene.setPalette(palette())),
    ),
  ];

  stop = () => {
    stop = () => {};
    cancelAnimationFrame(frame);
    unwatch.forEach((fn) => fn());
    resizer.disconnect();
    window.removeEventListener('resize', measure);
    window.removeEventListener('pointermove', onPointer);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    document.removeEventListener('visibilitychange', sync);
    el.removeEventListener('webglcontextlost', lost);
    dial?.style.removeProperty('--orrery-face');
    scene.dispose();
    orrery = null;
    emit('active', false);
  };

  sync();
  emit('active', true);
});

onBeforeUnmount(() => stop());
</script>

<template>
  <div>
    <canvas ref="canvas" aria-hidden="true" class="orrery pointer-events-none fixed inset-0 -z-[5] size-full" />
    <LandingOrreryFeed v-if="winnersNear" @rounds="otherWins = $event" />
  </div>
</template>

<style scoped>
.orrery {
  opacity: 0;
}
</style>
