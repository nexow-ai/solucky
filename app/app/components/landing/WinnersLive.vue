<script setup lang="ts">
import { countryFromBytes, flagEmoji, GAME_SLUGS, GameKind, isLottery } from '@solucky/client';

/**
 * The latest settled rounds of the three games, newest draw first, as a
 * departure board, with what every game has paid so far. Browser only.
 */
const { t } = useI18n();
const localePath = useLocalePath();
const intl = useIntlLocale();
const price = useSolPrice();

const games = [GameKind.Daily, GameKind.Hourly, GameKind.Guess].map((kind) => ({ kind, state: useLottery(kind) }));
const loading = computed(() => games.some(({ state }) => state.loading.value));
const all = computed(() => games.flatMap(({ state }) => state.settled.value));
const wins = computed(() => latestWins(games.map(({ kind, state }) => ({ kind, rounds: state.settled.value }))));
const totals = computed(() => winTotals(all.value));
</script>

<template>
  <div class="space-y-8">
    <dl
      class="grid grid-cols-2 gap-px overflow-hidden rounded-(--ui-radius) bg-(--ui-border) ring ring-default lg:grid-cols-4"
    >
      <div class="bg-default/85 p-5 backdrop-blur-md">
        <dt class="kicker text-[0.6rem]">{{ t('home.winners.paid') }}</dt>
        <dd
          class="led mt-2 font-mono text-3xl font-extrabold text-highlighted tabular-nums [--led-pitch:0.1em]"
          dir="ltr"
        >
          ◎{{ formatSol(totals.paid, 3) }}
        </dd>
        <dd class="font-mono text-xs text-muted">{{ formatUsd(totals.paid, price, intl) }}</dd>
      </div>
      <div class="bg-default/85 p-5 backdrop-blur-md">
        <dt class="kicker text-[0.6rem]">{{ t('home.winners.rounds') }}</dt>
        <dd class="led mt-2 font-mono text-3xl font-extrabold text-highlighted tabular-nums [--led-pitch:0.1em]">
          {{ formatNumber(totals.rounds) }}
        </dd>
      </div>
      <div class="bg-default/85 p-5 backdrop-blur-md">
        <dt class="kicker text-[0.6rem]">{{ t('stat.winners') }}</dt>
        <dd class="led mt-2 font-mono text-3xl font-extrabold text-highlighted tabular-nums [--led-pitch:0.1em]">
          {{ formatNumber(totals.winners) }}
        </dd>
      </div>
      <div class="bg-default/85 p-5 backdrop-blur-md">
        <dt class="kicker text-[0.6rem]">{{ t('stat.countries') }}</dt>
        <dd class="led mt-2 font-mono text-3xl font-extrabold text-highlighted tabular-nums [--led-pitch:0.1em]">
          {{ formatNumber(totals.countries) }}
        </dd>
      </div>
    </dl>

    <div v-if="loading && !wins.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="i in 6" :key="i" class="h-28" />
    </div>
    <p
      v-else-if="!wins.length"
      class="rounded-(--ui-radius) bg-default/80 px-6 py-10 text-center text-muted ring ring-default backdrop-blur-md"
    >
      {{ t('home.winners.empty') }}
    </p>
    <ol v-else class="reveal-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(win, i) in wins" :key="win.round.address" :style="{ '--i': i % 3 }">
        <NuxtLink
          :to="localePath(roundPath(win.kind, win.round.data.period))"
          class="win group flex h-full flex-col gap-3 rounded-(--ui-radius) bg-default/85 p-4 ring ring-default backdrop-blur-md transition hover:-translate-y-0.5 hover:ring-primary/50"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="inline-flex min-w-0 items-center gap-2">
              <LandingGameEmblem :kind="win.kind" size="size-6" />
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
              <span
                class="led font-mono text-2xl leading-none font-extrabold text-secondary tabular-nums [--led-pitch:0.1em]"
                dir="ltr"
                >{{ formatNumber(win.round.data.winningNumber) }}</span
              >
            </span>
            <span class="text-end">
              <span class="block font-mono text-sm font-semibold text-highlighted tabular-nums" dir="ltr">
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
