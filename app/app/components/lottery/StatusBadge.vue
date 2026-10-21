<script setup lang="ts">
import { RoundStatus } from '@solucky/client';

const props = defineProps<{ status: RoundStatus; today?: boolean }>();

const badge = computed(() => {
  switch (props.status) {
    case RoundStatus.Open:
      return props.today
        ? { label: 'Open', color: 'success' as const, icon: 'i-lucide-circle-dot' }
        : { label: 'Waiting to close', color: 'warning' as const, icon: 'i-lucide-hourglass' };
    case RoundStatus.Closed:
      return { label: 'Waiting for draw', color: 'warning' as const, icon: 'i-lucide-hourglass' };
    case RoundStatus.Drawn:
      return { label: 'Drawn, unpaid', color: 'warning' as const, icon: 'i-lucide-gift' };
    default:
      return { label: 'Paid', color: 'neutral' as const, icon: 'i-lucide-circle-check' };
  }
});
</script>

<template>
  <UBadge :label="badge.label" :color="badge.color" :icon="badge.icon" variant="subtle" size="sm" />
</template>
