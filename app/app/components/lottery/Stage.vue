<script setup lang="ts">
import {
  countryFromBytes,
  flagEmoji,
  GAME_SLUGS,
  type LotteryKind,
  msUntilClose,
  periodEnd,
  periodStart,
} from '@solucky/client';

/**
 * The top of the play page, where the eye lands first: the game and its
 * round, the pot in lights (a chip floats off it each time it grows), the
 * clock to the close or, in Guess, the numbers still in the hunt, then the
 * table's counters and the last draw.
 */
const { t } = useI18n();
const intl = useIntlLocale();
const localePath = useLocalePath();
const {
  kind,
  lottery,
  period,
  pot,
  prize,
  carry,
  feeBps,
  tickets,
  players,
  countries,
  checked,
  unchecked,
  numbersLeft,
  maxNumber,
  settled,
  pending,
  loading,
} = useLottery();
const price = useSolPrice();
const now = useNow();

const slug = computed(() => GAME_SLUGS[kind.value]);
const left = computed(() =>
  lottery.value && period.value !== null ? msUntilClose(kind.value as LotteryKind, period.value, now.value) : 0,
);
/** How far the round on sale is through its day or hour, 0 to 1. */
const elapsed = computed(() => {
  if (!lottery.value || period.value === null) return 0;
  const start = periodStart(kind.value as LotteryKind, period.value).getTime();
  const end = periodEnd(kind.value as LotteryKind, period.value).getTime();
  return Math.min(1, Math.max(0, (now.value - start) / (end - start)));
});
/** Guess: the share of the numbers already ruled out. */
const ruledOut = computed(() => Math.min(1, checked.value / (maxNumber.value + 1)));
const fee = computed(() =>
  new Intl.NumberFormat(intl.value, { style: 'percent', maximumFractionDigits: 2 }).format(feeBps.value / 10_000),
);
const potShown = useTween(() => Number(pot.value), 1_600);
const last = computed(() => settled.value[0] ?? null);
/** The round that just ended, while it waits to be closed, drawn and paid: the reveal follows. */
const drawing = computed(() =>
  period.value === null ? null : (pending.value.find((r) => r.data.period === period.value! - 1) ?? null),
);

// When the pot grows, a chip with the difference floats off the counter.
const gains = ref<{ id: number; amount: bigint }[]>([]);
let gainId = 0;
watch(pot, (to, from) => {
  if (from === undefined || to <= from || loading.value) return;
  const id = gainId++;
  gains.value = [...gains.value, { id, amount: to - from }];
  setTimeout(() => (gains.value = gains.value.filter((g) => g.id !== id)), 2_400);
});
</script>

