<script setup lang="ts">
import { countryFromBytes, flagEmoji, GameKind, isLottery, msUntilClose } from '@solucky/client';

/**
 * The live layer of a game's dial (`HeroDial`). A lottery's: the round so far
 * as an arc in the track, with a bead at the cluster's time; its tickets as
 * points, placed by the time they were bought (around) and their number
 * (outwards); and in the core, the pot and the time left to the draw.
 * Guess the number's: a sweep going round, the round's guesses placed by
 * their number (the checked ones dimmed, those waiting for a check lit), and
 * in the core, the pot and the numbers not tried yet. Browser only.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number }>();

const { t } = useI18n();
const intl = useIntlLocale();
const kind = computed(() => props.kind as GameKind);
const { period, tickets, pot, maxNumber, checked, numbersLeft, loading } = useLottery(kind);
const { address } = useWallet();
const price = useSolPrice();
const now = useNow();

const lottery = computed(() => isLottery(kind.value));
const TRACK = 74;

const day = computed(() => {
  const share = roundShare(kind.value, now.value);
  const end = dialPoint(dialAngle(share), TRACK);
  return { ...end, arc: `M 0 ${-TRACK} A ${TRACK} ${TRACK} 0 ${share > 0.5 ? 1 : 0} 1 ${end.x} ${end.y}` };
});

const dots = computed(() =>
  tickets.value.map((ticket) => {
    const { number, createdAt, owner, country, index } = ticket.data;
    const mine = owner === address.value;
    const title = `${formatNumber(number)} ${flagEmoji(countryFromBytes(country))} · ${formatUtcTime(createdAt)} UTC`;
    if (lottery.value) {
      const angle = dialAngle(roundShare(kind.value, Number(createdAt) * 1000));
      const radius = 56 + 12 * Math.min(1, number / Math.max(1, maxNumber.value));
      return { key: ticket.address, mine, waiting: true, title, ...dialPoint(angle, radius) };
    }
    // A guess sits at its number; the checked ones (misses) sink towards the core.
    const waiting = index >= checked.value;
    const angle = dialAngle(number / (maxNumber.value + 1));
    return { key: ticket.address, mine, waiting, title, ...dialPoint(angle, waiting ? 68 : 58) };
  }),
);

// The hourly lottery's clock has no hours to show.
const countdown = computed(() => {
  if (!isLottery(kind.value)) return '';
  const total = Math.max(0, Math.floor(msUntilClose(kind.value, period.value ?? 0, now.value) / 1000));
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  return (kind.value === GameKind.Hourly ? parts.slice(1) : parts).map((n) => String(n).padStart(2, '0')).join(':');
});

// The round under the clock: its day, or for the hourly lottery just its hour (`23:00 UTC`), so it fits the core.
const round = computed(() => {
  const title = roundTitle(kind.value, period.value ?? 0);
  return kind.value === GameKind.Hourly ? title.slice(11) : title;
});

const label = computed(() =>
  kind.value === GameKind.Daily
    ? t('dial.pot')
    : kind.value === GameKind.Hourly
      ? t('dial.potHour')
      : t('stat.todaysPot'),
);
const summary = computed(() => {
  const n = dots.value.length;
  return kind.value === GameKind.Daily
    ? t('dial.tickets', { n }, n)
    : kind.value === GameKind.Hourly
      ? t('dial.ticketsHour', { n }, n)
      : t('dial.guesses', { n }, n);
});
</script>

<template>
  <div class="absolute inset-0">
    <svg viewBox="-100 -100 200 200" class="absolute inset-0 size-full" role="img" :aria-label="summary">
      <defs>
        <linearGradient id="hero-dial-arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style="stop-color: var(--color-violet-400)" />
          <stop offset="1" style="stop-color: var(--color-fuchsia-500)" />
        </linearGradient>
        <linearGradient id="hero-dial-sweep" gradientUnits="userSpaceOnUse" x1="0" y1="-66" x2="-48" y2="-46">
          <stop offset="0" style="stop-color: var(--ui-primary); stop-opacity: 0.22" />
          <stop offset="1" style="stop-color: var(--ui-primary); stop-opacity: 0" />
        </linearGradient>
      </defs>
      <path
        v-if="lottery"
        :d="day.arc"
        fill="none"
        stroke="url(#hero-dial-arc)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Guess: the sweep, a wedge of the track going round clockwise, lit at its leading edge. -->
      <g v-else class="sweep" aria-hidden="true">
        <path
          d="M 0 -52 L 0 -80 A 80 80 0 0 0 -51.42 -61.28 L -33.42 -39.83 A 52 52 0 0 1 0 -52 Z"
          fill="url(#hero-dial-sweep)"
        />
        <line y1="-52" y2="-80" class="stroke-(--ui-primary)" stroke-width="1.2" stroke-linecap="round" />
      </g>
      <g v-for="dot in dots" :key="dot.key">
        <title>{{ dot.title }}</title>
        <circle :cx="dot.x" :cy="dot.y" r="3" fill="transparent" />
        <circle
          :cx="dot.x"
          :cy="dot.y"
          :r="dot.mine ? 1.6 : 1.1"
          :class="
            dot.mine ? 'fill-(--ui-secondary)' : dot.waiting ? 'fill-(--ui-primary)/70' : 'fill-(--ui-text-dimmed)/50'
          "
        />
      </g>
      <g v-if="lottery" :transform="`translate(${day.x} ${day.y})`" aria-hidden="true">
        <circle r="4.5" class="bead fill-(--ui-bg)" />
        <circle r="1.8" class="fill-(--ui-secondary)" />
      </g>
    </svg>

    <!-- The core: the pot, and the time to the draw or the numbers left to try. -->
    <!-- scripts/og.ts swaps these for what lasts (the draw's time, or Guess's open hunt) on the share cards, by their data-dial marks. -->
    <div class="absolute inset-[28%] flex flex-col items-center justify-center text-center">
      <p class="kicker text-[0.6rem]" data-dial-label>{{ label }}</p>
      <USkeleton v-if="loading" class="mt-2 h-9 w-28 rounded-full" />
      <p v-else class="readout mt-1 text-[min(3.25rem,10cqw)] leading-none" data-dial-pot>◎{{ formatSol(pot, 3) }}</p>
      <p class="mt-1 font-mono text-[0.7rem] text-muted tabular-nums" data-dial-usd>
        {{ formatUsd(pot, price, intl) }}
      </p>
      <template v-if="lottery">
        <p
          class="mt-[6%] font-mono text-[min(1.25rem,4.2cqw)] leading-none text-secondary tabular-nums"
          data-dial-countdown
        >
          {{ countdown }}
        </p>
        <p class="kicker mt-1 text-[0.55rem]" data-dial-day>
          {{ t('dial.toDraw', { day: round }) }}
        </p>
      </template>
      <template v-else>
        <p
          class="mt-[6%] font-mono text-[min(1.25rem,4.2cqw)] leading-none text-secondary tabular-nums"
          data-dial-countdown
        >
          {{ loading ? '…' : formatNumber(numbersLeft) }}
        </p>
        <p class="kicker mt-1 text-[0.55rem]" data-dial-day>{{ t('stat.numbersLeft') }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* The bead on the track: a raised point of the surface, lit from inside. */
.bead {
  filter: drop-shadow(-1px -1px 1.5px var(--neu-hi)) drop-shadow(1px 1px 1.5px var(--neu-lo));
}

/* The sweep turns once every six seconds. */
.sweep {
  animation: sweep 6s linear infinite;
}

@keyframes sweep {
  to {
    rotate: 360deg;
  }
}
</style>
