<script setup lang="ts">
import type { Account } from '@solana/kit';
import { countryFromBytes, flagEmoji, GAME_SLUGS, type Round } from '@solucky/client';

/**
 * The draw, as it happens: when the round just before the one on sale is
 * settled while the page is open, its winning number rolls in on the reels,
 * then the winner and the prize, with confetti when the winner is you. Rounds
 * settled before the page opened stay in the history.
 */
const { t } = useI18n();
const localePath = useLocalePath();
const { kind, period, settled, loading, error } = useLottery();
const { address } = useWallet();
const sound = useSound();

const shown = shallowRef<Account<Round> | null>(null);
const open = ref(false);
const rolling = ref(false);
const burst = useTemplateRef<{ fire: (count?: number, fly?: boolean) => void }>('burst');

const data = computed(() => shown.value?.data ?? null);
const mine = computed(() => !!data.value && data.value.winner === address.value);
const title = computed(() =>
  data.value ? t('reveal.title', { round: roundTitle(data.value.kind, data.value.period) }) : '',
);
const amount = computed(() => (data.value ? formatSol(data.value.payout, 3) : ''));
/** While rolling, the reels spin at the winning number's width so they stop in place. */
const reelValue = computed(() =>
  !data.value ? 0 : rolling.value ? Number('1'.repeat(String(data.value.winningNumber).length)) : data.value.winningNumber,
);

const seen = new Set<string>();
let armed = false;
let timers: ReturnType<typeof setTimeout>[] = [];

async function reveal(round: Account<Round>) {
  timers.forEach(clearTimeout);
  shown.value = round;
  rolling.value = true;
  open.value = true;
  timers = [
    setTimeout(() => {
      rolling.value = false;
      sound.play('commit');
    }, 1_800),
    setTimeout(() => {
      if (!mine.value) return;
      sound.play('pot');
      burst.value?.fire(40, false);
    }, 2_600),
  ];
}

// The rounds known when the page opens are history; a new one settled after it, for the round just before the one on sale, is news.
watch(
  [settled, loading, error, kind],
  ([rounds, isLoading, failed]) => {
    if (isLoading || failed) return;
    const fresh = rounds.filter((r) => !seen.has(r.address));
    rounds.forEach((r) => seen.add(r.address));
    if (!armed) {
      armed = true;
      return;
    }
    const latest = fresh.find((r) => period.value !== null && r.data.period === period.value - 1);
    if (latest) void reveal(latest);
  },
  { immediate: true },
);

onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="mine ? t('reveal.youWon', { amount }) : t('reveal.winner', { amount })"
    :ui="{ content: 'bg-transparent shadow-none ring-0 sm:max-w-md overflow-visible divide-none' }"
  >
    <template #content>
      <LotteryGlass v-if="data" hero class="reveal">
        <div class="relative space-y-5 p-6 text-center sm:p-7">
          <div>
            <p class="kicker">{{ t(`games.${GAME_SLUGS[data.kind as 0 | 1 | 2]}.name`) }}</p>
            <h2 class="mt-1 text-2xl font-semibold text-highlighted" dir="auto">{{ title }}</h2>
          </div>

          <div class="reveal-window table-well" :class="{ landed: !rolling }">
            <p class="kicker mb-2 text-[0.65rem]">{{ t('reveal.number') }}</p>
            <LotteryReels :value="reelValue" :spinning="rolling" />
          </div>

          <Transition name="result">
            <div v-if="!rolling" class="space-y-2">
              <p v-if="mine" class="text-lucky glow-primary text-3xl font-semibold">
                {{ t('reveal.youWon', { amount }) }}
              </p>
              <template v-else>
                <p class="flex items-center justify-center gap-2 font-mono text-sm text-toned" dir="ltr">
                  <span class="text-lg" aria-hidden="true">{{ flagEmoji(countryFromBytes(data.winnerCountry)) }}</span>
                  {{ shortAddress(data.winner, 6) }}
                </p>
                <p class="text-lg font-semibold text-highlighted">{{ t('reveal.winner', { amount }) }}</p>
              </template>
            </div>
          </Transition>

          <div class="flex flex-wrap justify-center gap-2">
            <UButton
              :to="localePath(roundPath(data.kind, data.period))"
              :label="t('reveal.see')"
              icon="i-lucide-scan-search"
              color="secondary"
              variant="soft"
              @click="open = false"
            />
            <UButton :label="t('reveal.close')" color="neutral" variant="ghost" @click="open = false" />
          </div>
          <LotteryBurst ref="burst" />
        </div>
      </LotteryGlass>
    </template>
  </UModal>
</template>

<style scoped>
.reveal-window {
  container-type: inline-size;
  padding: 1rem 0.75rem 1.1rem;
  transition: box-shadow 0.5s;
}

.reveal-window.landed {
  box-shadow:
    inset 0 2px 12px color-mix(in oklab, black 65%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-secondary) 55%, transparent),
    0 0 50px -12px var(--ui-secondary);
}

.result-enter-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s var(--ease-spring);
}

.result-enter-from {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.95);
}
</style>
