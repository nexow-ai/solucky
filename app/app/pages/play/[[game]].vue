<script setup lang="ts">
import { GAME_SLUGS, gameFromSlug } from '@solucky/client';

// `/play` is the daily lottery; `/play/hourly` and `/play/guess` the others.
definePageMeta({ validate: (route) => !route.params.game || gameFromSlug(String(route.params.game)) !== null });

const { t } = useI18n();
const game = useGame();

const title = computed(() => `${t(`games.${GAME_SLUGS[game.value]}.name`)} · S☉Lucky`);
useSeoMeta({
  title,
  ogTitle: title,
  description: () => t('play.description'),
  ogDescription: () => t('play.description'),
});

const { error, refresh } = useLottery();
const { cluster, clusterLabel, isMainnet } = useSolana();
const { address } = useWallet();
const { feed } = useTableFeed();

// The retry button spins until the reload answers, whatever the game's own loading state says.
const retrying = ref(false);
async function retry() {
  retrying.value = true;
  try {
    await refresh();
  } finally {
    retrying.value = false;
  }
}

const arriving = mounted === 0 && Date.now() - leftAt > 1_000;
onMounted(() => mounted++);
onBeforeUnmount(() => {
  mounted--;
  leftAt = Date.now();
});

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
            to: faucetUrl(cluster, address.value) ?? 'https://faucet.solana.com',
            target: '_blank',
            color: 'warning' as const,
            variant: 'outline' as const,
          },
        ],
      },
);
</script>

<script lang="ts">
/**
 * Switching games remounts this page. These tell an arrival (the panels rise
 * in) from a switch (the view transition cross-fades and the game pill glides
 * to the new game): a switch mounts the new page while the old one is still
 * up, or right after it left.
 */
let mounted = 0;
let leftAt = 0;
</script>

<template>
  <div class="relative" :class="{ arriving }">
    <LotteryFloor />
    <UContainer class="space-y-5 py-5 sm:py-7">
      <!-- Test money: one line, with the way to get some a tap away. -->
      <div
        v-if="!isMainnet"
        class="glass-alert enter flex items-center gap-3 px-3.5 py-2 text-sm text-warning sm:px-4 sm:py-2.5"
        style="--i: 0"
        role="note"
      >
        <UIcon name="i-lucide-flask-conical" class="size-4 shrink-0" />
        <p class="min-w-0 flex-1 text-xs font-medium text-pretty sm:text-sm">
          {{ t('play.testMoney', { cluster: clusterLabel }) }}
        </p>
        <UPopover :content="{ align: 'end', sideOffset: 10 }">
          <UButton :label="t('play.fundHow')" icon="i-lucide-droplets" color="warning" variant="outline" size="xs" />
          <template #content>
            <div class="max-w-xs space-y-3 p-4 text-sm text-toned">
              <p class="text-pretty">{{ testFunds.text }}</p>
              <UButton v-for="action in testFunds.action" :key="action.label" v-bind="action" size="sm" />
            </div>
          </template>
        </UPopover>
      </div>
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-lucide-cloud-off"
        class="glass-alert glass-alert-error"
        :title="error"
        :actions="[{ label: t('play.retry'), color: 'error', variant: 'outline', loading: retrying, onClick: retry }]"
      />

      <div class="enter flex items-center justify-center gap-2" style="--i: 1">
        <LotteryGameTabs />
        <LotteryNotifyButton />
      </div>

      <LotteryStage class="enter" style="--i: 2" />
      <LotteryLiveBar class="enter" style="--i: 3" :feed="feed" />

      <div class="grid items-start gap-5 lg:grid-cols-12 lg:items-stretch">
        <LotteryPlayPanel class="enter lg:col-span-7" style="--i: 4" />
        <LotteryTicketsPanel class="enter lg:col-span-5" style="--i: 5" />
      </div>
      <LotteryHistoryPanel class="enter" style="--i: 6" />
    </UContainer>
    <LotteryDrawReveal />
  </div>
</template>

<style scoped>
/*
 * Arriving at the table: the bar, then the panels, rise into place one after
 * the other. Opacity and movement only, on the glass itself, so the glass keeps
 * refracting the floor while it fades in.
 */
@media (prefers-reduced-motion: no-preference) {
  .arriving .enter {
    animation: deal 0.95s var(--ease-out-expo) backwards;
    animation-delay: calc(var(--i, 0) * 110ms + 60ms);
  }
}

@keyframes deal {
  from {
    opacity: 0;
    transform: translateY(2rem) scale(0.97);
  }
}
</style>

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

.glass-alert-error {
  --tint: var(--ui-error);
}
</style>