<template>
  <LotteryGlass hero class="stage">
    <div class="grid items-center gap-5 p-5 sm:gap-6 sm:p-7 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
      <!-- The game and its round. -->
      <div class="flex items-center justify-center gap-4 lg:justify-start">
        <span class="stage-emblem size-16 shrink-0 sm:size-20">
          <LandingGameEmblem :kind="kind" size="size-full" />
        </span>
        <div class="min-w-0">
          <p class="kicker truncate">
            {{ period === null ? '…' : t('stage.round', { round: roundTitle(kind, period) }) }}
          </p>
          <h1 class="mt-1 text-2xl font-semibold tracking-tight text-highlighted sm:text-3xl">
            {{ t(`games.${slug}.name`) }}
          </h1>
          <p class="mt-1.5 hidden max-w-xs text-sm text-pretty text-muted sm:block">
            {{ t(`games.${slug}.description`) }}
          </p>
        </div>
      </div>

      <!-- The pot, in a frame of marquee bulbs that chase faster for a moment whenever it grows. -->
      <div class="text-center">
        <p class="kicker">{{ t('pot.title') }}</p>
        <div class="jackpot relative mx-auto mt-3 w-fit px-6 py-3 sm:px-8" :class="{ hot: gains.length }">
          <svg class="bulbs" aria-hidden="true">
            <rect class="bulbs-dim" x="3" y="3" rx="18" pathLength="300" />
            <rect class="bulbs-lit" x="3" y="3" rx="18" pathLength="300" />
          </svg>
          <p
            class="text-lucky glow-primary led font-mono text-4xl font-semibold tabular-nums [--led-pitch:0.065em] sm:text-6xl"
            dir="ltr"
          >
            ◎{{ formatSol(Math.round(potShown), 3) }}
          </p>
          <span
            v-for="g in gains"
            :key="g.id"
            class="gain font-mono text-sm font-semibold text-secondary"
            aria-hidden="true"
          >
            +◎{{ formatSol(g.amount, 3) }}
          </span>
        </div>
        <p class="mt-3 flex flex-wrap items-baseline justify-center gap-x-2 text-sm">
          <span class="font-mono font-semibold text-toned tabular-nums">{{ formatUsd(pot, price, intl) }}</span>
          <span class="text-dimmed" aria-hidden="true">·</span>
          <span class="text-muted">{{ t('stage.winnerTakes', { prize: formatSol(prize, 3) }) }}</span>
        </p>
        <p v-if="carry > 0n" class="mt-1 text-xs text-muted">
          {{ t('pot.carried', { carry: formatSol(carry, 3) }) }}
        </p>
      </div>

      <!-- The clock to the close, or the hunt for the hidden number. -->
      <div class="flex flex-col items-center lg:items-end">
        <template v-if="lottery && period !== null">
          <p class="kicker">{{ t('stage.closesIn') }}</p>
          <div class="stage-clock mt-3"><LotteryCountdown :ms="left" size="lg" /></div>
          <div class="meter mt-4 w-full max-w-64" :style="{ '--p': elapsed }" aria-hidden="true"><i /></div>
        </template>
        <template v-else-if="!lottery">
          <p class="kicker">{{ t('stat.numbersLeft') }}</p>
          <p
            class="glow-secondary led mt-2 font-mono text-4xl font-semibold text-secondary tabular-nums [--led-pitch:0.075em]"
          >
            {{ formatNumber(numbersLeft) }}
          </p>
          <div class="meter hunt mt-4 w-full max-w-64" :style="{ '--p': ruledOut }" aria-hidden="true"><i /></div>
          <p class="kicker mt-2 text-[0.65rem]">{{ t('guess.noDeadline') }}</p>
        </template>
      </div>
    </div>

    <!-- The table's counters, the split, and the last draw. -->
    <div
      class="stage-foot flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-3 sm:px-7 lg:justify-between"
    >
      <div class="flex gap-6 sm:gap-8">
        <LotteryStat :label="t('stat.tickets')" :value="tickets.length" />
        <LotteryStat :label="t('stat.players')" :value="players" />
        <LotteryStat :label="t('stat.countries')" :value="countries" />
        <LotteryStat v-if="!lottery" :label="t('stat.waiting')" :value="formatNumber(unchecked)" />
      </div>
      <p class="hidden text-center text-xs text-muted xl:block">{{ t('pot.split', { fee }) }}</p>
      <NuxtLink
        v-if="drawing"
        :to="localePath(roundPath(drawing.data.kind, drawing.data.period))"
        class="drawing flex items-center gap-2.5 rounded-full py-1.5 ps-3 pe-2 text-sm"
      >
        <span class="pulse" aria-hidden="true" />
        <span class="font-mono text-xs text-toned" dir="ltr">{{
          roundTitle(drawing.data.kind, drawing.data.period)
        }}</span>
        <span class="font-mono font-semibold text-warning tabular-nums" dir="ltr"
          >◎{{ formatSol(drawing.data.pot, 3) }}</span
        >
        <LotteryStatusBadge :status="drawing.data.status" :lottery="lottery" />
      </NuxtLink>
      <NuxtLink
        v-else-if="last"
        :to="localePath(roundPath(last.data.kind, last.data.period))"
        class="last-draw group flex items-center gap-2.5 rounded-full py-1.5 ps-3.5 pe-2.5 text-sm"
      >
        <span class="kicker text-[0.65rem]">{{ t('stage.lastDraw') }}</span>
        <span class="ball font-mono text-xs font-semibold tabular-nums" dir="ltr">{{
          formatNumber(last.data.winningNumber)
        }}</span>
        <span class="font-mono font-semibold text-secondary tabular-nums" dir="ltr"
          >◎{{ formatSol(last.data.payout, 3) }}</span
        >
        <span aria-hidden="true">{{ flagEmoji(countryFromBytes(last.data.winnerCountry)) }}</span>
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 text-muted transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        />
      </NuxtLink>
    </div>
  </LotteryGlass>
