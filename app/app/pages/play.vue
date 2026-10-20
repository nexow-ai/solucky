<script setup lang="ts">
useSeoMeta({
  title: 'Play · S☉Lucky',
  description: "Pick today's number and watch the pot grow live on Solana.",
});

const { error, refresh, loading } = useLottery();
const { cluster, clusterLabel, isMainnet } = useSolana();

const testFunds = computed(() =>
  cluster === 'localnet'
    ? { text: 'Fund your wallet with: solana airdrop 5 <address> -u localhost', action: [] }
    : {
        text: 'Get some for free from the Solana faucet.',
        action: [
          {
            label: 'Open faucet',
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
  <UContainer class="space-y-6 py-8">
    <UAlert
      v-if="!isMainnet"
      color="warning"
      variant="subtle"
      icon="i-lucide-flask-conical"
      :title="`You are playing on Solana ${clusterLabel}: tickets cost test SOL with no real value.`"
      :description="testFunds.text"
      :actions="testFunds.action"
    />
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-cloud-off"
      :title="error"
      :actions="[{ label: 'Retry', color: 'error', variant: 'outline', loading, onClick: refresh }]"
    />

    <div class="grid items-start gap-6 lg:grid-cols-3">
      <LotteryPotPanel />
      <LotteryPlayPanel />
      <LotteryHistoryPanel />
    </div>
  </UContainer>
</template>
