<script setup lang="ts">
/** A labelled readout. When its value changes after the first load, it flashes, so live updates catch the eye. */
const props = defineProps<{ label: string; value: string | number }>();

const changes = ref(0);
// Values settling while the page loads are not news: only flash once it has been up a moment.
let readyAt = Infinity;
onMounted(() => (readyAt = Date.now() + 2_500));
watch(
  () => props.value,
  (next, previous) => {
    if (next !== previous && previous !== '—' && Date.now() > readyAt) changes.value++;
  },
);
</script>

<template>
  <div class="text-center">
    <p class="kicker text-[0.65rem]">{{ label }}</p>
    <p
      :key="changes"
      class="mt-1 font-mono text-lg font-semibold tabular-nums text-highlighted"
      :class="{ 'stat-flash': changes > 0 }"
    >
      {{ value }}
    </p>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .stat-flash {
    animation: stat-flash 0.9s var(--ease-out-expo);
  }
}

@keyframes stat-flash {
  from {
    color: var(--ui-secondary);
    scale: 1.18;
    text-shadow: 0 0 14px var(--ui-secondary);
  }
}
</style>
