<script setup lang="ts">
/**
 * Falling streams of digits in the neon colors. Draws at a low frame rate,
 * stops while off screen or in a background tab, and shows a single still
 * frame when the visitor prefers reduced motion.
 */
const canvas = useTemplateRef<HTMLCanvasElement>('canvas');

const CELL = 18;
const FPS = 24;

interface Drop {
  y: number;
  speed: number;
  color: string;
}

let stop = () => {};

onMounted(() => {
  const el = canvas.value;
  const ctx = el?.getContext('2d');
  if (!el || !ctx) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let drops: Drop[] = [];
  let rows = 0;
  let colors: string[] = [];
  let highlight = '';

  function resolve(variable: string) {
    el!.style.color = `var(${variable})`;
    return getComputedStyle(el!).color;
  }

  function reset() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    el!.width = Math.round(el!.clientWidth * ratio);
    el!.height = Math.round(el!.clientHeight * ratio);
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx!.font = `500 ${CELL - 4}px ${getComputedStyle(el!).getPropertyValue('--font-mono') || 'monospace'}`;
    ctx!.textAlign = 'center';
    colors = [resolve('--ui-primary'), resolve('--ui-primary'), resolve('--ui-secondary')];
    highlight = resolve('--ui-text-highlighted');
    rows = Math.ceil(el!.clientHeight / CELL);
    const columns = Math.ceil(el!.clientWidth / CELL);
    drops = Array.from({ length: columns }, () => ({
      y: -Math.random() * rows * 1.5,
      speed: 0.25 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)]!,
    }));
  }

  function step() {
    // Fade what is already drawn towards transparent, leaving a trail.
    ctx!.globalCompositeOperation = 'destination-out';
    ctx!.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx!.fillRect(0, 0, el!.clientWidth, el!.clientHeight);
    ctx!.globalCompositeOperation = 'source-over';
    drops.forEach((drop, column) => {
      const previous = Math.floor(drop.y);
      drop.y += drop.speed;
      const row = Math.floor(drop.y);
      if (row !== previous && row >= 0) {
        const x = column * CELL + CELL / 2;
        // The trail keeps the stream's color; the head is drawn bright.
        ctx!.fillStyle = drop.color;
        ctx!.fillText(String(Math.floor(Math.random() * 10)), x, (row - 1) * CELL + CELL);
        ctx!.fillStyle = highlight;
        ctx!.fillText(String(Math.floor(Math.random() * 10)), x, row * CELL + CELL);
      }
      if (row > rows && Math.random() > 0.975) {
        drop.y = -Math.random() * rows * 0.5;
        drop.speed = 0.25 + Math.random() * 0.6;
      }
    });
  }

  reset();

  if (reduced) {
    for (let i = 0; i < 120; i++) step();
    return;
  }

  let visible = true;
  let frame = 0;
  let last = 0;
  function loop(time: number) {
    frame = requestAnimationFrame(loop);
    if (time - last < 1000 / FPS) return;
    last = time;
    step();
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
  sync();

  stop = () => {
    cancelAnimationFrame(frame);
    resizer.disconnect();
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
  };
});

onBeforeUnmount(() => stop());
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" class="pointer-events-none size-full" />
</template>
