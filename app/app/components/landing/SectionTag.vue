<script setup lang="ts">
/**
 * `// 01 ── How it works`, the HUD-style headline above each landing section.
 * When it scrolls into view the rule draws itself and the label decodes from
 * random glyphs, like a readout locking on. The server renders the final
 * words, so they are there without scripts; reduced motion skips the effect.
 */
const props = defineProps<{ index: string; label: string }>();

const GLYPHS = '0123456789#%&*+/<=>?ABCDEFXZ☉◎';
const el = useTemplateRef<HTMLElement>('el');
const text = ref(props.label);
/** Unset on the server (all drawn), `armed` once the browser waits for it to scroll in, `on` after. */
const state = ref<'armed' | 'on'>();
watch(
  () => props.label,
  (label) => (text.value = label),
);

let frame = 0;
let observer: IntersectionObserver | undefined;

function decode() {
  const chars = [...props.label];
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / 650);
    const fixed = Math.floor(progress * chars.length);
    text.value = chars
      .map((char, i) => (i < fixed || /\s/.test(char) ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join('');
    if (progress < 1) frame = requestAnimationFrame(step);
    else text.value = props.label;
  };
  frame = requestAnimationFrame(step);
}

onMounted(() => {
  if (!el.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Already on screen (a reload halfway down): leave it as it is.
  const box = el.value.getBoundingClientRect();
  if (box.top < window.innerHeight && box.bottom > 0) return;
  state.value = 'armed';
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      observer?.disconnect();
      state.value = 'on';
      decode();
    },
    { threshold: 1, rootMargin: '0px 0px -12% 0px' },
  );
  observer.observe(el.value);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
});
</script>

<template>
  <span ref="el" class="tag kicker inline-flex items-center gap-3 text-secondary" :data-state="state">
    <span class="text-primary">//</span>
    {{ index }}
    <span aria-hidden="true" class="rule h-px w-10 bg-linear-to-r from-secondary to-primary" />
    <span class="sr-only">{{ props.label }}</span>
    <span aria-hidden="true">{{ text }}</span>
  </span>
</template>

<style scoped>
.rule {
  transform-origin: left center;
  transition: transform 0.7s var(--ease-out-expo) 0.1s;
}

.rule:dir(rtl) {
  transform-origin: right center;
}

.tag[data-state='armed'] .rule {
  transform: scaleX(0);
}

.tag[data-state='armed'] {
  opacity: 0;
}

.tag {
  transition: opacity 0.3s ease;
}
</style>
