<script setup lang="ts">
/**
 * The head of a landing section, set on the start side: the decoding HUD tag,
 * a big title that comes into focus, and the description beside it on wide
 * screens. The section's number glows faintly behind it, like an unlit sign.
 */
// `stacked` keeps the description under the title at every width (for a head in a side column).
const props = defineProps<{ index: string; tag: string; title: string; description?: string; stacked?: boolean }>();
</script>

<template>
  <header
    class="relative isolate grid gap-6"
    :class="props.stacked ? '' : 'mb-12 sm:mb-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16'"
  >
    <span
      aria-hidden="true"
      class="led pointer-events-none absolute -top-16 -end-2 -z-10 hidden font-mono text-[11rem] leading-none font-extrabold text-primary/[0.07] select-none lg:block"
      dir="ltr"
      >{{ props.index }}</span
    >
    <div>
      <LandingSectionTag :index="props.index" :label="props.tag" />
      <h2
        class="reveal-blur mt-4 text-4xl font-bold tracking-tighter text-balance text-highlighted sm:text-5xl lg:text-6xl"
      >
        {{ props.title }}
      </h2>
    </div>
    <div class="space-y-5">
      <p v-if="props.description" class="text-pretty text-muted lg:text-lg">{{ props.description }}</p>
      <slot />
    </div>
  </header>
</template>
