<script setup lang="ts">
import { countryFromBytes, flagEmoji, GameKind, msUntilClose } from '@solucky/client';

/**
 * The live layer of the landing's dial (`HeroDial`): the day so far as an arc
 * in the track, with a bead at the cluster's time of day; today's tickets as
 * points, placed by the time they were bought (around) and their number
 * (outwards); and in the core, today's pot and the time left to the draw.
 * Browser only.
 */
const { t } = useI18n();
const intl = useIntlLocale();
const { period, tickets, pot, maxNumber, loading } = useLottery(GameKind.Daily);
const { address } = useWallet();
const price = useSolPrice();
const now = useNow();

const TRACK = 74;

const day = computed(() => {
  const angle = dialAngle(now.value);
  const progress = dayProgress(now.value);
  const end = dialPoint(angle, TRACK);
  return { ...end, arc: `M 0 ${-TRACK} A ${TRACK} ${TRACK} 0 ${progress > 0.5 ? 1 : 0} 1 ${end.x} ${end.y}` };
});

const dots = computed(() =>
  tickets.value.map((ticket) => {
    const { number, createdAt, owner, country } = ticket.data;
    const angle = dialAngle(Number(createdAt) * 1000);
    const radius = 56 + 12 * Math.min(1, number / Math.max(1, maxNumber.value));
    return {
      key: ticket.address,
      mine: owner === address.value,
      title: `${formatNumber(number)} ${flagEmoji(countryFromBytes(country))} · ${formatUtcTime(createdAt)} UTC`,
      ...dialPoint(angle, radius),
    };
  }),
);

const countdown = computed(() => {
  const total = Math.max(0, Math.floor(msUntilClose(GameKind.Daily, period.value ?? 0, now.value) / 1000));
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
});
</script>

<template>
  <div class="absolute inset-0">
    <svg
      viewBox="-100 -100 200 200"
      class="absolute inset-0 size-full"
      role="img"
      :aria-label="t('dial.tickets', { n: dots.length }, dots.length)"
    >
      <defs>
        <linearGradient id="hero-dial-arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style="stop-color: var(--color-violet-400)" />
          <stop offset="1" style="stop-color: var(--color-fuchsia-500)" />
        </linearGradient>
      </defs>
      <path :d="day.arc" fill="none" stroke="url(#hero-dial-arc)" stroke-width="2.5" stroke-linecap="round" />
      <g v-for="dot in dots" :key="dot.key">
        <title>{{ dot.title }}</title>
        <circle :cx="dot.x" :cy="dot.y" r="3" fill="transparent" />
        <circle
          :cx="dot.x"
          :cy="dot.y"
          :r="dot.mine ? 1.6 : 1.1"
          :class="dot.mine ? 'fill-(--ui-secondary)' : 'fill-(--ui-primary)/70'"
        />
      </g>
      <g :transform="`translate(${day.x} ${day.y})`" aria-hidden="true">
        <circle r="4.5" class="bead fill-(--ui-bg)" />
        <circle r="1.8" class="fill-(--ui-secondary)" />
      </g>
    </svg>

    <!-- The core: today's pot and the time to the draw. -->
    <!-- scripts/og.ts swaps these for the draw's time on the share card, by their data-dial marks. -->
    <div class="absolute inset-[28%] flex flex-col items-center justify-center text-center">
      <p class="kicker text-[0.6rem]" data-dial-label>{{ t('dial.pot') }}</p>
      <USkeleton v-if="loading" class="mt-2 h-9 w-28 rounded-full" />
      <p v-else class="readout mt-1 text-[min(3.25rem,10cqw)] leading-none" data-dial-pot>◎{{ formatSol(pot, 3) }}</p>
      <p class="mt-1 font-mono text-[0.7rem] text-muted tabular-nums" data-dial-usd>
        {{ formatUsd(pot, price, intl) }}
      </p>
      <p
        class="mt-[6%] font-mono text-[min(1.25rem,4.2cqw)] leading-none text-secondary tabular-nums"
        data-dial-countdown
      >
        {{ countdown }}
      </p>
      <p class="kicker mt-1 text-[0.55rem]" data-dial-day>
        {{ t('dial.toDraw', { day: roundTitle(GameKind.Daily, period ?? 0) }) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* The bead on the track: a raised point of the surface, lit from inside. */
.bead {
  filter: drop-shadow(-1px -1px 1.5px var(--neu-hi)) drop-shadow(1px 1px 1.5px var(--neu-lo));
}
</style>
