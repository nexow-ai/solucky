<script setup lang="ts">
/**
 * A pane of glass for the play page: it blurs and saturates whatever moves
 * behind it, catches light on its top lip, pools its tint at the bottom, and
 * a highlight follows the pointer across it like a lamp over a table.
 */
const props = withDefaults(
  defineProps<{
    as?: string;
    /** The color the glass is tinted with. */
    tint?: 'primary' | 'secondary';
    /** A brighter, thicker pane for the panel the eye should land on. */
    hero?: boolean;
    /** Radius class; panes are rounded, bars are pills. */
    rounded?: string;
  }>(),
  { as: 'section', tint: 'primary', hero: false, rounded: 'rounded-[1.75rem]' },
);

const pane = ref<HTMLElement>();
let frame = 0;

function onMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !pane.value) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const box = pane.value!.getBoundingClientRect();
    pane.value!.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
    pane.value!.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
    pane.value!.dataset.lit = '';
  });
}

function onLeave() {
  cancelAnimationFrame(frame);
  delete pane.value?.dataset.lit;
}

onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>

<template>
  <component
    :is="props.as"
    ref="pane"
    class="glass"
    :class="[props.rounded, `glass-${props.tint}`, { 'glass-hero': props.hero }]"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <span class="glass-band" aria-hidden="true" />
    <span class="glass-lamp" aria-hidden="true" />
    <span class="bg-noise glass-grain" aria-hidden="true" />
    <div class="glass-body">
      <slot />
    </div>
  </component>
</template>

<style scoped>
.glass {
  --tint: var(--ui-primary);
  --mx: 30%;
  --my: 0%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background:
    linear-gradient(
      165deg,
      color-mix(in oklab, white 10%, transparent) 0%,
      color-mix(in oklab, white 2.5%, transparent) 34%,
      color-mix(in oklab, var(--tint) 9%, transparent) 100%
    ),
    color-mix(in oklab, var(--ui-bg) 46%, transparent);
  -webkit-backdrop-filter: blur(24px) saturate(1.9) brightness(1.06);
  backdrop-filter: blur(24px) saturate(1.9) brightness(1.06);
  box-shadow:
    /* The lip: light caught on the top edge, shadow on the bottom one. */
    inset 0 1px 0 0 color-mix(in oklab, white 34%, transparent),
    inset 0 -1px 0 0 color-mix(in oklab, black 50%, transparent),
    /* The pane's face. */ inset 0 0 0 1px color-mix(in oklab, white 6%, transparent),
    /* Thickness: light trapped in the upper body, tint pooling at the bottom. */ inset 0 28px 44px -34px
      color-mix(in oklab, white 30%, transparent),
    inset 0 -46px 64px -52px color-mix(in oklab, var(--tint) 70%, transparent),
    /* Resting on the table. */ 0 44px 90px -42px rgb(0 0 0 / 0.9),
    0 0 70px -34px color-mix(in oklab, var(--tint) 55%, transparent);
}

.glass-secondary {
  --tint: var(--ui-secondary);
}

.glass-hero {
  background:
    linear-gradient(
      165deg,
      color-mix(in oklab, white 13%, transparent) 0%,
      color-mix(in oklab, white 3%, transparent) 30%,
      color-mix(in oklab, var(--tint) 13%, transparent) 100%
    ),
    color-mix(in oklab, var(--ui-bg) 40%, transparent);
  box-shadow:
    inset 0 1px 0 0 color-mix(in oklab, white 45%, transparent),
    inset 0 -1px 0 0 color-mix(in oklab, black 55%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 8%, transparent),
    inset 0 32px 50px -36px color-mix(in oklab, white 34%, transparent),
    inset 0 -60px 80px -60px color-mix(in oklab, var(--tint) 85%, transparent),
    0 50px 110px -46px rgb(0 0 0 / 0.95),
    0 0 110px -40px color-mix(in oklab, var(--tint) 75%, transparent);
}

/* The rim: one pixel that catches the light, brightest at the top left. */
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(
    140deg,
    color-mix(in oklab, white 70%, transparent),
    color-mix(in oklab, white 10%, transparent) 22%,
    transparent 48%,
    color-mix(in oklab, var(--tint) 70%, transparent) 82%,
    color-mix(in oklab, white 30%, transparent)
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* A reflection band across the pane, as on any sheet of glass under a light. */
.glass-band {
  position: absolute;
  inset: -40% -10%;
  z-index: 1;
  background: linear-gradient(
    118deg,
    transparent 36%,
    color-mix(in oklab, white 7%, transparent) 44%,
    color-mix(in oklab, white 2%, transparent) 50%,
    transparent 58%
  );
  pointer-events: none;
}

/* The lamp: a soft highlight that follows the pointer. */
.glass-lamp {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(520px circle at var(--mx) var(--my), color-mix(in oklab, white 12%, transparent), transparent 42%),
    radial-gradient(
      260px circle at var(--mx) var(--my),
      color-mix(in oklab, var(--tint) 16%, transparent),
      transparent 60%
    );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.glass[data-lit] .glass-lamp {
  opacity: 1;
}

.glass-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.glass-body {
  position: relative;
  z-index: 2;
}

/* Day mode: frosted white glass over the same table. */
:root:not(.dark) .glass {
  background:
    linear-gradient(
      165deg,
      color-mix(in oklab, white 70%, transparent),
      color-mix(in oklab, white 45%, transparent) 40%,
      color-mix(in oklab, var(--tint) 10%, transparent)
    ),
    color-mix(in oklab, var(--ui-bg) 40%, transparent);
  box-shadow:
    inset 0 1px 0 0 white,
    inset 0 -1px 0 0 color-mix(in oklab, black 12%, transparent),
    inset 0 0 0 1px color-mix(in oklab, black 6%, transparent),
    0 30px 70px -40px color-mix(in oklab, var(--tint) 45%, transparent);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass {
    background: color-mix(in oklab, var(--ui-bg-elevated) 94%, transparent);
  }
}
</style>
