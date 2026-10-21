<script setup lang="ts">
/** `// 01 ── How it works`, the HUD-style headline above each landing section. */
defineProps<{ index: string; label: string }>();
</script>

<template>
  <span class="kicker inline-flex items-center gap-3 text-secondary">
    <span class="text-primary">//</span>
    {{ index }}
    <span aria-hidden="true" class="h-px w-10 bg-linear-to-r from-secondary to-primary" />
    {{ label }}
  </span>
</template>
