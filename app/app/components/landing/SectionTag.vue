<script setup lang="ts">
/** The small label above a section's title: a lit dot and the section's name. `index` is an optional mark before it. */
const props = defineProps<{ index?: string; label: string }>();
</script>

<template>
  <span class="kicker inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 shadow-(--neu-in-sm)">
    <span class="led-dot text-primary" aria-hidden="true" />
    <span v-if="props.index" class="text-primary" aria-hidden="true">{{ props.index }}</span>
    {{ props.label }}
  </span>
</template>
