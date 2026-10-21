<script setup lang="ts">
/**
 * Time until today's round closes, as three LED segments. It warms up in the
 * last hour and pulses in the last ten minutes. Screen readers get the time
 * in words, once a minute, rather than every second.
 */
const props = defineProps<{ ms: number; size?: 'md' | 'lg' }>();

const total = computed(() => Math.max(0, Math.floor(props.ms / 1000)));
const parts = computed(() => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    { label: 'h', value: pad(Math.floor(total.value / 3600)) },
    { label: 'm', value: pad(Math.floor((total.value % 3600) / 60)) },
    { label: 's', value: pad(total.value % 60) },
  ];
});
const mood = computed(() => (total.value < 600 ? 'final' : total.value < 3600 ? 'warm' : 'calm'));
const spoken = computed(() => {
  const h = Math.floor(total.value / 3600);
  const m = Math.floor((total.value % 3600) / 60);
  return `${h} hours ${m} minutes left`;
});
</script>

<template>
  <div class="countdown" :class="[`mood-${mood}`, props.size === 'lg' ? 'text-4xl' : 'text-2xl']">
    <span class="sr-only">{{ spoken }}</span>
    <template v-for="(part, i) in parts" :key="part.label">
      <span v-if="i" class="colon" aria-hidden="true">:</span>
      <span class="segment" aria-hidden="true">
        <span class="led font-mono font-semibold tabular-nums [--led-pitch:0.085em]">{{ part.value }}</span>
        <span class="unit">{{ part.label }}</span>
      </span>
    </template>
  </div>
</template>

<style scoped>
.countdown {
  --c: var(--ui-secondary);
  display: inline-flex;
  align-items: center;
  gap: 0.2em;
  line-height: 1;
}

.mood-warm {
  --c: var(--ui-warning);
}

.mood-final {
  --c: var(--ui-error);
  animation: pulse 1s ease-in-out infinite;
}

.segment {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.08em;
  padding: 0.18em 0.3em 0.14em;
  border-radius: 0.22em;
  color: var(--c);
  background: color-mix(in oklab, var(--ui-bg) 65%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 10%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--c) 25%, transparent),
    0 0 18px -6px color-mix(in oklab, var(--c) 70%, transparent);
  filter: drop-shadow(0 0 0.12em color-mix(in oklab, var(--c) 70%, transparent));
}

.unit {
  font-family: var(--font-mono);
  font-size: 0.36em;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.7;
}

.colon {
  color: var(--c);
  font-family: var(--font-mono);
  font-weight: 600;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0.2;
  }
}

@keyframes pulse {
  50% {
    filter: brightness(1.5);
  }
}
</style>
