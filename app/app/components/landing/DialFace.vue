<script setup lang="ts">
/**
 * The still parts of the solar dial: the turning bezel, the 24-hour ring and
 * the rings tickets sit on. Rendered on the server, so the dial is in place
 * before `LandingDialLive` loads the day's data on top of it.
 */
const BEZEL =
  'S☉LUCKY · ONE DRAW A DAY · DRAWN AFTER MIDNIGHT UTC · EVERY TICKET ON SOLANA · ' +
  'S☉LUCKY · ONE DRAW A DAY · DRAWN AFTER MIDNIGHT UTC · EVERY TICKET ON SOLANA · ';

// One tick every 15 minutes, longer on the hour.
const ticks = Array.from({ length: 96 }, (_, i) => {
  const angle = -Math.PI / 2 + (i / 96) * 2 * Math.PI;
  const hour = i % 4 === 0;
  const from = dialPoint(angle, DIAL.ring);
  const to = dialPoint(angle, DIAL.ring - (hour ? 14 : 6));
  return { key: i, hour, from, to };
});

// Hour labels every three hours; midnight is marked as the draw.
const labels = Array.from({ length: 8 }, (_, i) => {
  const angle = -Math.PI / 2 + (i / 8) * 2 * Math.PI;
  return { key: i, text: i === 0 ? 'DRAW' : String(i * 3).padStart(2, '0'), ...dialPoint(angle, DIAL.labels) };
});

const spokes = Array.from({ length: 8 }, (_, i) => {
  const angle = -Math.PI / 2 + (i / 8) * 2 * Math.PI;
  return { key: i, from: dialPoint(angle, DIAL.inner), to: dialPoint(angle, DIAL.outer) };
});

const rings = [0, 0.25, 0.5, 0.75, 1].map((share) => DIAL.inner + (DIAL.outer - DIAL.inner) * share);
const circle = (r: number) => `M 0 ${-r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 ${-2 * r}`;
</script>

<template>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 select-none">
    <svg viewBox="-300 -300 600 600" class="absolute inset-0 size-full">
      <circle :r="DIAL.bezel" class="fill-(--ui-bg)/70 stroke-(--ui-border)" stroke-width="1" />
      <circle :r="DIAL.ring + 8" class="fill-none stroke-(--ui-border)" stroke-width="1" />
      <circle :r="DIAL.ring" class="fill-none stroke-(--ui-border-accented)" stroke-width="1" />

      <line
        v-for="tick in ticks"
        :key="tick.key"
        :x1="tick.from.x"
        :y1="tick.from.y"
        :x2="tick.to.x"
        :y2="tick.to.y"
        :class="tick.hour ? 'stroke-(--ui-text-toned)' : 'stroke-(--ui-text-dimmed)'"
        :stroke-width="tick.hour ? 1.6 : 1"
      />
      <text
        v-for="label in labels"
        :key="label.key"
        :x="label.x"
        :y="label.y"
        text-anchor="middle"
        dominant-baseline="central"
        class="font-mono text-[13px] tracking-[0.15em]"
        :class="label.key === 0 ? 'fill-(--ui-secondary) font-semibold' : 'fill-(--ui-text-muted)'"
      >
        {{ label.text }}
      </text>

      <circle
        v-for="(r, index) in rings"
        :key="r"
        :r="r"
        class="fill-none stroke-(--ui-border)"
        :stroke-dasharray="index === 0 || index === rings.length - 1 ? undefined : '2 6'"
        stroke-width="1"
      />
      <line
        v-for="spoke in spokes"
        :key="spoke.key"
        :x1="spoke.from.x"
        :y1="spoke.from.y"
        :x2="spoke.to.x"
        :y2="spoke.to.y"
        class="stroke-(--ui-border)"
        stroke-dasharray="2 6"
      />

      <circle :r="DIAL.core" class="fill-(--ui-bg) stroke-(--ui-primary)/40" stroke-width="1.5" />
    </svg>

    <!-- The bezel turns slowly, like a watch's. -->
    <svg viewBox="-300 -300 600 600" class="absolute inset-0 size-full animate-[spin_240s_linear_infinite]">
      <path id="dial-bezel" :d="circle(DIAL.bezelText)" fill="none" />
      <text class="fill-(--ui-text-dimmed) font-mono text-[11px] font-semibold">
        <textPath href="#dial-bezel" :textLength="2 * Math.PI * DIAL.bezelText - 4" lengthAdjust="spacing">
          {{ BEZEL }}
        </textPath>
      </text>
    </svg>
  </div>
</template>
