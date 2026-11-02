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
  <LotterySurface hero>
    <div class="grid items-center gap-6 p-6 sm:gap-8 sm:p-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
      <!-- The game and its round. -->
      <div class="flex items-center justify-center gap-5 lg:justify-start">
        <span class="grid size-16 shrink-0 place-items-center rounded-full shadow-(--neu-in) sm:size-20">
          <LandingGameEmblem :kind="kind" size="size-10 sm:size-12" />
        </span>
        <div class="min-w-0">
          <p class="kicker truncate text-[0.65rem]">
            {{ period === null ? '…' : t('stage.round', { round: roundTitle(kind, period) }) }}
          </p>
          <h1 class="mt-1 text-2xl font-light tracking-tight text-highlighted sm:text-3xl">
            {{ t(`games.${slug}.name`) }}
          </h1>
          <p class="mt-1.5 hidden max-w-xs text-sm text-pretty text-muted sm:block">
            {{ t(`games.${slug}.description`) }}
          </p>
        </div>
        <LotteryNotifyButton class="shrink-0" />
      </div>

      <!-- The pot, in a window pressed into the panel; a chip floats off it each time it grows. -->
      <div class="text-center">
        <p class="kicker">{{ t('pot.title') }}</p>
        <div class="relative mx-auto mt-3 w-fit rounded-[1.75rem] px-7 py-4 shadow-(--neu-in) sm:px-9">
          <p class="readout text-5xl leading-none sm:text-6xl" dir="ltr">◎{{ formatSol(Math.round(potShown), 3) }}</p>
          <span v-for="g in gains" :key="g.id" class="gain font-mono text-sm text-secondary" aria-hidden="true">
            +◎{{ formatSol(g.amount, 3) }}
          </span>
        </div>
        <p class="mt-3 flex flex-wrap items-baseline justify-center gap-x-2 text-sm">
          <span class="font-mono text-toned tabular-nums">{{ formatUsd(pot, price, intl) }}</span>
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
          <div
            class="gauge mt-5 w-full max-w-64"
            :style="{ '--p': elapsed, '--c': 'var(--ui-secondary)' }"
            aria-hidden="true"
          >
            <i />
          </div>
        </template>
        <template v-else-if="!lottery">
          <p class="kicker">{{ t('stat.numbersLeft') }}</p>
          <p class="readout mt-2 font-mono text-4xl">{{ formatNumber(numbersLeft) }}</p>
          <div class="gauge mt-5 w-full max-w-64" :style="{ '--p': ruledOut }" aria-hidden="true"><i /></div>
          <p class="kicker mt-2.5 text-[0.6rem]">{{ t('guess.noDeadline') }}</p>
        </template>
      </div>
    </div>

    <!-- The table's counters, the split, and the last draw. -->
    <div
      class="mx-4 mb-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-[1.5rem] px-5 py-3 shadow-(--neu-in-sm) sm:mx-6 sm:mb-6 lg:justify-between"
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
        class="chip flex items-center gap-2.5 rounded-full py-1.5 ps-3.5 pe-2 text-sm"
      >
        <span class="led-dot animate-breathe text-warning" aria-hidden="true" />
        <span class="font-mono text-xs text-toned" dir="ltr">{{
          roundTitle(drawing.data.kind, drawing.data.period)
        }}</span>
        <span class="font-mono text-warning tabular-nums" dir="ltr">◎{{ formatSol(drawing.data.pot, 3) }}</span>
        <LotteryStatusBadge :status="drawing.data.status" :lottery="lottery" />
      </NuxtLink>
      <NuxtLink
        v-else-if="last"
        :to="localePath(roundPath(last.data.kind, last.data.period))"
        class="chip group flex items-center gap-2.5 rounded-full py-1.5 ps-4 pe-3 text-sm"
      >
        <span class="kicker text-[0.6rem]">{{ t('stage.lastDraw') }}</span>
        <span class="ball font-mono text-xs tabular-nums" dir="ltr">{{ formatNumber(last.data.winningNumber) }}</span>
        <span class="font-mono text-secondary tabular-nums" dir="ltr">◎{{ formatSol(last.data.payout, 3) }}</span>
        <span aria-hidden="true">{{ flagEmoji(countryFromBytes(last.data.winnerCountry)) }}</span>
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 text-muted transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        />
      </NuxtLink>
    </div>
  </LotterySurface>
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

.gain {
  position: absolute;
  inset-inline: 0;
  top: -0.75rem;
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

/* The last draw and the round being drawn: small keys standing out of the tray. */
.chip {
  background: var(--ui-bg);
  box-shadow: var(--neu-xs);
  transition: box-shadow 0.3s;
}

.chip:hover {
  box-shadow: var(--neu-in-sm);
}

/* The winning number, on a ball pressed into the key. */
.ball {
  padding: 0.15rem 0.55rem;
  border-radius: 9999px;
  color: var(--ui-text-highlighted);
  box-shadow: var(--neu-in-sm);
}
</style>
