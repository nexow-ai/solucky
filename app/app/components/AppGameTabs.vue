<script setup lang="ts">
import { GAME_SLUGS, type GameKind } from '@solucky/client';

/**
 * The games, in the header: each one's mark and name, with its pot and the
 * time to its draw (`AppGameTabsLive`). They switch the page between the
 * games: on a game's own page to the others' pages, at a table or a round
 * to the others' tables, and anywhere else to the games' pages. The page's
 * game stands out of the track; its pill carries a view-transition name, so
 * it glides to the next game on a switch. `wide` fills the row the tabs get
 * under the bar on narrower screens.
 */
const props = defineProps<{ wide?: boolean }>();

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const game = useGame();
const section = usePageSection();

const games = computed(() =>
  GAME_SLUGS.map((slug, i) => {
    const kind = i as GameKind;
    const to = localePath(section.value === 'play' ? playPath(slug) : homePath(slug));
    const current = section.value !== null && kind === game.value;
    // A round's page is part of its game without being the page the tab leads to.
    const here: 'page' | 'true' | undefined = current ? (route.path === to ? 'page' : 'true') : undefined;
    return { slug, kind, to, current, here };
  }),
);
</script>

<template>
  <nav
    :aria-label="t('games.tag')"
    class="rounded-full p-1 shadow-(--neu-in-sm)"
    :class="props.wide ? 'w-full' : 'w-max'"
  >
    <ul class="grid grid-cols-3 gap-1">
      <li v-for="g in games" :key="g.slug" class="min-w-0">
        <NuxtLink
          :to="g.to"
          :aria-current="g.here"
          class="tab relative flex items-center justify-center gap-2 rounded-full py-1 ps-2 pe-3 sm:gap-2.5 sm:ps-2.5 sm:pe-4"
          :class="g.current ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
        >
          <span v-if="g.current" class="game-pill" aria-hidden="true" />
          <span class="tab-emblem relative size-6 shrink-0" :class="{ dim: !g.current }">
            <LandingGameEmblem :kind="g.kind" size="size-full" />
          </span>
          <span class="relative min-w-0 text-start leading-tight">
            <span class="block truncate text-[0.8rem] font-medium">{{ t(`games.${g.slug}.short`) }}</span>
            <ClientOnly>
              <LazyAppGameTabsLive :key="`${g.kind}:${g.current}`" :kind="g.kind" :live="g.current" />
              <template #fallback>
                <span class="block font-mono text-[0.65rem] text-muted" aria-hidden="true">◎…</span>
              </template>
            </ClientOnly>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.tab {
  transition: color 0.3s;
}

.tab:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

/* The other games' marks rest dimmer until hovered. */
.tab-emblem {
  transition: opacity 0.4s;
}

.tab-emblem.dim {
  opacity: 0.5;
}

.tab:hover .tab-emblem.dim {
  opacity: 1;
}

/* The page's game stands out of the track. It carries a view-transition name, so it glides to the next game on a switch. */
.game-pill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  view-transition-name: game-pill;
  background: var(--ui-bg);
  box-shadow: var(--neu-xs);
}
</style>
