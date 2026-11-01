<script setup lang="ts">
import { GAME_SLUGS, gameFromSlug } from '@solucky/client';

// `/play` is the daily lottery; `/play/hourly` and `/play/guess` the others.
definePageMeta({ validate: (route) => !route.params.game || gameFromSlug(String(route.params.game)) !== null });

const { t } = useI18n();
const localePath = useLocalePath();
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
    <UContainer class="space-y-5 py-6 sm:py-8">
      <UAlert
        v-if="!isMainnet"
        color="warning"
        variant="subtle"
        icon="i-lucide-flask-conical"
        class="glass-alert enter"
        style="--i: 0"
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
        :actions="[{ label: t('play.retry'), color: 'error', variant: 'outline', loading: retrying, onClick: retry }]"
      />

      <div class="enter flex items-center justify-center gap-2" style="--i: 1">
        <LotteryGlass as="nav" rounded="rounded-full" :aria-label="t('games.tag')">
          <div class="flex gap-1 p-1">
            <span v-for="(slug, kind) in GAME_SLUGS" :key="slug" class="relative">
              <span v-if="kind === game" class="game-pill" aria-hidden="true" />
              <UButton
                :to="localePath(playPath(slug))"
                :label="t(`games.${slug}.short`)"
                :aria-current="kind === game ? 'page' : undefined"
                :color="kind === game ? 'primary' : 'neutral'"
                variant="ghost"
                size="lg"
                class="relative rounded-full px-4 font-semibold hover:bg-transparent"
                :class="kind === game ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
              />
            </span>
          </div>
        </LotteryGlass>
        <LotteryNotifyButton />
      </div>

      <LotteryLiveBar class="enter" style="--i: 2" :feed="feed" />

      <div class="panels grid items-start gap-5 lg:grid-cols-[1fr_1.12fr_1fr]">
        <LotteryPotPanel class="enter order-2 lg:order-none" style="--i: 4" />
        <LotteryPlayPanel class="enter order-1 lg:order-none" style="--i: 3" />
        <LotteryHistoryPanel class="enter order-3 lg:order-none" style="--i: 5" />
      </div>
    </UContainer>
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

/* The current game's pill. It carries a view-transition name, so it glides to the next game on a switch. */
.game-pill {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  view-transition-name: game-pill;
  background:
    linear-gradient(180deg, color-mix(in oklab, white 16%, transparent), transparent 60%),
    linear-gradient(
      120deg,
      color-mix(in oklab, var(--ui-primary) 40%, transparent),
      color-mix(in oklab, var(--color-pink-600) 30%, transparent)
    );
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 35%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-primary) 55%, transparent),
    0 0 24px -6px var(--ui-primary);
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
</style>
