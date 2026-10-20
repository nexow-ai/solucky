<script setup lang="ts">
import type { Account } from '@solana/kit';
import { formatDay, type Round } from '@solucky/client';

/** Pot of each settled round, oldest to newest: one column per day. */
const props = defineProps<{ rounds: readonly Account<Round>[] }>();

const WIDTH = 320;
const HEIGHT = 140;
const PAD = { top: 18, right: 4, bottom: 18, left: 4 };
const MAX_BARS = 30;

const bars = computed(() => {
  const data = [...props.rounds].reverse().slice(-MAX_BARS);
  const max = data.reduce((m, r) => (r.data.pot > m ? r.data.pot : m), 0n);
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const band = innerW / Math.max(data.length, 1);
  const width = Math.min(24, Math.max(4, band - 2));
  return data.map((round, i) => {
    const h = max === 0n ? 0 : Math.max(2, (Number(round.data.pot) / Number(max)) * innerH);
    return {
      key: round.address,
      day: round.data.day,
      label: formatDay(round.data.day),
      pot: round.data.pot,
      isMax: round.data.pot === max,
      band: { x: PAD.left + i * band, width: band },
      x: PAD.left + i * band + (band - width) / 2,
      y: PAD.top + innerH - h,
      width,
      height: h,
    };
  });
});

const hovered = ref<number | null>(null);
const active = computed(() => (hovered.value === null ? null : bars.value[hovered.value]));

/** A column with a 4px rounded top and a square base. */
function columnPath(bar: { x: number; y: number; width: number; height: number }) {
  const r = Math.min(4, bar.width / 2, bar.height);
  const bottom = bar.y + bar.height;
  return [
    `M${bar.x},${bottom}`,
    `V${bar.y + r}`,
    `Q${bar.x},${bar.y} ${bar.x + r},${bar.y}`,
    `H${bar.x + bar.width - r}`,
    `Q${bar.x + bar.width},${bar.y} ${bar.x + bar.width},${bar.y + r}`,
    `V${bottom}`,
    'Z',
  ].join(' ');
}
</script>

<template>
  <figure class="relative">
    <figcaption class="kicker mb-2 text-center">Pot per day</figcaption>
    <p v-if="!bars.length" class="py-10 text-center text-sm text-muted">No finished rounds yet.</p>
    <svg
      v-else
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      class="w-full overflow-visible"
      role="img"
      :aria-label="`Pot of the last ${bars.length} rounds; the list below has every value.`"
      @mouseleave="hovered = null"
    >
      <line
        :x1="PAD.left"
        :x2="WIDTH - PAD.right"
        :y1="HEIGHT - PAD.bottom"
        :y2="HEIGHT - PAD.bottom"
        class="stroke-(--ui-border)"
        stroke-width="1"
      />
      <g v-for="(bar, i) in bars" :key="bar.key">
        <path
          :d="columnPath(bar)"
          class="fill-(--ui-primary) transition-opacity"
          :class="hovered !== null && hovered !== i ? 'opacity-40' : ''"
        />
        <text
          v-if="bar.isMax"
          :x="bar.x + bar.width / 2"
          :y="bar.y - 5"
          text-anchor="middle"
          class="fill-(--ui-text-muted) text-[9px] font-semibold tabular-nums"
        >
          ◎{{ formatSol(bar.pot, 2) }}
        </text>
        <rect
          :x="bar.band.x"
          :y="0"
          :width="bar.band.width"
          :height="HEIGHT"
          fill="transparent"
          class="cursor-pointer"
          @mouseenter="hovered = i"
          @focus="hovered = i"
          @click="navigateTo(`/rounds/${bar.label}`)"
        />
      </g>
      <text :x="PAD.left" :y="HEIGHT - 4" class="fill-(--ui-text-dimmed) text-[9px]">
        {{ bars[0]?.label }}
      </text>
      <text :x="WIDTH - PAD.right" :y="HEIGHT - 4" text-anchor="end" class="fill-(--ui-text-dimmed) text-[9px]">
        {{ bars[bars.length - 1]?.label }}
      </text>
    </svg>
    <div
      v-if="active"
      class="pointer-events-none absolute top-6 rounded-md border border-default bg-default px-2 py-1 text-xs shadow-lg"
      :style="{ left: `${((active.x + active.width / 2) / WIDTH) * 100}%`, transform: 'translateX(-50%)' }"
    >
      <p class="text-muted">{{ active.label }}</p>
      <p class="font-semibold tabular-nums text-highlighted">◎{{ formatSol(active.pot, 3) }}</p>
    </div>
  </figure>
</template>
