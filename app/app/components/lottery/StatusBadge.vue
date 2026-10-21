<script setup lang="ts">
import { RoundStatus } from '@solucky/client';

const props = defineProps<{ status: RoundStatus; today?: boolean }>();
const { t } = useI18n();

const badge = computed(() => {
  switch (props.status) {
    case RoundStatus.Open:
      return props.today
        ? { label: t('status.open'), color: 'success' as const, icon: 'i-lucide-circle-dot' }
        : { label: t('status.toClose'), color: 'warning' as const, icon: 'i-lucide-hourglass' };
    case RoundStatus.Closed:
      return { label: t('status.toDraw'), color: 'warning' as const, icon: 'i-lucide-hourglass' };
    case RoundStatus.Drawn:
      return { label: t('status.unpaid'), color: 'warning' as const, icon: 'i-lucide-gift' };
    default:
      return { label: t('status.paid'), color: 'neutral' as const, icon: 'i-lucide-circle-check' };
  }
});
</script>

<template>
  <UBadge :label="badge.label" :color="badge.color" :icon="badge.icon" variant="subtle" size="sm" />
</template>
