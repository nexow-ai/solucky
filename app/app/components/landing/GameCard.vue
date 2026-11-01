<script setup lang="ts">
import { GAME_SLUGS } from '@solucky/client';

/**
 * A game on the landing page: its animated sign, name and rules, and a link to
 * its table. The card leans towards the pointer and a glare follows it, like a
 * foil ticket under a lamp.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number }>();

const { t } = useI18n();
const localePath = useLocalePath();
const slug = computed(() => GAME_SLUGS[props.kind] ?? 'daily');

const card = useTemplateRef<HTMLElement>('card');
useTilt(card);
</script>

<template>
  <div ref="card" class="game-card h-full">
    <UPageCard
      :title="t(`games.${slug}.name`)"
      :description="t(`games.${slug}.description`)"
      :to="localePath(playPath(slug))"
      spotlight
      class="group h-full"
      :ui="{ footer: 'pt-4' }"
    >
      <template #leading>
        <LandingGameEmblem :kind="props.kind" />
      </template>
      <template #footer>
        <span
          class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-widest text-primary uppercase"
        >
          {{ t('games.play') }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </span>
      </template>
    </UPageCard>
    <span class="glare" aria-hidden="true" />
  </div>
</template>

<style scoped>
.game-card {
  position: relative;
  transform: perspective(900px) rotateX(calc(var(--tilt-y, 0) * -5deg)) rotateY(calc(var(--tilt-x, 0) * 6deg));
  transition: transform 0.6s var(--ease-out-expo);
  transform-style: preserve-3d;
}

.game-card[data-tilting] {
  transition-duration: 0.25s;
}

.glare {
  position: absolute;
  inset: 0;
  border-radius: var(--ui-radius);
  background: radial-gradient(
    380px circle at var(--glare-x, 50%) var(--glare-y, 50%),
    color-mix(in oklab, white 9%, transparent),
    transparent 45%
  );
  mix-blend-mode: plus-lighter;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.game-card[data-tilting] .glare {
  opacity: 1;
}
</style>
