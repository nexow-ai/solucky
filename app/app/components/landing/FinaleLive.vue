<script setup lang="ts">
import { GameKind, msUntilClose } from '@solucky/client';

/** Today's pot and the time left to its draw, under the landing's midnight eclipse. Browser only. */
const { t } = useI18n();
const intl = useIntlLocale();
const price = useSolPrice();
const now = useNow();
const { period, pot, loading } = useLottery(GameKind.Daily);

const clock = computed(() => {
  const total = Math.floor(msUntilClose(GameKind.Daily, period.value ?? 0, now.value) / 1000);
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
});
</script>

<template>
  <dl class="mx-auto grid max-w-lg grid-cols-2 gap-4 sm:gap-6">
    <div>
      <dt class="kicker text-[0.6rem]">{{ t('stat.todaysPot') }}</dt>
      <dd v-if="loading"><USkeleton class="mx-auto mt-2 h-9 w-32" /></dd>
      <dd
        v-else
        class="led mt-1 font-mono text-3xl font-extrabold text-highlighted tabular-nums [--led-pitch:0.1em] sm:text-4xl"
        dir="ltr"
      >
        ◎{{ formatSol(pot, 3) }}
      </dd>
      <dd class="font-mono text-xs text-muted">{{ loading ? '' : formatUsd(pot, price, intl) }}</dd>
    </div>
    <div>
      <dt class="kicker text-[0.6rem]">{{ t('home.live.drawIn') }}</dt>
      <dd
        class="led mt-1 font-mono text-3xl font-extrabold text-primary tabular-nums [--led-pitch:0.1em] sm:text-4xl"
        dir="ltr"
      >
        {{ clock }}
      </dd>
      <dd class="font-mono text-xs text-secondary">00:00 UTC</dd>
    </div>
  </dl>
</template>
