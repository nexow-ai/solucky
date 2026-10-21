<script setup lang="ts">
/**
 * The number on the play panel as slot-machine reels: each digit rolls to its
 * new value, and while `spinning` every reel runs, then stops one after the
 * other. Decorative: the panel announces the number in text.
 */
const props = defineProps<{ value: number; spinning?: boolean; invalid?: boolean }>();

const cells = computed(() =>
  formatNumber(props.value)
    .split('')
    .map((char, i) => (char === ' ' ? { gap: true as const, key: `g${i}` } : { gap: false as const, digit: Number(char), key: `d${i}` })),
);
const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
</script>

<template>
  <div class="reels" :class="{ spinning: props.spinning, invalid: props.invalid }" aria-hidden="true">
    <template v-for="(cell, i) in cells" :key="cell.key">
      <span v-if="cell.gap" class="gap" />
      <span v-else class="reel" :style="{ '--d': cell.digit, '--i': i }">
        <span class="strip led font-mono font-semibold">
          <span v-for="(n, k) in STRIP" :key="k">{{ n }}</span>
        </span>
      </span>
    </template>
  </div>
</template>

<style scoped>
.reels {
  --h: 1.15em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.12em;
  font-size: clamp(2rem, 9cqw, 3.4rem);
  line-height: var(--h);
}

.reel {
  position: relative;
  width: 0.92em;
  height: var(--h);
  overflow: hidden;
  border-radius: 0.18em;
  background:
    linear-gradient(to bottom, color-mix(in oklab, black 55%, transparent), transparent 30%, transparent 70%, color-mix(in oklab, black 55%, transparent)),
    color-mix(in oklab, var(--ui-bg) 70%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 12%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 7%, transparent),
    inset 0 -6px 12px -6px color-mix(in oklab, var(--ui-primary) 50%, transparent);
}

/* The payline across the window. */
.reel::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 50%;
  height: 1px;
  background: color-mix(in oklab, var(--ui-primary) 35%, transparent);
}

.strip {
  --led-pitch: 0.075em;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--ui-text-highlighted);
  filter: drop-shadow(0 0 0.15em color-mix(in oklab, var(--ui-primary) 80%, transparent));
  transform: translateY(calc(var(--d) * var(--h) * -1));
  transition: transform 0.7s cubic-bezier(0.2, 1.5, 0.35, 1);
  transition-delay: calc(var(--i) * 45ms);
}

.strip > span {
  height: var(--h);
}

.spinning .strip {
  animation: reel 0.32s linear infinite;
  animation-delay: calc(var(--i) * -37ms);
  filter: blur(0.04em) drop-shadow(0 0 0.2em var(--ui-primary));
}

@keyframes reel {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(calc(var(--h) * -10));
  }
}

.gap {
  width: 0.22em;
}

.invalid .strip {
  color: var(--ui-error);
  filter: drop-shadow(0 0 0.15em var(--ui-error));
}

.invalid .reel {
  animation: shake 0.4s ease;
}

@keyframes shake {
  25% {
    translate: -0.06em 0;
  }
  75% {
    translate: 0.06em 0;
  }
}
</style>
