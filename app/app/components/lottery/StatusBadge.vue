<script setup lang="ts">
import { RoundStatus } from '@solucky/client';

/** `current`: the round on sale. `lottery`: false for Guess, whose rounds never wait to close. */
const props = withDefaults(defineProps<{ status: RoundStatus; current?: boolean; lottery?: boolean }>(), {
  lottery: true,
});
const { t } = useI18n();

const badge = computed(() => {
  switch (props.status) {
    case RoundStatus.Open:
      return props.current || !props.lottery
        ? { label: t('status.open'), color: 'success' as const, icon: 'i-lucide-circle-dot' }
        : { label: t('status.toClose'), color: 'warning' as const, icon: 'i-lucide-hourglass' };
    case RoundStatus.Closed:
      return props.lottery
        ? { label: t('status.toDraw'), color: 'warning' as const, icon: 'i-lucide-hourglass' }
        : { label: t('status.checking'), color: 'info' as const, icon: 'i-lucide-scan-search' };
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
