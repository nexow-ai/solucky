<script setup lang="ts">
import { closestNumber, GameKind } from '@solucky/client';

/**
 * A practice draw on today's daily round. The pins are the round's real
 * tickets; the visitor places one more, sees the numbers closer to it than
 * to any other ticket (the share of the draw it would win), and draws a
 * number in the browser to see which ticket is closest. Nothing is sent to
 * Solana. Browser only.
 */
const { t } = useI18n();
const intl = useIntlLocale();
const now = useNow();
const { flare } = useSolarFlares();
const { takenNumbers, maxNumber, loading } = useLottery(GameKind.Daily);

const sorted = computed(() => sortNumbers(takenNumbers.value));
const max = computed(() => maxNumber.value);

const mine = ref(Math.floor(max.value / 2));
const touched = ref(false);
// Start on the free number that would win the most right now, unless the visitor already moved.
watch(
  loading,
  (busy) => {
    if (busy || touched.value) return;
    mine.value = bestSpot(sorted.value, max.value) ?? Math.floor(max.value / 2);
  },
  { immediate: true },
);
function place(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return;
  touched.value = true;
  mine.value = Math.max(0, Math.min(max.value, Math.round(value)));
}

const taken = computed(() => takenNumbers.value.has(mine.value));
const share = computed(() => (taken.value ? 0 : shareOf(sorted.value, mine.value, max.value)));
const zone = computed(() => territory(sorted.value, mine.value, max.value));

/** A number's place on the line, in % from its start. */
const x = (n: number) => Math.round((n / Math.max(1, max.value)) * 10_000) / 100;
const pins = computed(() => sorted.value.map((n, i) => ({ n, x: x(n), tall: i % 2 === 0 })));
// Where one ticket's numbers end and the next one's begin.
const borders = computed(() => {
  const all = sortNumbers([...sorted.value, mine.value]);
  return all.slice(1).map((n, i) => x((all[i]! + n) / 2));
});

// The practice draw.
const reduced = import.meta.client && matchMedia('(prefers-reduced-motion: reduce)').matches;
const rolling = ref(false);
const drawn = ref<number | null>(null);
const winner = ref<number | null>(null);
const record = reactive({ wins: 0, draws: 0 });
const burst = useTemplateRef<{ fire: (count?: number) => void }>('burst');

function random(limit: number) {
  const [value] = crypto.getRandomValues(new Uint32Array(1));
  return value! % (limit + 1);
}

async function draw() {
  if (rolling.value || taken.value) return;
  const number = random(max.value);
  rolling.value = true;
  drawn.value = number;
  winner.value = null;
  await new Promise((resolve) => setTimeout(resolve, reduced ? 0 : 1200));
  rolling.value = false;
  winner.value = closestNumber([...sorted.value, mine.value], number);
  record.draws++;
  if (winner.value === mine.value) {
    record.wins++;
    burst.value?.fire();
    flare(dialAngle(now.value));
  }
}
// Moving the pin starts a new practice.
watch(mine, () => {
  drawn.value = null;
  winner.value = null;
});

const result = computed(() => {
  if (rolling.value || winner.value === null || drawn.value === null) return null;
  return winner.value === mine.value
    ? { won: true, text: t('home.practice.won', { drawn: formatNumber(drawn.value) }) }
    : { won: false, text: t('home.practice.lost', { drawn: formatNumber(drawn.value), number: formatNumber(winner.value) }) };
});
</script>

