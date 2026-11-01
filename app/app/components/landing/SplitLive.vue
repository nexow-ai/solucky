<script setup lang="ts">
import { carryFor, feeFor, GameKind, prizeFor } from '@solucky/client';

/** How the program splits a pot, as a bar: the winner's 80%, the daily lottery's fee and the carry-over. */
const { t } = useI18n();
const intl = useIntlLocale();
const { pot, feeBps, loading } = useLottery(GameKind.Daily);
const cap = computed(() => new Intl.NumberFormat(intl.value, { style: 'percent' }).format(0.2));

const parts = computed(() => {
  const fee = feeBps.value / 10_000;
  return [
    { key: 'winner', share: 0.8, amount: prizeFor(pot.value), bar: 'bg-lucky', dot: 'bg-primary' },
    {
      key: 'fee',
      share: fee,
      amount: feeFor(pot.value, feeBps.value),
      bar: 'bg-(--ui-text-dimmed)',
      dot: 'bg-(--ui-text-dimmed)',
    },
    {
      key: 'carry',
      share: 0.2 - fee,
      amount: carryFor(pot.value, feeBps.value),
      bar: 'bg-secondary',
      dot: 'bg-secondary',
    },
  ];
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex h-4 overflow-hidden rounded-full bg-elevated ring ring-default" aria-hidden="true">
      <span
        v-for="part in parts"
        :key="part.key"
        class="split-part h-full"
        :class="part.bar"
        :style="{ width: `${Math.max(0, part.share) * 100}%` }"
      />
    </div>
    <dl class="grid grid-cols-3 gap-4">
      <div v-for="part in parts" :key="part.key">
        <dt class="kicker flex items-center gap-1.5 text-[0.6rem]">
          <span class="size-2 rounded-full" :class="part.dot" />
          {{ t(`home.split.${part.key}`) }}
        </dt>
        <dd class="mt-1 font-mono text-lg font-semibold text-highlighted tabular-nums">
          {{ loading && part.key !== 'winner' ? '—' : formatPercent(Math.max(0, part.share), intl) }}
        </dd>
        <dd v-if="!loading && pot > 0n" class="font-mono text-xs text-muted tabular-nums" dir="ltr">
          ◎{{ formatSol(part.amount, 4) }}
        </dd>
      </div>
    </dl>
    <p v-if="!loading" class="text-sm text-pretty text-muted">
      {{ t('home.split.feeNote', { fee: formatPercent(feeBps / 10_000, intl), cap }) }}
      <template v-if="pot > 0n">{{ t('home.split.example', { pot: `◎${formatSol(pot, 4)}` }) }}</template>
    </p>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .split-part {
    animation: grow 1.2s var(--ease-out-expo) both;
  }
  .split-part:nth-child(2) {
    animation-delay: 0.15s;
  }
  .split-part:nth-child(3) {
    animation-delay: 0.3s;
  }
}

@keyframes grow {
  from {
    width: 0;
  }
}
</style>