</template>

<style scoped>
/* Phones get a smaller clock, so the pot and the buy button come up sooner. */
.stage-clock :deep(.countdown) {
  font-size: 1.75rem;
}

@media (min-width: 40rem) {
  .stage-clock :deep(.countdown) {
    font-size: 2.25rem;
  }
}

.stage-foot {
  border-top: 1px solid color-mix(in oklab, white 7%, transparent);
  background: color-mix(in oklab, black 14%, transparent);
}

:root:not(.dark) .stage-foot {
  border-top-color: color-mix(in oklab, var(--ui-primary) 12%, transparent);
  background: color-mix(in oklab, white 35%, transparent);
}

/* Marquee bulbs: a dim ring, and every third one lit, stepping round. */
.bulbs {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.bulbs rect {
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  fill: none;
  stroke-width: 4.5;
  stroke-linecap: round;
}

.bulbs-dim {
  stroke: color-mix(in oklab, var(--ui-warning) 22%, transparent);
  stroke-dasharray: 0 10;
}

.bulbs-lit {
  --bulb: var(--ui-warning);
  stroke: var(--bulb);
  stroke-dasharray: 0 30;
  filter: drop-shadow(0 0 3px var(--bulb)) drop-shadow(0 0 8px color-mix(in oklab, var(--bulb) 60%, transparent));
  animation: chase 1.2s steps(3) infinite;
  transition: stroke 0.3s;
}

.hot .bulbs-lit {
  --bulb: var(--ui-secondary);
  animation-duration: 0.36s;
}

@keyframes chase {
  to {
    stroke-dashoffset: -30;
  }
}

.gain {
  position: absolute;
  inset-inline: 0;
  top: -0.5rem;
  text-shadow: 0 0 12px var(--ui-secondary);
  animation: gain 2.4s ease-out forwards;
}

@keyframes gain {
  0% {
    opacity: 0;
    transform: translateY(0.75rem) scale(0.9);
  }
  15% {
    opacity: 1;
    transform: translateY(0) scale(1.05);
  }
  100% {
    opacity: 0;
    transform: translateY(-2.5rem) scale(1);
  }
}

/* A thin gauge: how far the round is through its time, or how much of the line the hunt has ruled out. */
.meter {
  --c: var(--ui-secondary);
  position: relative;
  height: 0.375rem;
  overflow: hidden;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--c) 14%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--c) 22%, transparent);
}

.meter > i {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  /* The hunt starts at a sliver: keep it visible. */
  width: max(0.375rem, calc(var(--p) * 100%));
  border-radius: inherit;
  background: linear-gradient(90deg, color-mix(in oklab, var(--c) 50%, transparent), var(--c));
  box-shadow: 0 0 12px var(--c);
  transition: width 1s linear;
}

.meter.hunt {
  --c: var(--ui-primary);
}

.last-draw {
  background: color-mix(in oklab, var(--ui-secondary) 8%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ui-secondary) 28%, transparent);
  transition:
    background 0.3s,
    box-shadow 0.3s;
}

.last-draw:hover {
  background: color-mix(in oklab, var(--ui-secondary) 14%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--ui-secondary) 45%, transparent),
    0 0 24px -8px var(--ui-secondary);
}

/* The round that just ended, waiting for its draw: a warm pill with a pulse. */
.drawing {
  background: color-mix(in oklab, var(--ui-warning) 8%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ui-warning) 30%, transparent);
}

.pulse {
  position: relative;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--ui-warning);
  box-shadow: 0 0 10px var(--ui-warning);
}

.pulse::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 1px solid var(--ui-warning);
  animation: pulse 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  to {
    transform: scale(2.4);
    opacity: 0;
  }
}

/* The winning number on a lottery ball. */
.ball {
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  color: var(--ui-bg);
  background: radial-gradient(circle at 35% 30%, white, var(--ui-color-secondary-300) 45%, var(--ui-secondary));
  box-shadow: 0 0 14px -2px var(--ui-secondary);
}
</style>
