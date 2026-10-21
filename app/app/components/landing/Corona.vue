<script setup lang="ts">
/**
 * The sun's corona around the solar dial: a ring of rays whose length drifts
 * with slow noise, leans towards the pointer, and flares wherever a ticket
 * lands. The parent sizes and centres the canvas on the dial; `inner` is the
 * dial's radius as a share of the canvas width. Draws at a low frame rate, stops off screen and
 * in background tabs, and keeps a single still frame for reduced motion.
 */
const props = withDefaults(defineProps<{ inner?: number }>(), { inner: 0.26 });

const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
const { flares, FLARE_MS } = useSolarFlares();

const RAYS = 320;
const FPS = 30;

let stop = () => {};

onMounted(() => {
  const el = canvas.value;
  const ctx = el?.getContext('2d');
  if (!el || !ctx) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A fixed jitter per ray, so the corona looks combed rather than uniform.
  const jitter = Array.from(
    { length: RAYS },
    (_, i) => 0.55 + 0.45 * Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1),
  );
  let width = 0;
  let primary = '';
  let secondary = '';
  // Pointer angle and how strongly the rays lean towards it (eases in and out).
  let pointer: number | null = null;
  let lean = 0;

  function resolve(variable: string) {
    el!.style.color = `var(${variable})`;
    return getComputedStyle(el!).color;
  }

  function reset() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = el!.clientWidth;
    el!.width = Math.round(width * ratio);
    el!.height = Math.round(el!.clientHeight * ratio);
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    primary = resolve('--ui-primary');
    secondary = resolve('--ui-secondary');
  }

  function angularDistance(a: number, b: number) {
    const d = Math.abs(a - b) % (2 * Math.PI);
    return d > Math.PI ? 2 * Math.PI - d : d;
  }

  function draw(time: number) {
    const t = time / 1000;
    const cx = width / 2;
    const cy = el!.clientHeight / 2;
    const r0 = width * props.inner;
    const reach = width * 0.2;
    lean += ((pointer === null ? 0 : 1) - lean) * 0.06;
    const now = performance.now();
    const live = flares.value.filter((f) => now - f.at < FLARE_MS);

    ctx!.clearRect(0, 0, width, el!.clientHeight);
    ctx!.lineCap = 'round';
    ctx!.lineWidth = 1.1;
    for (const [color, every, alpha] of [
      [primary, 1, 0.5],
      [secondary, 9, 0.7],
    ] as const) {
      ctx!.beginPath();
      for (let i = 0; i < RAYS; i += every) {
        if (every === 1 && i % 9 === 0) continue;
        const angle = (i / RAYS) * 2 * Math.PI - Math.PI / 2;
        let length =
          0.5 +
          0.22 * Math.sin(3 * angle + t * 0.35) +
          0.16 * Math.sin(7 * angle - t * 0.6 + 1.3) +
          0.1 * Math.sin(17 * angle + t * 1.1 + 0.7);
        length *= jitter[i]!;
        if (pointer !== null || lean > 0.01) {
          const d = angularDistance(angle, pointer ?? 0);
          length += 0.45 * lean * Math.exp(-((d / 0.3) ** 2));
        }
        for (const flare of live) {
          const age = (now - flare.at) / FLARE_MS;
          const d = angularDistance(angle, flare.angle);
          length += 0.9 * Math.sin(Math.PI * age) * Math.exp(-((d / 0.12) ** 2));
        }
        const end = r0 + reach * Math.max(0.08, length);
        ctx!.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
        ctx!.lineTo(cx + Math.cos(angle) * end, cy + Math.sin(angle) * end);
      }
      ctx!.strokeStyle = color;
      ctx!.globalAlpha = alpha;
      ctx!.stroke();
    }
    ctx!.globalAlpha = 1;

    // Fade the rays out with distance from the sun.
    const fade = ctx!.createRadialGradient(cx, cy, r0, cx, cy, r0 + reach * 1.4);
    fade.addColorStop(0, 'rgba(0, 0, 0, 1)');
    fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx!.globalCompositeOperation = 'destination-in';
    ctx!.fillStyle = fade;
    ctx!.fillRect(0, 0, width, el!.clientHeight);
    ctx!.globalCompositeOperation = 'source-over';
  }

  reset();
  if (reduced) {
    draw(0);
    return;
  }

  function onPointer(event: PointerEvent) {
    const rect = el!.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    // Only lean while the pointer is around the dial, not anywhere on the page.
    pointer = Math.hypot(dx, dy) < rect.width * 0.5 ? Math.atan2(dy, dx) : null;
  }

  let visible = true;
  let frame = 0;
  let last = 0;
  function loop(time: number) {
    frame = requestAnimationFrame(loop);
    if (time - last < 1000 / FPS) return;
    last = time;
    draw(time);
  }
  function sync() {
    cancelAnimationFrame(frame);
    if (visible && !document.hidden) frame = requestAnimationFrame(loop);
  }

  const resizer = new ResizeObserver(() => reset());
  resizer.observe(el);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    sync();
  });
  observer.observe(el);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pointermove', onPointer, { passive: true });
  sync();

  stop = () => {
    cancelAnimationFrame(frame);
    resizer.disconnect();
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pointermove', onPointer);
  };
});

onBeforeUnmount(() => stop());
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" class="pointer-events-none" />
</template>
