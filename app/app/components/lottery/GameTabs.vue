<script setup lang="ts">
import { GAME_SLUGS, type GameKind, isLottery, msUntilClose, periodOf } from '@solucky/client';

/**
 * The play page's game switcher: each game with its animated sign, its pot
 * and the time to its close, so the other tables are one glance away. The
 * current game's pill carries a view-transition name and glides to the next
 * game on a switch.
 */
const { t } = useI18n();
const localePath = useLocalePath();
const game = useGame();
const { pot } = useLottery();
const pots = useGamePots();
const now = useNow();

const pad = (n: number) => String(n).padStart(2, '0');
function clock(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const tail = `${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  return h ? `${h}:${tail}` : tail;
}

const games = computed(() =>
  GAME_SLUGS.map((slug, i) => {
    const kind = i as GameKind;
    // The page's game has a live pot; the others refresh once a minute.
    const amount = kind === game.value ? pot.value : (pots.value[kind] ?? null);
    const left = isLottery(kind) ? msUntilClose(kind, periodOf(kind, now.value), now.value) : null;
    return { slug, kind, pot: amount, clock: left === null ? null : clock(left), current: kind === game.value };
  }),
);
</script>

<template>
  <LotteryGlass as="nav" rounded="rounded-[1.4rem]" :aria-label="t('games.tag')" class="w-full max-w-2xl">
    <div class="grid grid-cols-3 gap-1 p-1">
      <NuxtLink
        v-for="g in games"
        :key="g.slug"
        :to="localePath(playPath(g.slug))"
        :aria-current="g.current ? 'page' : undefined"
        class="tab group relative flex items-center justify-center gap-2.5 rounded-[1.1rem] px-2 py-2 sm:justify-start sm:px-3.5"
        :class="g.current ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
      >
        <span v-if="g.current" class="game-pill" aria-hidden="true" />
        <span class="tab-emblem relative hidden size-9 shrink-0 sm:block" :class="{ dim: !g.current }">
          <LandingGameEmblem :kind="g.kind" />
        </span>
        <span class="relative min-w-0 text-center sm:text-start">
          <span class="block truncate text-sm font-semibold">{{ t(`games.${g.slug}.short`) }}</span>
          <span class="block truncate font-mono text-[0.7rem] text-muted tabular-nums" aria-hidden="true" dir="ltr">
            <span :class="{ 'text-lucky font-semibold': g.current }"
              >◎{{ g.pot === null ? '…' : formatSol(g.pot, 2) }}</span
            >
            <template v-if="g.clock"> · {{ g.clock }}</template>
          </span>
        </span>
      </NuxtLink>
    </div>
  </LotteryGlass>
</template>

<style scoped>
.tab {
  transition: color 0.3s;
}

.tab:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

/* The sign fills its box; the other games' signs rest dimmer until hovered. */
.tab-emblem :deep(svg) {
  width: 100%;
  height: 100%;
}

.tab-emblem {
  transition:
    opacity 0.4s,
    filter 0.4s;
}

.tab-emblem.dim {
  opacity: 0.55;
  filter: saturate(0.6);
}

.tab:hover .tab-emblem.dim {
  opacity: 1;
  filter: none;
}

/* The current game's pill. It carries a view-transition name, so it glides to the next game on a switch. */
.game-pill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  view-transition-name: game-pill;
  background:
    linear-gradient(180deg, color-mix(in oklab, white 16%, transparent), transparent 60%),
    linear-gradient(
      120deg,
      color-mix(in oklab, var(--ui-primary) 40%, transparent),
      color-mix(in oklab, var(--color-pink-600) 30%, transparent)
    );
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 35%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-primary) 55%, transparent),
    0 0 24px -6px var(--ui-primary);
}

:root:not(.dark) .game-pill {
  background:
    linear-gradient(180deg, color-mix(in oklab, white 70%, transparent), transparent 70%),
    linear-gradient(
      120deg,
      color-mix(in oklab, var(--ui-primary) 22%, transparent),
      color-mix(in oklab, var(--color-pink-600) 16%, transparent)
    );
}
</style>
