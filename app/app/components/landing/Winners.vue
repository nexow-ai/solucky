<script setup lang="ts">
/**
 * A game's winners wall: it reads the game's past rounds, so it only asks the
 * cluster once the visitor scrolls near it. Its height is held meanwhile.
 */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number }>();

const wall = useTemplateRef<HTMLElement>('wall');
const seen = useSeen(wall);
</script>

<template>
  <div ref="wall">
    <ClientOnly>
      <LandingWinnersLive v-if="seen" :kind="props.kind" />
      <div v-else class="min-h-80" />
      <template #fallback>
        <div class="min-h-80" />
      </template>
    </ClientOnly>
  </div>
</template>
