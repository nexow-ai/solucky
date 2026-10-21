<script setup lang="ts">
/** The current time on the landing's day bar, from the cluster's clock. */
const now = useNow();
const progress = computed(() => dayProgress(now.value));
const time = computed(() => new Date(now.value).toISOString().slice(11, 16));
</script>

<template>
  <div class="absolute inset-y-0 w-px -translate-x-1/2 bg-secondary" :style="{ left: `${progress * 100}%` }">
    <span class="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-secondary glow-secondary" />
    <span
      class="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] font-semibold whitespace-nowrap text-secondary"
    >
      NOW {{ time }} UTC
    </span>
  </div>
</template>