<template>
  <div class="practice relative overflow-hidden rounded-[1.5rem] bg-default/80 p-5 ring ring-default backdrop-blur-md sm:p-8">
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
      <div>
        <p class="kicker flex items-center gap-2 text-[0.65rem] text-secondary">
          <UIcon name="i-lucide-flask-conical" class="size-3.5" />
          {{ t('home.practice.notice') }}
        </p>
        <h3 class="mt-3 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">{{ t('home.practice.title') }}</h3>
        <p class="mt-2 max-w-2xl text-pretty text-muted">{{ t('home.practice.lead') }}</p>
      </div>
      <!-- The drawn number, rolling in. -->
      <div class="@container text-center">
        <p class="kicker text-[0.6rem]">{{ t('home.practice.drawn') }}</p>
        <div class="mt-2" :class="drawn === null ? 'opacity-30' : ''">
          <LotteryReels :value="drawn ?? 0" :spinning="rolling" />
        </div>
      </div>
    </div>

    <!-- The number line: decorative, the share and the result below say it in words. A ruler: left to right in every language. -->
    <div class="mt-8" dir="ltr" aria-hidden="true">
      <div class="line relative h-32">
        <div
          class="zone absolute bottom-6 h-11"
          :class="taken ? 'bg-error/15' : 'bg-secondary/20 ring ring-secondary/60'"
          :style="{ left: `${x(zone.lo)}%`, width: `max(2px, ${x(zone.hi) - x(zone.lo)}%)` }"
        />
        <div class="absolute inset-x-0 bottom-6 h-px bg-(--ui-border-accented)" />
        <span
          v-for="(border, i) in borders"
          :key="`b${i}`"
          class="absolute bottom-[1.1rem] h-4 w-px bg-(--ui-text-dimmed)"
          :style="{ left: `${border}%` }"
        />
        <span
          v-for="pin in pins"
          :key="pin.n"
          class="pin absolute bottom-6 w-px bg-primary/70"
          :class="pin.tall ? 'h-9' : 'h-6'"
          :style="{ left: `${pin.x}%` }"
        >
          <span class="dot absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary text-primary" :class="winner === pin.n ? 'winner' : ''" />
        </span>
        <!-- Yours. -->
        <span class="mine absolute bottom-6 h-16 w-0.5 -translate-x-1/2 bg-secondary" :style="{ left: `${x(mine)}%` }">
          <span
            class="dot absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-secondary text-secondary glow-secondary"
            :class="winner === mine ? 'winner' : ''"
          />
        </span>
        <!-- The drawn number, dropping onto the line. -->
        <span
          v-if="drawn !== null && !rolling"
          :key="drawn"
          class="needle absolute top-0 bottom-6 w-px -translate-x-1/2 bg-(--ui-text-highlighted)"
          :style="{ left: `${x(drawn)}%` }"
        >
          <span
            class="absolute -top-0.5 left-1/2 size-0 -translate-x-1/2 border-x-[6px] border-t-[9px] border-x-transparent border-t-(--ui-text-highlighted)"
          />
        </span>
      </div>
      <div class="flex justify-between font-mono text-[0.65rem] text-dimmed">
        <span>0</span>
        <span>{{ formatNumber(max) }}</span>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div class="space-y-3">
        <label class="kicker text-[0.6rem]" for="practice-number">{{ t('home.practice.yourNumber') }}</label>
        <div class="flex flex-wrap items-center gap-3">
          <UInputNumber
            id="practice-number"
            :model-value="mine"
            :min="0"
            :max="max"
            :format-options="{ useGrouping: false }"
            class="w-44"
            :ui="{ base: 'font-mono tabular-nums' }"
            @update:model-value="place"
          />
          <UButton
            v-if="sorted.length"
            :label="t('home.practice.best')"
            icon="i-lucide-crosshair"
            color="neutral"
            variant="outline"
            @click="place(bestSpot(sorted, max))"
          />
        </div>
        <USlider
          :model-value="mine"
          :min="0"
          :max="max"
          :step="Math.max(1, Math.round(max / 2000))"
          color="secondary"
          :aria-label="t('home.practice.yourNumber')"
          @update:model-value="(value) => place(Array.isArray(value) ? value[0] : value)"
        />
      </div>
      <div class="relative">
        <LotteryBurst ref="burst" />
        <UButton
          :label="t('home.practice.draw')"
          icon="i-lucide-dices"
          size="xl"
          :loading="rolling"
          :disabled="taken"
          class="bg-lucky shadow-neon shine w-full justify-center font-semibold tracking-wide text-white hover:opacity-90 lg:w-auto"
          @click="draw"
        />
      </div>
    </div>

    <dl class="mt-6 grid gap-4 border-t border-default pt-5 sm:grid-cols-3">
      <div>
        <dt class="kicker text-[0.6rem]">{{ t('home.practice.share') }}</dt>
        <dd class="mt-1 font-mono text-2xl font-bold text-secondary tabular-nums">{{ formatPercent(share, intl) }}</dd>
      </div>
      <div>
        <dt class="kicker text-[0.6rem]">{{ t('home.practice.today') }}</dt>
        <dd class="mt-1 font-mono text-2xl font-bold text-highlighted tabular-nums">{{ formatNumber(sorted.length) }}</dd>
      </div>
      <div>
        <dt class="kicker text-[0.6rem]">{{ t('home.practice.record') }}</dt>
        <dd class="mt-1 font-mono text-2xl font-bold text-highlighted tabular-nums" dir="ltr">
          {{ record.wins }} / {{ record.draws }}
        </dd>
      </div>
    </dl>

    <p class="mt-4 min-h-6 text-sm text-pretty" aria-live="polite">
      <span v-if="taken" class="text-error">{{ t('home.practice.taken') }}</span>
      <span v-else-if="result" :class="result.won ? 'font-semibold text-secondary' : 'text-toned'">{{ result.text }}</span>
      <span v-else-if="!loading && !sorted.length" class="text-muted">{{ t('home.practice.alone') }}</span>
    </p>
  </div>
</template>

<style scoped>
.mine,
.zone {
  transition:
    left 0.5s var(--ease-out-expo),
    width 0.5s var(--ease-out-expo);
}

.needle {
  animation: drop 0.55s var(--ease-spring) both;
}

.winner {
  animation: win 0.9s ease-out 3;
}

@keyframes drop {
  from {
    opacity: 0;
    translate: 0 -40px;
  }
}

@keyframes win {
  50% {
    scale: 2;
    box-shadow: 0 0 14px 4px currentColor;
  }
}
</style>
