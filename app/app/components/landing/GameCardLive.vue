<script setup lang="ts">
import { GameKind, isLottery, msUntilClose, periodOf } from '@solucky/client';

/**
 * A game card's readout: the pot of its round on sale and the time to its
 * draw. The daily lottery's pot is live (the hero's dial loads it anyway);
 * the others refresh once a minute, in one light call for all. Browser only.
 */
const props = defineProps<{ kind: number }>();

const { t } = useI18n();
const intl = useIntlLocale();
const price = useSolPrice();
const now = useNow();
const pots = useGamePots();
const daily = useLottery(GameKind.Daily);

const pot = computed(() =>
  props.kind === GameKind.Daily && !daily.loading.value ? daily.pot.value : (pots.value[props.kind] ?? null),
);
const clock = computed(() => {
  if (!isLottery(props.kind)) return null;
  const total = Math.floor(msUntilClose(props.kind, periodOf(props.kind, now.value), now.value) / 1000);
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
});
</script>

<template>
  <div class="flex items-end justify-between gap-4">
    <div class="min-w-0">
      <p class="kicker text-[0.6rem]">{{ t('stat.todaysPot') }}</p>
      <USkeleton v-if="pot === null" class="mt-1.5 h-7 w-24 rounded-full" />
      <p v-else class="readout mt-0.5 truncate text-3xl leading-tight" dir="ltr">◎{{ formatSol(pot, 3) }}</p>
      <p class="font-mono text-[0.65rem] text-muted tabular-nums">
        {{ pot === null ? '' : formatUsd(pot, price, intl) }}
      </p>
    </div>
    <div class="shrink-0 text-end">
      <p class="kicker text-[0.6rem]">{{ clock ? t('home.live.drawIn') : '' }}</p>
      <p v-if="clock" class="mt-1 font-mono text-sm text-secondary tabular-nums" dir="ltr">{{ clock }}</p>
      <p v-else class="mt-1 text-xs text-muted">{{ t('home.live.noDeadline') }}</p>
    </div>
  </div>
</template>
