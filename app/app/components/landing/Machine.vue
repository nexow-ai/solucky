<script setup lang="ts">
import { GAME_SLUGS } from '@solucky/client';

/**
 * A game on the landing, printed as a ticket: a stub with its sign and name,
 * a perforation, and the live round under it. The ticket leans towards the
 * pointer and a foil sheen follows it. The game's data only loads once the
 * ticket nears the screen, so the landing asks the cluster for what is seen.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number; big?: boolean }>();

const { t } = useI18n();
const localePath = useLocalePath();
const slug = computed(() => GAME_SLUGS[props.kind] ?? 'daily');

const card = useTemplateRef<HTMLElement>('card');
useTilt(card);
// The tickets come into view together; their games start loading a moment apart, so the
// RPC endpoint gets no burst (the daily lottery's state is already loaded by the dial).
const near = useSeen(card);
const seen = ref(false);
let wait: ReturnType<typeof setTimeout> | undefined;
watch(near, (yes) => {
  if (yes) wait = setTimeout(() => (seen.value = true), props.kind * 1500);
});
onBeforeUnmount(() => clearTimeout(wait));
</script>

<template>
  <div ref="card" class="machine group relative h-full">
    <NuxtLink
      :to="localePath(playPath(slug))"
      class="flex h-full flex-col rounded-[1.25rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div class="stub flex items-center gap-4 rounded-t-[1.25rem] px-5 pt-5 pb-4 sm:px-6">
        <LandingGameEmblem :kind="props.kind" :size="props.big ? 'size-14' : 'size-11'" />
        <div class="min-w-0 flex-1">
          <h3
            class="font-semibold text-balance text-highlighted"
            :class="props.big ? 'text-2xl tracking-tight' : 'text-lg'"
          >
            {{ t(`games.${slug}.name`) }}
          </h3>
          <p class="mt-0.5 text-sm text-pretty text-muted">{{ t(`games.${slug}.description`) }}</p>
        </div>
      </div>
      <div class="body relative flex flex-1 flex-col gap-5 rounded-b-[1.25rem] px-5 pt-5 pb-5 sm:px-6">
        <span aria-hidden="true" class="absolute inset-x-5 top-0 border-t-2 border-dashed border-accented" />
        <ClientOnly>
          <LandingMachineLive v-if="seen" :kind="props.kind" :big="props.big" />
          <div v-else class="flex-1" :class="props.big ? 'min-h-56' : 'min-h-40'" />
          <template #fallback>
            <div class="flex-1" :class="props.big ? 'min-h-56' : 'min-h-40'" />
          </template>
        </ClientOnly>
        <span
          class="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1.5 font-mono text-xs font-semibold tracking-widest text-primary uppercase ring ring-primary/30 transition-colors group-hover:bg-primary group-hover:text-inverted"
        >
          {{ t('games.play') }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </span>
      </div>
    </NuxtLink>
    <span class="foil" aria-hidden="true" />
  </div>
</template>

<style scoped>
.machine {
  --notch: 0.7rem;
  transform: perspective(1000px) rotateX(calc(var(--tilt-y, 0) * -4deg)) rotateY(calc(var(--tilt-x, 0) * 5deg));
  transition:
    transform 0.6s var(--ease-out-expo),
    translate 0.4s var(--ease-out-expo);
}

.machine[data-tilting] {
  transition-duration: 0.25s, 0.4s;
}

.machine:hover {
  translate: 0 -0.25rem;
}

/* The two halves of the ticket, each cut by half of the notches where they meet. */
.stub,
.body {
  background: color-mix(in oklab, var(--ui-bg) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.3);
  box-shadow: inset 0 0 0 1px var(--ui-border);
  transition: box-shadow 0.4s ease;
}

.stub {
  mask:
    radial-gradient(circle at 0 100%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) left / 51% 100%
      no-repeat,
    radial-gradient(circle at 100% 100%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) right / 51% 100%
      no-repeat;
}

.body {
  mask:
    radial-gradient(circle at 0 0, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) left / 51% 100% no-repeat,
    radial-gradient(circle at 100% 0, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) right / 51% 100%
      no-repeat;
}

.machine:hover .stub,
.machine:hover .body {
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--ui-primary) 55%, transparent),
    inset 0 -40px 60px -50px var(--ui-primary);
}

/* Foil: a rainbow sheen that follows the pointer while it is over the ticket. */
.foil {
  position: absolute;
  inset: 0;
  border-radius: 1.25rem;
  background:
    radial-gradient(
      420px circle at var(--glare-x, 50%) var(--glare-y, 50%),
      color-mix(in oklab, white 10%, transparent),
      transparent 45%
    ),
    conic-gradient(
      from calc(var(--tilt-x, 0) * 90deg) at var(--glare-x, 50%) var(--glare-y, 50%),
      color-mix(in oklab, var(--ui-primary) 18%, transparent),
      color-mix(in oklab, var(--ui-secondary) 14%, transparent),
      color-mix(in oklab, var(--color-pink-500) 16%, transparent),
      color-mix(in oklab, var(--ui-primary) 18%, transparent)
    );
  mix-blend-mode: plus-lighter;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

:root:not(.dark) .foil {
  mix-blend-mode: multiply;
}

.machine[data-tilting] .foil {
  opacity: 0.8;
}
</style>
