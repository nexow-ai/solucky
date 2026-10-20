<script setup lang="ts">
defineProps<{ label: string; value: string | number }>();
</script>

<template>
  <div class="text-center">
    <p class="kicker text-[0.65rem]">{{ label }}</p>
    <p class="mt-1 font-display text-lg font-bold tabular-nums text-highlighted">{{ value }}</p>
  </div>
</template>
