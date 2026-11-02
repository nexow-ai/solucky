<script setup lang="ts">
/**
 * A share as a percentage in the page's language. A tiny one shows the
 * decimals it needs to reach its first two digits, the ones past the usual
 * three in smaller type (`0.000` `0048` `%`), so it never reads as 0%.
 */
const props = defineProps<{ ratio: number | null }>();

const intl = useIntlLocale();
const parts = computed(() => percentParts(props.ratio, intl.value));
</script>

<template>
  <span class="whitespace-nowrap">
    <span>{{ parts.head }}</span>
    <span v-if="parts.tail" class="text-[0.7em]">{{ parts.tail }}</span>
    <span>{{ parts.rest }}</span>
  </span>
</template>
