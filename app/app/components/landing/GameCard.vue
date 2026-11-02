<script setup lang="ts">
import { GAME_SLUGS } from '@solucky/client';

/**
 * Another game, on a game's page: a card standing out of the page with its
 * mark in a well, its name and rules, and a readout of its round right now.
 * It leads to that game's own page. It sinks a little under the pointer and
 * presses in when clicked, like a key.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number }>();

const { t } = useI18n();
const localePath = useLocalePath();
const slug = computed(() => GAME_SLUGS[props.kind] ?? 'daily');
</script>

<template>
  <NuxtLink
    :to="localePath(homePath(slug))"
    class="group flex h-full flex-col rounded-[2rem] bg-default p-6 shadow-(--neu) transition-shadow duration-300 hover:shadow-(--neu-sm) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:shadow-(--neu-in-sm) sm:p-7"
  >
    <div class="flex items-center gap-4">
      <span class="grid size-16 shrink-0 place-items-center rounded-full shadow-(--neu-in-sm)">
        <LandingGameEmblem :kind="props.kind" size="size-9" />
      </span>
      <h3 class="text-xl font-medium tracking-tight text-highlighted">{{ t(`games.${slug}.name`) }}</h3>
    </div>
    <p class="mt-5 text-sm text-pretty text-muted">{{ t(`games.${slug}.description`) }}</p>
    <div class="mt-auto pt-6">
      <div class="min-h-[4.75rem] rounded-2xl px-4 py-3 shadow-(--neu-in-sm)">
        <ClientOnly>
          <LazyLandingGameCardLive :kind="props.kind" />
        </ClientOnly>
      </div>
      <span
        class="mt-5 inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.18em] text-primary uppercase"
      >
        {{ t('games.discover') }}
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
        />
      </span>
    </div>
  </NuxtLink>
</template>
