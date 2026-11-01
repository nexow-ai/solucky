<script setup lang="ts">
/**
 * The landing's dial, in soft relief: a disc standing out of the page with
 * the 24 hours of the UTC day around its rim, a track pressed into it where
 * the day runs from 00:00 at the top, and a raised core in the middle that
 * holds the readout. The live layer (`HeroDialLive`) fills the track and the
 * core; on its own, the dial shows its empty face.
 */
const hours = Array.from({ length: 24 }, (_, i) => {
  const angle = -Math.PI / 2 + (i / 24) * 2 * Math.PI;
  const major = i % 6 === 0;
  return { key: i, major, from: dialPoint(angle, 90), to: dialPoint(angle, major ? 95 : 93) };
});
</script>

<template>
  <div class="relative mx-auto aspect-square w-full max-w-[30rem] @container" dir="ltr">
    <!-- The disc, the track pressed into it, and the raised core. -->
    <div class="absolute inset-0 rounded-full bg-default shadow-(--neu-lg)" aria-hidden="true" />
    <div class="absolute inset-[9%] rounded-full shadow-(--neu-in)" aria-hidden="true" />
    <svg viewBox="-100 -100 200 200" class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <line
        v-for="h in hours"
        :key="h.key"
        :x1="h.from.x"
        :y1="h.from.y"
        :x2="h.to.x"
        :y2="h.to.y"
        :class="
          h.key === 0 ? 'stroke-(--ui-primary)' : h.major ? 'stroke-(--ui-text-muted)' : 'stroke-(--ui-text-dimmed)/60'
        "
        :stroke-width="h.major ? 1.2 : 0.8"
        stroke-linecap="round"
      />
      <circle r="74" class="fill-none stroke-(--ui-text-dimmed)/20" stroke-width="2.5" />
    </svg>
    <div class="absolute inset-[25%] rounded-full bg-default shadow-(--neu)" aria-hidden="true" />
    <slot />
  </div>
</template>
