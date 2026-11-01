<script setup lang="ts">
import { GameKind } from '@solucky/client';

/**
 * A small animated sign for each game: the daily lottery's sun turning, the
 * hourly lottery's clock sweeping round, Guess the number's radar hunting for
 * the hidden number. They glow brighter while their card is hovered. Decorative.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it; `size` is a sizing class.
const props = withDefaults(defineProps<{ kind: number; size?: string }>(), { size: 'size-14' });

const rays = Array.from({ length: 12 }, (_, i) => i * 30);
const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
</script>

<template>
  <svg viewBox="-32 -32 64 64" class="emblem" :class="props.size" aria-hidden="true" :data-kind="props.kind">
    <defs>
      <radialGradient :id="`emblem-glow-${props.kind}`">
        <stop offset="0" style="stop-color: var(--ui-primary); stop-opacity: 0.55" />
        <stop offset="1" style="stop-color: var(--ui-primary); stop-opacity: 0" />
      </radialGradient>
    </defs>
    <circle r="31" :fill="`url(#emblem-glow-${props.kind})`" class="halo" />

    <!-- Daily: the sun, its rays turning. -->
    <g v-if="props.kind === GameKind.Daily">
      <g class="spin">
        <line
          v-for="angle in rays"
          :key="angle"
          y1="-14"
          y2="-24"
          :transform="`rotate(${angle})`"
          class="stroke-(--ui-primary)"
          stroke-width="2.4"
          stroke-linecap="round"
        />
      </g>
      <circle r="10" class="fill-(--ui-color-primary-300) core" />
      <circle r="10" class="fill-none stroke-(--ui-bg)" stroke-width="1.5" />
    </g>

    <!-- Hourly: a clock face, the minute hand sweeping. -->
    <g v-else-if="props.kind === GameKind.Hourly">
      <circle r="22" class="fill-(--ui-bg)/60 stroke-(--ui-primary)" stroke-width="2" />
      <line
        v-for="angle in ticks"
        :key="angle"
        y1="-19"
        :y2="angle % 90 ? -17 : -15"
        :transform="`rotate(${angle})`"
        class="stroke-(--ui-text-muted)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path d="M 0 0 L 0 -19 A 19 19 0 0 1 13.4 -13.4 Z" class="sweep fill-(--ui-primary)/25" />
      <line y2="-11" class="hour stroke-(--ui-text-highlighted)" stroke-width="2.6" stroke-linecap="round" />
      <line y2="-18" class="minute stroke-(--ui-secondary)" stroke-width="1.8" stroke-linecap="round" />
      <circle r="2.4" class="fill-(--ui-secondary)" />
    </g>

    <!-- Guess: a radar sweeping until it finds the number. -->
    <g v-else>
      <circle r="22" class="fill-(--ui-bg)/60 stroke-(--ui-primary)/70" stroke-width="1.5" />
      <circle r="14" class="fill-none stroke-(--ui-primary)/40" stroke-width="1" stroke-dasharray="2 3" />
      <circle r="6" class="fill-none stroke-(--ui-primary)/40" stroke-width="1" />
      <line x1="-22" x2="22" class="stroke-(--ui-primary)/25" />
      <line y1="-22" y2="22" class="stroke-(--ui-primary)/25" />
      <g class="radar">
        <path d="M 0 0 L 0 -22 A 22 22 0 0 1 19 -11 Z" class="fill-(--ui-secondary)/30" />
        <line y2="-22" class="stroke-(--ui-secondary)" stroke-width="1.6" stroke-linecap="round" />
      </g>
      <circle cx="9" cy="-9" r="2.6" class="blip fill-(--ui-secondary)" />
    </g>
  </svg>
</template>

<style scoped>
.emblem {
  overflow: visible;
  transition:
    scale 0.5s var(--ease-spring),
    filter 0.5s ease;
}

:global(.group:hover) .emblem {
  scale: 1.08;
  filter: drop-shadow(0 0 10px color-mix(in oklab, var(--ui-primary) 60%, transparent));
}

.halo {
  animation: halo 3.2s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.spin {
  animation: turn 24s linear infinite;
}

.core {
  filter: drop-shadow(0 0 6px var(--ui-primary));
}

.sweep,
.minute {
  animation: turn 6s linear infinite;
}

.hour {
  animation: turn 72s linear -14s infinite;
}

.radar {
  animation: turn 3.2s linear infinite;
}

/* The blip lights up each time the sweep passes over it (about an eighth of a turn in). */
.blip {
  opacity: 0;
  filter: drop-shadow(0 0 4px var(--ui-secondary));
  animation: blip 3.2s linear infinite;
}

@keyframes turn {
  to {
    rotate: 360deg;
  }
}

@keyframes halo {
  50% {
    opacity: 0.55;
    scale: 0.9;
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
