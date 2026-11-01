<script setup lang="ts">
/**
 * The winners wall: it reads every game's past rounds, so it only asks the
 * cluster once the visitor scrolls near it. Its height is held meanwhile.
 */
const wall = useTemplateRef<HTMLElement>('wall');
const seen = useSeen(wall);
</script>

<template>
  <div ref="wall">
    <ClientOnly>
      <LandingWinnersLive v-if="seen" />
      <div v-else class="min-h-80" />
      <template #fallback>
        <div class="min-h-80" />
      </template>
    </ClientOnly>
  </div>
</template>
