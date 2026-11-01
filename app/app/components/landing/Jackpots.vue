<script setup lang="ts">
import { GAME_SLUGS, GameKind, isLottery, msUntilClose, periodOf } from '@solucky/client';

/**
 * The hero's jackpot board: each game's pot right now and the time to its
 * draw, on one row each, linking to its table. Browser only (the pots and the
 * clock come from the cluster); `index.vue` holds its height meanwhile.
 */
const { t } = useI18n();
const localePath = useLocalePath();
const intl = useIntlLocale();
const price = useSolPrice();
const now = useNow();
// The other games' pots, once a minute in one light call; the daily lottery's is live (the dial loads it anyway).
const pots = useGamePots();
const daily = useLottery(GameKind.Daily);

const rows = computed(() =>
  GAME_SLUGS.map((slug, kind) => {
    const pot = kind === GameKind.Daily && !daily.loading.value ? daily.pot.value : (pots.value[kind] ?? null);
    const left = isLottery(kind) ? msUntilClose(kind, periodOf(kind, now.value), now.value) : null;
    return { slug, kind, pot, clock: left === null ? null : clock(left) };
  }),
);

function clock(ms: number) {
  const total = Math.floor(ms / 1000);
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}
</script>

<template>
  <div class="board overflow-hidden rounded-(--ui-radius) bg-default/80 ring ring-default backdrop-blur-md">
    <p class="kicker flex items-center gap-2 border-b border-default px-4 py-2 text-[0.65rem]">
      <span class="size-1.5 animate-blink rounded-full bg-secondary" />
      {{ t('home.live.title') }}
    </p>
    <ul class="divide-y divide-default">
      <li v-for="row in rows" :key="row.slug">
        <NuxtLink
          :to="localePath(playPath(row.slug))"
          class="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-elevated/70 focus-visible:bg-elevated/70 focus-visible:outline-none"
        >
          <LandingGameEmblem :kind="row.kind" size="size-9" />
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-highlighted group-hover:text-primary">
              {{ t(`games.${row.slug}.name`) }}
            </span>
            <span class="block font-mono text-[0.7rem] text-muted tabular-nums">
              <template v-if="row.clock">
                {{ t('home.live.drawIn') }} <span dir="ltr" class="text-toned">{{ row.clock }}</span>
              </template>
              <template v-else>{{ t('home.live.noDeadline') }}</template>
            </span>
          </span>
          <span class="text-end">
            <span
              v-if="row.pot === null"
              class="inline-block h-6 w-20 animate-pulse rounded bg-elevated align-middle"
              aria-hidden="true"
            />
            <span
              v-else
              class="led block font-mono text-xl leading-tight font-extrabold text-highlighted tabular-nums [--led-pitch:0.1em]"
              dir="ltr"
              >◎{{ formatSol(row.pot, 3) }}</span
            >
            <span class="block font-mono text-[0.65rem] text-muted">
              {{ row.pot === null ? '' : formatUsd(row.pot, price, intl) }}
            </span>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
