<script setup lang="ts">
import type { Account } from '@solana/kit';
import { countryFromBytes, flagEmoji, GAME_SLUGS, type GameKind, type Round } from '@solucky/client';

/**
 * The draw, as it happens: when the round just before the one on sale is
 * settled while the page is open, its winning number rolls in on the reels,
 * then the winner and the prize, with confetti when the winner is you. Rounds
 * settled before the page opened stay in the history.
 *
 * A non-modal dialog over a dimmed table: focus moves to it, Escape or a
 * click outside closes it, and the page behind stays readable (the history
 * gets the same round at the same moment).
 */
const { t } = useI18n();
const localePath = useLocalePath();
const { kind, period, settled, loading, error } = useLottery();
const { address } = useWallet();
const sound = useSound();
const titleId = useId();

const shown = shallowRef<Account<Round> | null>(null);
const open = ref(false);
const rolling = ref(false);
const burst = useTemplateRef<{ fire: (count?: number, fly?: boolean) => void }>('burst');
const closeButton = useTemplateRef<{ $el: HTMLElement }>('closeButton');

const data = computed(() => shown.value?.data ?? null);
const mine = computed(() => !!data.value && data.value.winner === address.value);
const title = computed(() =>
  data.value ? t('reveal.title', { round: roundTitle(data.value.kind, data.value.period) }) : '',
);
const amount = computed(() => (data.value ? formatSol(data.value.payout, 3) : ''));
/** While rolling, the reels spin at the winning number's width so they stop in place. */
const reelValue = computed(() =>
  !data.value
    ? 0
    : rolling.value
      ? Number('1'.repeat(String(data.value.winningNumber).length))
      : data.value.winningNumber,
);

const seen = new Set<string>();
let armed = false;
let timers: ReturnType<typeof setTimeout>[] = [];
/** What had focus before the reveal, to give it back on close. */
let returnFocus: HTMLElement | null = null;

function reveal(round: Account<Round>) {
  timers.forEach(clearTimeout);
  shown.value = round;
  rolling.value = true;
  if (!open.value) returnFocus = document.activeElement as HTMLElement | null;
  open.value = true;
  void nextTick(() => closeButton.value?.$el.focus());
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

function close() {
  open.value = false;
  returnFocus?.focus?.();
  returnFocus = null;
}

function onKey(event: KeyboardEvent) {
  if (open.value && event.key === 'Escape') {
    event.stopPropagation();
    close();
  }
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
    if (latest) reveal(latest);
  },
  { immediate: true },
);

// Capture, so Escape closes the reveal before the play panel takes it as "reset the number".
onMounted(() => window.addEventListener('keydown', onKey, true));
onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
  window.removeEventListener('keydown', onKey, true);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="reveal">
      <div v-if="open && data" class="reveal-layer">
        <div class="reveal-backdrop" aria-hidden="true" @click="close" />
        <LotteryGlass
          hero
          as="div"
          role="dialog"
          aria-modal="false"
          :aria-labelledby="titleId"
          class="reveal-card w-full max-w-md"
        >
          <div class="relative space-y-5 p-6 text-center sm:p-7">
            <div>
              <p class="kicker">{{ t(`games.${GAME_SLUGS[data.kind as GameKind]}.name`) }}</p>
              <h2 :id="titleId" class="mt-1 text-2xl font-semibold text-highlighted" dir="auto">{{ title }}</h2>
            </div>

            <div
              class="reveal-window table-well"
              :class="{ landed: !rolling }"
              :style="{ '--n': formatNumber(reelValue).length }"
            >
              <p class="kicker mb-2 text-[0.65rem]">{{ t('reveal.number') }}</p>
              <LotteryReels :value="reelValue" :spinning="rolling" />
            </div>

            <div class="min-h-16" aria-live="polite">
              <Transition name="result">
                <div v-if="!rolling" class="space-y-2">
                  <p v-if="mine" class="text-lucky glow-primary text-3xl font-semibold">
                    {{ t('reveal.youWon', { amount }) }}
                  </p>
                  <template v-else>
                    <p class="flex items-center justify-center gap-2 font-mono text-sm text-toned" dir="ltr">
                      <span class="text-lg" aria-hidden="true">{{
                        flagEmoji(countryFromBytes(data.winnerCountry))
                      }}</span>
                      {{ shortAddress(data.winner, 6) }}
                    </p>
                    <p class="text-lg font-semibold text-highlighted">{{ t('reveal.winner', { amount }) }}</p>
                  </template>
                </div>
              </Transition>
            </div>

            <div class="flex flex-wrap justify-center gap-2">
              <UButton
                :to="localePath(roundPath(data.kind, data.period))"
                :label="t('reveal.see')"
                icon="i-lucide-scan-search"
                color="secondary"
                variant="soft"
                @click="open = false"
              />
              <UButton ref="closeButton" :label="t('reveal.close')" color="neutral" variant="ghost" @click="close" />
            </div>
            <LotteryBurst ref="burst" />
          </div>
        </LotteryGlass>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.reveal-layer {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.reveal-backdrop {
  position: absolute;
  inset: 0;
  background: color-mix(in oklab, var(--ui-bg) 55%, transparent);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.reveal-window {
  container-type: inline-size;
  padding: 1rem 0.75rem 1.1rem;
  transition: box-shadow 0.5s;
}

.reveal-window :deep(.reels) {
  font-size: min(3.75rem, calc(100cqw / (var(--n) * 1.02 + 0.6)));
}

.reveal-window.landed {
  box-shadow:
    inset 0 2px 12px color-mix(in oklab, black 65%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-secondary) 55%, transparent),
    0 0 50px -12px var(--ui-secondary);
}

/* The card rises in over the dimming table. */
.reveal-enter-active,
.reveal-leave-active {
  transition: opacity 0.35s ease;
}

.reveal-enter-active .reveal-card {
  transition: transform 0.6s var(--ease-spring);
}

.reveal-enter-from,
.reveal-leave-to {
  opacity: 0;
}

.reveal-enter-from .reveal-card {
  transform: translateY(1.5rem) scale(0.92);
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
