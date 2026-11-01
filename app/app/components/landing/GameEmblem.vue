<script setup lang="ts">
import { GameKind } from '@solucky/client';

/**
 * Each game's mark, drawn in thin lines with one point of accent: the daily
 * lottery's sun, the hourly lottery's clock, Guess the number's radar. They
 * turn slowly, and a little faster while their card is hovered. Decorative.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it; `size` is a sizing class.
const props = withDefaults(defineProps<{ kind: number; size?: string }>(), { size: 'size-14' });

const rays = Array.from({ length: 12 }, (_, i) => i * 30);
const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
</script>

<template>
  <svg viewBox="-32 -32 64 64" class="emblem" :class="props.size" aria-hidden="true" :data-kind="props.kind">
    <!-- Daily: the sun, its rays turning. -->
    <g v-if="props.kind === GameKind.Daily">
      <g class="spin">
        <line
          v-for="angle in rays"
          :key="angle"
          y1="-15"
          :y2="angle % 90 ? -21 : -25"
          :transform="`rotate(${angle})`"
          class="stroke-(--ui-text-muted)"
          stroke-width="2"
          stroke-linecap="round"
        />
      </g>
      <circle r="9" class="fill-(--ui-primary)" />
    </g>

    <!-- Hourly: a clock face, the minute hand sweeping. -->
    <g v-else-if="props.kind === GameKind.Hourly">
      <circle r="23" class="fill-none stroke-(--ui-text-muted)" stroke-width="2" />
      <line
        v-for="angle in ticks"
        :key="angle"
        y1="-19"
        :y2="angle % 90 ? -17.5 : -15.5"
        :transform="`rotate(${angle})`"
        class="stroke-(--ui-text-dimmed)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line y2="-10" class="hour stroke-(--ui-text-highlighted)" stroke-width="2.4" stroke-linecap="round" />
      <line y2="-17" class="minute stroke-(--ui-primary)" stroke-width="2" stroke-linecap="round" />
      <circle r="2.4" class="fill-(--ui-primary)" />
    </g>

    <!-- Guess: a radar sweeping until it finds the number. -->
    <g v-else>
      <circle r="23" class="fill-none stroke-(--ui-text-muted)" stroke-width="2" />
      <circle r="14" class="fill-none stroke-(--ui-text-dimmed)" stroke-width="1" stroke-dasharray="2 3" />
      <circle r="5.5" class="fill-none stroke-(--ui-text-dimmed)" stroke-width="1" />
      <g class="radar">
        <path d="M 0 0 L 0 -23 A 23 23 0 0 1 19.9 -11.5 Z" class="fill-(--ui-primary)/15" />
        <line y2="-23" class="stroke-(--ui-primary)" stroke-width="1.6" stroke-linecap="round" />
      </g>
      <circle cx="9" cy="-9" r="2.6" class="blip fill-(--ui-primary)" />
    </g>
  </svg>
</template>

<style scoped>
.emblem {
  overflow: visible;
}

.spin {
  animation: turn 40s linear infinite;
}

.minute {
  animation: turn 10s linear infinite;
}

.hour {
  animation: turn 120s linear -20s infinite;
}

.radar {
  animation: turn 4s linear infinite;
}

:global(.group:hover) .spin {
  animation-duration: 12s;
}

/* The blip lights up each time the sweep passes over it (about an eighth of a turn in). */
.blip {
  opacity: 0;
  animation: blip 4s linear infinite;
}

@keyframes turn {
  to {
    rotate: 360deg;
  }
}

@keyframes blip {
  0%,
  8% {
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  60%,
  100% {
    opacity: 0;
  }
}
</style>
