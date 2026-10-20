<script setup lang="ts">
/**
 * The landing hero's backdrop: a night sky with falling digits, a synthwave
 * sun setting behind a neon city, and a grid floor running towards the
 * viewer. The layers drift with the mouse for depth.
 */
const root = useTemplateRef<HTMLElement>('root');

// Cut-outs in the lower half of the sun, one every 14 units and thicker towards the bottom.
// Each slides into the next one's place and size, so the loop has no seam.
const STRIPES = Array.from({ length: 9 }, (_, i) => {
  const height = 2 + i;
  return { y: 94 + i * 14 - height / 2, height, grow: (height + 1) / height };
});

let frame = 0;
function onPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const el = root.value;
    if (!el) return;
    el.style.setProperty('--px', (event.clientX / window.innerWidth - 0.5).toFixed(3));
    el.style.setProperty('--py', (event.clientY / window.innerHeight - 0.5).toFixed(3));
  });
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('pointermove', onPointer, { passive: true });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener('pointermove', onPointer);
});
</script>

<template>
  <div
    ref="root"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-default [--floor:5.5rem] sm:[--floor:7.5rem] lg:[--floor:8.5rem]"
  >
    <!-- Sky: a magenta haze rising from the horizon. -->
    <div
      class="absolute inset-0 bg-[radial-gradient(110%_65%_at_60%_100%,color-mix(in_oklab,var(--ui-primary)_38%,transparent),transparent_72%)]"
    />
    <div
      class="absolute inset-0 bg-[radial-gradient(60%_45%_at_10%_0%,color-mix(in_oklab,var(--ui-secondary)_16%,transparent),transparent_70%)]"
    />

    <LandingDigitRain
      class="absolute inset-x-0 top-0 h-[78%] opacity-30 mask-[linear-gradient(to_bottom,black_25%,transparent)]"
    />

    <!-- The sun, half set behind the city. -->
    <div
      class="absolute bottom-[calc(var(--floor)+2.5rem)] left-1/2 w-[min(32rem,92vw)] -translate-x-1/2 lg:left-[64%]"
    >
      <div class="parallax [--depth:10px]">
        <div
          class="absolute -inset-1/4 animate-glow rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--ui-primary)_50%,transparent),transparent_62%)]"
        />
        <svg viewBox="0 0 200 200" class="relative w-full">
          <defs>
            <linearGradient id="hero-sun-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style="stop-color: var(--ui-color-warning-200)" />
              <stop offset="0.42" style="stop-color: var(--ui-color-primary-400)" />
              <stop offset="1" style="stop-color: var(--ui-color-primary-700)" />
            </linearGradient>
            <clipPath id="hero-sun-lower">
              <rect y="96" width="200" height="104" />
            </clipPath>
            <mask id="hero-sun-cuts">
              <rect width="200" height="200" fill="white" />
              <g clip-path="url(#hero-sun-lower)">
                <rect
                  v-for="stripe in STRIPES"
                  :key="stripe.y"
                  class="animate-sun-stripes"
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
          <circle cx="100" cy="100" r="100" fill="url(#hero-sun-fill)" mask="url(#hero-sun-cuts)" />
        </svg>
      </div>
    </div>

    <!-- The city, in two layers that drift apart with the mouse. -->
    <div class="absolute inset-x-[-3%] bottom-(--floor) h-44 sm:h-64 lg:h-[21rem]">
      <img
        src="/images/city-far.svg"
        alt=""
        class="parallax size-full object-cover object-bottom opacity-90 [--depth:22px]"
        width="1600"
        height="420"
      />
    </div>
    <div class="absolute inset-x-[-4%] bottom-[calc(var(--floor)-1px)] h-28 sm:h-44 lg:h-56">
      <img
        src="/images/city-near.svg"
        alt=""
        class="parallax size-full object-cover object-bottom [--depth:44px]"
        width="1600"
        height="300"
      />
    </div>

    <!-- Horizon and the grid floor. -->
    <div class="absolute inset-x-0 bottom-(--floor) h-px bg-primary shadow-[0_0_18px_3px_var(--ui-primary)]" />
    <div class="grid-floor absolute inset-x-0 bottom-0 h-(--floor) bg-linear-to-b from-primary/15 to-default">
      <div><div /></div>
    </div>

    <!-- Glass: a readable left side for the copy, scanlines and a vignette. -->
    <div class="absolute inset-0 bg-linear-to-r from-default/70 via-default/10 to-transparent max-lg:hidden" />
    <div class="bg-scanlines absolute inset-0 opacity-50" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--ui-bg)_100%)]" />
  </div>
</template>
