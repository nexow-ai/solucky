<script setup lang="ts">
/**
 * The head of a landing section: its tag, a title and the description under
 * it, centered; `stacked` sets it on the start side, for a side column.
 */
const props = defineProps<{ tag: string; title: string; description?: string; stacked?: boolean }>();
</script>

<template>
  <header class="reveal" :class="props.stacked ? '' : 'mx-auto mb-12 max-w-2xl text-center sm:mb-16'">
    <LandingSectionTag :label="props.tag" />
    <h2 class="mt-5 text-3xl font-light tracking-tight text-balance text-highlighted sm:text-5xl">
      {{ props.title }}
    </h2>
    <p v-if="props.description" class="mt-4 text-pretty text-muted sm:text-lg">{{ props.description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </header>
</template>
