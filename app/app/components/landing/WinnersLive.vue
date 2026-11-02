<script setup lang="ts">
import { countryFromBytes, flagEmoji, GAME_SLUGS, type GameKind, isLottery } from '@solucky/client';

/**
 * A game's latest settled rounds, newest draw first, as a departure board,
 * with what the game has paid so far. Browser only.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number }>();

const { t } = useI18n();
const localePath = useLocalePath();
const intl = useIntlLocale();
const price = useSolPrice();

const kind = computed(() => props.kind as GameKind);
const { loading, settled } = useLottery(kind);
const wins = computed(() => latestWins([{ kind: kind.value, rounds: settled.value }]));
const totals = computed(() => winTotals(settled.value));
</script>

<template>
  <div class="space-y-8">
    <dl class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="rounded-3xl p-5 shadow-(--neu-in-sm)">
        <dt class="kicker text-[0.6rem]">{{ t('home.winners.paid') }}</dt>
        <dd class="readout mt-2 text-3xl" dir="ltr">◎{{ formatSol(totals.paid, 3) }}</dd>
        <dd class="font-mono text-xs text-muted">{{ formatUsd(totals.paid, price, intl) }}</dd>
      </div>
      <div class="rounded-3xl p-5 shadow-(--neu-in-sm)">
        <dt class="kicker text-[0.6rem]">{{ t('home.winners.rounds') }}</dt>
        <dd class="readout mt-2 text-3xl">{{ formatNumber(totals.rounds) }}</dd>
      </div>
      <div class="rounded-3xl p-5 shadow-(--neu-in-sm)">
        <dt class="kicker text-[0.6rem]">{{ t('stat.winners') }}</dt>
        <dd class="readout mt-2 text-3xl">{{ formatNumber(totals.winners) }}</dd>
      </div>
      <div class="rounded-3xl p-5 shadow-(--neu-in-sm)">
        <dt class="kicker text-[0.6rem]">{{ t('stat.countries') }}</dt>
        <dd class="readout mt-2 text-3xl">{{ formatNumber(totals.countries) }}</dd>
      </div>
    </dl>

    <div v-if="loading && !wins.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="i in 6" :key="i" class="h-32 rounded-3xl" />
    </div>
    <p v-else-if="!wins.length" class="rounded-3xl px-6 py-10 text-center text-muted shadow-(--neu-in-sm)">
      {{ t('home.winners.empty') }}
    </p>
    <ol v-else class="reveal-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(win, i) in wins" :key="win.round.address" :style="{ '--i': i % 3 }">
        <NuxtLink
          :to="localePath(roundPath(win.kind, win.round.data.period))"
          class="group flex h-full flex-col gap-4 rounded-3xl bg-default p-5 shadow-(--neu-sm) transition-shadow duration-300 hover:shadow-(--neu-xs) active:shadow-(--neu-in-sm)"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="inline-flex min-w-0 items-center gap-2">
              <LandingGameEmblem :kind="win.kind" size="size-5" />
              <span class="kicker truncate text-[0.6rem]">{{
                t(`games.${GAME_SLUGS[win.kind as GameKind]}.short`)
              }}</span>
            </span>
            <span class="font-mono text-[0.65rem] text-dimmed" dir="ltr">{{
              roundTitle(win.kind, win.round.data.period)
            }}</span>
          </div>
          <div class="flex items-end justify-between gap-3">
            <span class="flex items-center gap-2">
              <span class="text-2xl leading-none">{{ flagEmoji(countryFromBytes(win.round.data.winnerCountry)) }}</span>
              <span class="readout font-mono text-2xl leading-none" dir="ltr">{{
                formatNumber(win.round.data.winningNumber)
              }}</span>
            </span>
            <span class="text-end">
              <span class="block font-mono text-sm text-secondary tabular-nums" dir="ltr">
                ◎{{ formatSol(win.round.data.payout, 4) }}
              </span>
              <span class="block font-mono text-[0.65rem] text-muted">{{
                formatUsd(win.round.data.payout, price, intl)
              }}</span>
            </span>
          </div>
          <p class="mt-auto flex items-center justify-between gap-3 font-mono text-[0.65rem] text-muted">
            <span>
              <template v-if="isLottery(win.kind)">{{
                t('home.winners.drawn', { number: formatNumber(win.round.data.drawnNumber) })
              }}</template>
              <template v-else>{{ t('home.winners.found') }}</template>
            </span>
            <span dir="ltr">{{ shortAddress(win.round.data.winner) }}</span>
          </p>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>
