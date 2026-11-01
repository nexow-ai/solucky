<script setup lang="ts">
/**
 * Time until today's round closes, as three cells pressed into the panel
 * whose digits roll like an odometer as they change. It warms up in the last
 * hour and pulses in the last ten minutes. Screen readers get the time in words, once a minute,
 * rather than every second.
 */
const props = defineProps<{ ms: number; size?: 'md' | 'lg' }>();
const { t } = useI18n();
const intl = useIntlLocale();

const total = computed(() => Math.max(0, Math.floor(props.ms / 1000)));
const parts = computed(() => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    { key: 'h', label: t('countdown.h'), value: pad(Math.floor(total.value / 3600)) },
    { key: 'm', label: t('countdown.m'), value: pad(Math.floor((total.value % 3600) / 60)) },
    { key: 's', label: t('countdown.s'), value: pad(total.value % 60) },
  ];
});
const mood = computed(() => (total.value < 600 ? 'final' : total.value < 3600 ? 'warm' : 'calm'));
const spoken = computed(() => {
  const h = Math.floor(total.value / 3600);
  const m = Math.floor((total.value % 3600) / 60);
  const time = `${formatUnit(h, 'hour', intl.value, 'long')} ${formatUnit(m, 'minute', intl.value, 'long')}`;
  return t('countdown.left', { time });
});
</script>

<template>
  <!-- Hours, minutes, seconds: read left to right in every language. -->
  <div class="countdown" :class="[`mood-${mood}`, props.size === 'lg' ? 'text-4xl' : 'text-2xl']" dir="ltr">
    <span class="sr-only">{{ spoken }}</span>
    <template v-for="(part, i) in parts" :key="part.key">
      <span v-if="i" class="colon" aria-hidden="true">:</span>
      <span class="segment" aria-hidden="true">
        <span class="digits font-mono tabular-nums">
          <span v-for="(digit, d) in part.value" :key="d" class="digit">
            <Transition name="roll">
              <span :key="digit">{{ digit }}</span>
            </Transition>
          </span>
        </span>
        <span class="unit">{{ part.label }}</span>
      </span>
    </template>
  </div>
</template>

<style scoped>
.countdown {
  --c: var(--ui-text-highlighted);
  display: inline-flex;
  align-items: center;
  gap: 0.18em;
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
  gap: 0.1em;
  padding: 0.22em 0.32em 0.18em;
  border-radius: 0.3em;
  color: var(--c);
  box-shadow: var(--neu-in-sm);
}

/* Each digit sits in its own window: the old one rolls up and out as the new one rolls in from below. */
.digits {
  display: inline-flex;
  font-weight: 400;
}

.digit {
  position: relative;
  display: inline-grid;
  overflow: hidden;
  height: 1.1em;
  line-height: 1.1em;
}

.digit > * {
  grid-area: 1 / 1;
}

.roll-enter-active,
.roll-leave-active {
  transition:
    transform 0.45s var(--ease-out-expo),
    opacity 0.45s ease;
}

.roll-enter-from {
  transform: translateY(70%);
  opacity: 0;
}

.roll-leave-to {
  transform: translateY(-70%);
  opacity: 0;
}

.unit {
  font-family: var(--font-mono);
  font-size: 0.34em;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.colon {
  color: var(--ui-text-dimmed);
  font-family: var(--font-mono);
  font-weight: 300;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0.25;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.6;
  }
}
</style>
