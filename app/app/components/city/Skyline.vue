<script setup lang="ts">
/**
 * The neon city at the foot of every page, from the original landing hero:
 * digits falling through a magenta night, a synthwave sun setting behind two
 * layers of towers, and a grid floor running into the footer. The layers
 * drift apart with the mouse while the city is on screen. The towers' own
 * lights blink inside their SVGs, and everything holds still with reduced
 * motion.
 */
const root = useTemplateRef<HTMLElement>('root');

// Cut-outs in the lower half of the sun, one every 14 units and thicker
// towards the bottom. Each slides into the next one's place and size, so the
// loop has no seam.
const STRIPES = Array.from({ length: 9 }, (_, i) => {
  const height = 2 + i;
  return { y: 94 + i * 14 - height / 2, height, grow: (height + 1) / height };
});

let frame = 0;
let visible = false;

function onPointer(event: PointerEvent) {
  if (!visible || event.pointerType !== 'mouse') return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    root.value?.style.setProperty('--px', (event.clientX / window.innerWidth - 0.5).toFixed(3));
    root.value?.style.setProperty('--py', (event.clientY / window.innerHeight - 0.5).toFixed(3));
  });
}

let observer: IntersectionObserver | undefined;
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return;
  observer = new IntersectionObserver(([entry]) => (visible = entry?.isIntersecting ?? false));
  observer.observe(root.value);
  window.addEventListener('pointermove', onPointer, { passive: true });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  window.removeEventListener('pointermove', onPointer);
});
</script>

<template>
  <div ref="root" aria-hidden="true" class="skyline pointer-events-none relative overflow-hidden">
    <div class="sky" />
    <CityDigitRain class="rain absolute inset-x-0 top-0" />

    <div class="sun-wrap">
      <div class="parallax [--depth:10px]">
        <div class="sun-glow" />
        <svg viewBox="0 0 200 200" class="relative w-full">
          <defs>
            <linearGradient id="skyline-sun-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style="stop-color: var(--ui-color-warning-200)" />
              <stop offset="0.42" style="stop-color: var(--ui-color-primary-400)" />
              <stop offset="1" style="stop-color: var(--ui-color-primary-700)" />
            </linearGradient>
            <clipPath id="skyline-sun-lower">
              <rect y="96" width="200" height="104" />
            </clipPath>
            <mask id="skyline-sun-cuts">
              <rect width="200" height="200" fill="white" />
              <g clip-path="url(#skyline-sun-lower)">
                <rect
                  v-for="stripe in STRIPES"
                  :key="stripe.y"
                  class="stripe"
                  fill="black"
                  x="0"
                  :y="stripe.y"
                  width="200"
                  :height="stripe.height"
                  :style="{ '--grow': stripe.grow }"
                />
              </g>
            </mask>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#skyline-sun-fill)" mask="url(#skyline-sun-cuts)" />
        </svg>
      </div>
    </div>

    <div class="city-far">
      <img src="/images/city/far.svg" alt="" width="1600" height="420" loading="lazy" decoding="async" class="parallax [--depth:22px]" />
    </div>
    <div class="city-near">
      <img src="/images/city/near.svg" alt="" width="1600" height="300" loading="lazy" decoding="async" class="parallax [--depth:44px]" />
    </div>

    <div class="horizon" />
    <div class="floor">
      <div><div /></div>
    </div>
  </div>
</template>

<style scoped>
.skyline {
  --floor: 4.5rem;
  height: 15rem;
}

@media (min-width: 640px) {
  .skyline {
    --floor: 5.5rem;
    height: 20rem;
  }
}

@media (min-width: 1024px) {
  .skyline {
    --floor: 6rem;
    height: 24rem;
  }
}

/* Night falls from the page into the city: transparent on top, magenta at the horizon. */
.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(110% 70% at 60% 100%, color-mix(in oklab, var(--ui-primary) 40%, transparent), transparent 72%),
    radial-gradient(60% 50% at 12% 30%, color-mix(in oklab, var(--ui-secondary) 12%, transparent), transparent 70%);
  mask-image: linear-gradient(to bottom, transparent, #000 35%);
}

.rain {
  height: 78%;
  opacity: 0.28;
  mask-image: linear-gradient(to bottom, transparent, #000 30%, #000 55%, transparent);
}

.parallax {
  transform: translate3d(
    calc(var(--px, 0) * var(--depth, 12px) * -1),
    calc(var(--py, 0) * var(--depth, 12px) * -0.4),
    0
  );
  transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Sized so the whole disc fits the band above the floor at every width. */
.sun-wrap {
  position: absolute;
  bottom: calc(var(--floor) + 0.5rem);
  left: 50%;
  width: min(9.5rem, 44vw);
  translate: -50% 0;
}

@media (min-width: 640px) {
  .sun-wrap {
    width: 13rem;
  }
}

@media (min-width: 1024px) {
  .sun-wrap {
    left: 64%;
    width: 15rem;
  }
}

.sun-glow {
  position: absolute;
  inset: -25%;
  border-radius: 9999px;
  background: radial-gradient(circle, color-mix(in oklab, var(--ui-primary) 50%, transparent), transparent 62%);
  animation: glow 3.2s ease-in-out infinite;
}

@keyframes glow {
  50% {
    opacity: 0.55;
  }
}

/* The sun's cut-outs slide down, like a sunset on an old monitor. */
.stripe {
  transform-box: fill-box;
  transform-origin: center;
  animation: stripes 2.8s linear infinite;
}

@keyframes stripes {
  to {
    transform: translateY(14px) scaleY(var(--grow, 1));
  }
}

.city-far,
.city-near {
  position: absolute;
}

.city-far {
  inset-inline: -3%;
  bottom: var(--floor);
  height: 72%;
}

.city-near {
  inset-inline: -4%;
  bottom: calc(var(--floor) - 1px);
  height: 46%;
}

.city-far img,
.city-near img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom;
}

.city-far img {
  opacity: 0.9;
}

.horizon {
  position: absolute;
  inset-inline: 0;
  bottom: var(--floor);
  height: 1px;
  background: var(--ui-primary);
  box-shadow: 0 0 18px 3px var(--ui-primary);
}

/* A neon grid floor, running towards the viewer and into the footer. */
.floor {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: var(--floor);
  perspective: 16rem;
  perspective-origin: 50% 0%;
  overflow: hidden;
  background: linear-gradient(to bottom, color-mix(in oklab, var(--ui-primary) 15%, transparent), transparent);
}

.floor > div {
  position: absolute;
  inset: 0 -60% -200%;
  transform-origin: top center;
  transform: rotateX(64deg);
}

.floor > div > div {
  --size: 56px;
  position: absolute;
  inset: calc(-1 * var(--size)) 0 0;
  background-image:
    linear-gradient(color-mix(in oklab, var(--ui-primary) 70%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--ui-primary) 55%, transparent) 1px, transparent 1px);
  background-size: var(--size) var(--size);
  animation: run 2.4s linear infinite;
}

@keyframes run {
  to {
    transform: translateY(var(--size));
  }
}
</style>
