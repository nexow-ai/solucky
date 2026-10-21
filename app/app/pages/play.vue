<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => `${t('play.title')} · S☉Lucky`,
  description: () => t('play.description'),
});

const { error, refresh, loading } = useLottery();
const { cluster, clusterLabel, isMainnet } = useSolana();
const { feed } = useTableFeed();

const testFunds = computed(() =>
  cluster === 'localnet'
    ? {
        text: t('play.localFunds', {
          url: 'http://127.0.0.1:8899',
          command: 'solana airdrop 5 <address> -u localhost',
        }),
        action: [],
      }
    : {
        text: t('play.phantomFunds', { cluster: clusterLabel }),
        action: [
          {
            label: t('play.openFaucet'),
            to: 'https://faucet.solana.com',
            target: '_blank',
            color: 'warning' as const,
            variant: 'outline' as const,
          },
        ],
      },
);
</script>

<template>
  <div class="relative">
    <LotteryFloor />
    <UContainer class="space-y-5 py-6 sm:py-8">
      <UAlert
        v-if="!isMainnet"
        color="warning"
        variant="subtle"
        icon="i-lucide-flask-conical"
        class="glass-alert"
        :title="t('play.testMoney', { cluster: clusterLabel })"
        :description="testFunds.text"
        :actions="testFunds.action"
      />
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-lucide-cloud-off"
        class="glass-alert"
        :title="error"
        :actions="[{ label: t('play.retry'), color: 'error', variant: 'outline', loading, onClick: refresh }]"
      />

      <LotteryLiveBar :feed="feed" />

      <div class="grid items-start gap-5 lg:grid-cols-[1fr_1.12fr_1fr]">
        <LotteryPotPanel class="order-2 lg:order-none" />
        <LotteryPlayPanel class="order-1 lg:order-none" />
        <LotteryHistoryPanel class="order-3 lg:order-none" />
      </div>
    </UContainer>
  </div>
</template>

<style>
/*
 * Glass for the table's own toasts (useTableFeed) and the page's alerts. Not
 * scoped: toasts render in the app's toaster. Unlayered, so they win over the
 * component's utility classes.
 */
.glass-toast,
.glass-alert {
  --tint: var(--ui-primary);
  background:
    linear-gradient(
      160deg,
      color-mix(in oklab, white 12%, transparent),
      color-mix(in oklab, white 2%, transparent) 45%,
      color-mix(in oklab, var(--tint) 12%, transparent)
    ),
    color-mix(in oklab, var(--ui-bg) 55%, transparent);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  backdrop-filter: blur(20px) saturate(1.8);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 30%, transparent),
    inset 0 -1px 0 color-mix(in oklab, black 45%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--tint) 28%, transparent),
    0 24px 50px -24px rgb(0 0 0 / 0.85),
    0 0 40px -18px color-mix(in oklab, var(--tint) 70%, transparent);
  border-radius: 1.1rem;
}

.glass-toast-join {
  --tint: var(--ui-secondary);
}

.glass-alert {
  --tint: var(--ui-warning);
}
</style>
