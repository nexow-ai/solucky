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
    .map((char, i) =>
      /\s/.test(char)
        ? { gap: true as const, key: `g${i}` }
        : { gap: false as const, digit: Number(char), key: `d${i}` },
    ),
);
const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
</script>

<template>
  <div class="reels" :class="{ spinning: props.spinning, invalid: props.invalid }" dir="ltr" aria-hidden="true">
    <template v-for="(cell, i) in cells" :key="cell.key">
      <span v-if="cell.gap" class="gap" />
      <span v-else class="reel" :style="{ '--d': cell.digit, '--i': i }">
        <span class="strip font-mono">
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
  gap: 0.06em;
  font-size: clamp(2rem, 9cqw, 3.4rem);
  line-height: var(--h);
}

/* Each digit in its own window, fading out at the top and bottom edges like a drum. */
.reel {
  position: relative;
  width: 0.72em;
  height: var(--h);
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
}

.strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 400;
  color: var(--ui-text-highlighted);
  transform: translateY(calc(var(--d) * var(--h) * -1));
  transition: transform 0.7s cubic-bezier(0.2, 1.5, 0.35, 1);
  transition-delay: calc(var(--i) * 45ms);
}

.strip > span {
  height: var(--h);
}

.spinning .strip {
  color: var(--ui-secondary);
  animation: reel 0.32s linear infinite;
  animation-delay: calc(var(--i) * -37ms);
  filter: blur(0.03em);
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
  width: 0.2em;
}

.invalid .strip {
  color: var(--ui-error);
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
