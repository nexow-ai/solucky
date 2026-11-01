<script setup lang="ts">
import { GameKind } from '@solucky/client';

/**
 * The dial on each game's page, in soft relief: a disc standing out of the
 * page, a track pressed into it, and a raised core in the middle that holds
 * the readout. Its rim is the game's round: the 24 hours of the UTC day
 * (daily), the 60 minutes of the hour (hourly), both from the top; or the
 * range of numbers a guess can take, 0 at the top (Guess, read like a
 * radar). The live layer (`HeroDialLive`) fills the track and the core; on
 * its own, the dial shows its empty face.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number }>();

// How many marks go around the rim, and every how many of them a long one stands.
const FACES: Record<number, { marks: number; every: number }> = {
  [GameKind.Daily]: { marks: 24, every: 6 },
  [GameKind.Hourly]: { marks: 60, every: 5 },
  [GameKind.Guess]: { marks: 40, every: 10 },
};

const marks = computed(() => {
  const face = FACES[props.kind] ?? FACES[GameKind.Daily]!;
  return Array.from({ length: face.marks }, (_, i) => {
    const angle = dialAngle(i / face.marks);
    const major = i % face.every === 0;
    return { key: i, major, from: dialPoint(angle, 90), to: dialPoint(angle, major ? 95 : 93) };
  });
});
// Hourly's sixty marks stand closer together, so they are finer.
const fine = computed(() => props.kind === GameKind.Hourly);
</script>

<template>
  <div class="relative mx-auto aspect-square w-full max-w-[30rem] @container" dir="ltr">
    <!-- The disc, the track pressed into it, and the raised core. -->
    <div class="absolute inset-0 rounded-full bg-default shadow-(--neu-lg)" aria-hidden="true" />
    <div class="absolute inset-[9%] rounded-full shadow-(--neu-in)" aria-hidden="true" />
    <svg viewBox="-100 -100 200 200" class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <line
        v-for="m in marks"
        :key="m.key"
        :x1="m.from.x"
        :y1="m.from.y"
        :x2="m.to.x"
        :y2="m.to.y"
        :class="
          m.key === 0 ? 'stroke-(--ui-primary)' : m.major ? 'stroke-(--ui-text-muted)' : 'stroke-(--ui-text-dimmed)/60'
        "
        :stroke-width="m.major ? 1.2 : fine ? 0.5 : 0.8"
        stroke-linecap="round"
      />
      <circle r="74" class="fill-none stroke-(--ui-text-dimmed)/20" stroke-width="2.5" />
      <!-- Guess: the radar's inner ring. -->
      <circle
        v-if="props.kind === GameKind.Guess"
        r="62"
        class="fill-none stroke-(--ui-text-dimmed)/30"
        stroke-width="0.6"
        stroke-dasharray="1.5 2.5"
      />
    </svg>
    <div class="absolute inset-[25%] rounded-full bg-default shadow-(--neu)" aria-hidden="true" />
    <slot />
  </div>
</template>
