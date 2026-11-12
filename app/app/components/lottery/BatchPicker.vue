<script setup lang="ts">
import {
  flagEmoji,
  getRoundSize,
  getTicketSize,
  type LotteryKind,
  MAX_LOTTERY_TICKETS,
  MAX_TICKETS_PER_TRANSACTION,
  msUntilClose,
  RoundStatus,
  winShare,
} from '@solucky/client';

import { freeIn, MAX_BATCH, type Pattern, pickNumbers } from '../../utils/batch';

/**
 * Many numbers at once: the player gives a range and how many numbers they
 * want, the panel picks free ones (at random, or spread evenly in a lottery),
 * and one purchase buys them all, 20 per transaction, with one wallet
 * approval, or none with quick buy.
 */
const { t } = useI18n();
const intl = useIntlLocale();
const lottery = useLottery();
const {
  kind,
  lottery: isLottery,
  period,
  round,
  myTickets,
  ticketPrice,
  takenNumbers,
  maxNumber,
  numbersLeft,
  config,
  configMissing,
  busy,
  loading,
  error,
} = lottery;
const { connected, balance } = useWallet();
const { country, set: setCountry } = useCountry();
const { rentPerByte } = useRent();
const quick = useQuickBuy();
const sound = useSound();
const now = useNow();

const from = ref(0);
const to = ref(maxNumber.value);
const count = ref(10);
const pattern = ref<Pattern>('random');
/** Bumped by "Pick again". */
const roll = ref(0);
const picks = shallowRef<number[]>([]);

// The range follows the round's highest number until the player changes it.
let toTouched = false;
watch(maxNumber, (max) => {
  if (!toTouched || to.value > max) to.value = max;
});
watch(to, (value) => {
  if (value !== maxNumber.value) toTouched = true;
});

const lo = computed(() => clamp(Math.min(from.value ?? 0, to.value ?? 0)));
const hi = computed(() => clamp(Math.max(from.value ?? 0, to.value ?? 0)));
function clamp(n: number) {
  return Math.min(maxNumber.value, Math.max(0, Math.floor(Number.isFinite(n) ? n : 0)));
}

const sorted = computed(() => sortNumbers(takenNumbers.value));
const free = computed(() => freeIn(lo.value, hi.value, sorted.value));
const wanted = computed(() => Math.min(MAX_BATCH, Math.max(1, Math.floor(count.value ?? 1))));

function pick() {
  picks.value = pickNumbers({
    from: lo.value,
    to: hi.value,
    count: wanted.value,
    taken: sorted.value,
    pattern: isLottery.value ? pattern.value : 'random',
  });
}
// New numbers when the range, the count or the pattern changes; not when
// someone else buys (that would reshuffle the list under the player's eyes).
watch([lo, hi, wanted, pattern, roll, kind], pick, { immediate: true });

/** The picks nobody took since they were drawn. */
const fresh = computed(() => picks.value.filter((n) => !takenNumbers.value.has(n)));
const transactions = computed(() => Math.ceil(fresh.value.length / MAX_TICKETS_PER_TRANSACTION));

const cost = computed(() =>
  ticketPrice.value === null || rentPerByte.value === null
    ? null
    : batchCost({
        price: ticketPrice.value,
        count: fresh.value.length,
        transactions: transactions.value,
        lottery: isLottery.value,
        roundExists: !!round.value,
        ticketSize: getTicketSize(),
        roundSize: getRoundSize(),
        rentPerByte: rentPerByte.value,
      }),
);
const total = computed(() => (ticketPrice.value ?? 0n) * BigInt(fresh.value.length));
const quickPays = computed(() => fresh.value.length > 0 && quick.covers(lottery.sessionCost(fresh.value.length)));

/** Lotteries: the share of the line the picks would win on. Guess: the chance one of them is the number. */
const chance = computed(() => {
  const n = fresh.value.length;
  if (!n) return null;
  if (!isLottery.value) return n / numbersLeft.value;
  return winShare([...sorted.value, ...fresh.value], new Set(fresh.value), maxNumber.value);
});
const chanceShown = useTween(() => chance.value ?? 0, 500);

const left = computed(() =>
  isLottery.value && period.value !== null ? msUntilClose(kind.value as LotteryKind, period.value, now.value) : 0,
);
const roundOpen = computed(() => {
  const status = round.value?.data.status;
  return status === undefined || status === RoundStatus.Open || (!isLottery.value && status === RoundStatus.Closed);
});
// A pause only stops a new round from opening: a round on sale keeps selling.
const paused = computed(() => (config.value?.data.paused ?? false) && !round.value);

const block = computed(() => {
  if (!fresh.value.length && ticketPrice.value !== null) return 'empty' as const;
  return buyBlock({
    price: ticketPrice.value,
    period: period.value,
    loading: loading.value,
    failed: !!error.value,
    notSetUp: configMissing.value,
    paused: paused.value,
    taken: false,
    tooBig: false,
    lottery: isLottery.value,
    msLeft: left.value,
    open: roundOpen.value,
    full: isLottery.value && (round.value?.data.ticketCount ?? 0) + fresh.value.length > MAX_LOTTERY_TICKETS,
    balance: quickPays.value ? null : balance.value,
    cost: cost.value,
    busy: busy.value,
    spinning: false,
  });
});

const buyLabel = computed(() => {
  switch (block.value) {
    case 'empty':
      return t('batch.none');
    case 'notEnough':
      return t('pick.notEnough');
    case 'loading':
      return t('pick.loading');
    case 'unavailable':
      return t('pick.unavailable');
    case 'closing':
      return t('pick.closing');
    case 'over':
      return t('pick.over');
    case 'full':
      return t('pick.full');
  }
  return t('batch.buy', { n: fresh.value.length, price: formatSol(total.value) }, fresh.value.length);
});

const patterns = computed(() => [
  { label: t('batch.random'), value: 'random', icon: 'i-lucide-shuffle' },
  { label: t('batch.spread'), value: 'spread', icon: 'i-lucide-ruler' },
]);

const countries = computed(() => countryOptions(intl.value, t('country.private')));
const selectedCountry = computed({
  get: () => countries.value.find((c) => c.value === country.value) ?? countries.value[0],
  set: (option) => setCountry(option?.value ?? null),
});

// The strip: the whole line, the range, and the picks on it.
const at = (n: number) => `${(n / Math.max(1, maxNumber.value)) * 100}%`;
const mine = computed(() => myTickets.value.map((ticket) => ticket.data.number).slice(0, 300));

function wholeRange() {
  from.value = 0;
  to.value = maxNumber.value;
}

const burst = useTemplateRef<{ fire: () => void }>('burst');

async function buy() {
  if (block.value !== null) {
    sound.play('wrong');
    return;
  }
  sound.play('commit');
  const code = country.value && COUNTRY_CODES.includes(country.value) ? country.value : null;
  const signature = await lottery.buyMany(fresh.value, code);
  sound.play(signature ? 'committed' : 'wrong');
  if (signature) {
    burst.value?.fire();
    roll.value++;
  }
}
</script>

<template>
  <div class="grid gap-5 md:grid-cols-2 md:gap-6">
    <div class="min-w-0 space-y-4 rounded-[1.5rem] p-5 shadow-(--neu-in-sm)">
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="t('batch.from')">
          <UInputNumber v-model="from" :min="0" :max="maxNumber" class="w-full" />
        </UFormField>
        <UFormField :label="t('batch.to')">
          <UInputNumber v-model="to" :min="0" :max="maxNumber" class="w-full" />
        </UFormField>
      </div>
      <UFormField :label="t('batch.count')" :hint="t('batch.upTo', { n: MAX_BATCH })">
        <UInputNumber v-model="count" :min="1" :max="MAX_BATCH" class="w-full" />
      </UFormField>
      <UTabs
        v-if="isLottery"
        v-model="pattern"
        :items="patterns"
        :content="false"
        variant="pill"
        size="xs"
        color="neutral"
      />
      <p v-if="isLottery" class="text-xs text-pretty text-muted">
        {{ pattern === 'spread' ? t('batch.spreadHint') : t('batch.randomHint') }}
      </p>
      <p v-if="free < wanted" class="text-xs font-medium text-warning">
        {{ t('batch.onlyFree', { n: formatNumber(free) }, free) }}
      </p>
      <div class="flex flex-wrap gap-2">
        <UButton
          icon="i-lucide-dices"
          :label="t('batch.again')"
          color="secondary"
          variant="outline"
          size="sm"
          @click="roll++"
        />
        <UButton
          icon="i-lucide-move-horizontal"
          :label="t('batch.whole')"
          color="neutral"
          variant="ghost"
          size="sm"
          :disabled="lo === 0 && hi === maxNumber"
          @click="wholeRange"
        />
      </div>
    </div>

    <div class="min-w-0 space-y-4">
      <div class="strip" dir="ltr" aria-hidden="true">
        <span class="strip-range" :style="{ left: at(lo), width: `calc(${at(hi)} - ${at(lo)} + 2px)` }" />
        <i v-for="n in mine" :key="`m${n}`" class="strip-mine" :style="{ left: at(n) }" />
        <i v-for="n in fresh" :key="n" class="strip-pick" :style="{ left: at(n) }" />
      </div>
      <div class="flex justify-between font-mono text-[0.65rem] text-muted tabular-nums" dir="ltr">
        <span>0</span>
        <span>{{ formatNumber(maxNumber) }}</span>
      </div>

      <div>
        <p class="kicker mb-2 text-[0.65rem]">{{ t('batch.picked', { n: fresh.length }, fresh.length) }}</p>
        <ul
          class="picks flex max-h-32 flex-wrap gap-1.5 overflow-y-auto"
          dir="ltr"
          :aria-label="t('batch.picked', { n: fresh.length }, fresh.length)"
        >
          <li
            v-for="n in picks"
            :key="n"
            class="pick font-mono text-xs tabular-nums"
            :class="{ gone: takenNumbers.has(n) }"
          >
            {{ formatNumber(n) }}
          </li>
        </ul>
      </div>

      <div class="space-y-1 rounded-[1.25rem] px-4 py-3 shadow-(--neu-in-sm)">
        <p class="flex items-baseline justify-between gap-3">
          <span class="kicker text-[0.65rem]">{{ isLottery ? t('batch.share') : t('batch.chance') }}</span>
          <LotteryPercent
            :ratio="chance === null ? null : chanceShown"
            class="odds-value font-mono text-xl tabular-nums"
          />
        </p>
        <p class="text-xs text-pretty text-muted">
          {{ isLottery ? t('batch.shareHint') : t('guess.perGuess', { n: formatNumber(numbersLeft) }) }}
        </p>
      </div>

      <USelectMenu
        v-model="selectedCountry"
        :items="countries"
        label-key="label"
        :search-input="{ placeholder: t('pick.searchCountry') }"
        class="w-full"
        :aria-label="t('pick.country')"
      >
        <template #leading>
          <span>{{ selectedCountry?.flag ?? flagEmoji(null) }}</span>
        </template>
        <template #item-leading="{ item }">
          <span>{{ item.flag }}</span>
        </template>
      </USelectMenu>
    </div>

    <ClientOnly>
      <div class="space-y-2 md:col-span-2">
        <div class="relative">
          <UButton
            v-if="connected"
            size="xl"
            block
            :loading="busy"
            :disabled="block !== null && block !== 'busy'"
            class="bg-lucky buy rounded-2xl py-4 text-base font-medium text-white shadow-(--neu-accent) hover:opacity-95 active:shadow-(--neu-in-sm) disabled:opacity-50"
            icon="i-lucide-layers"
            @click="buy"
          >
            {{ buyLabel }}
          </UButton>
          <WalletButton v-else block />
          <LotteryBurst ref="burst" />
        </div>
        <p v-if="connected && fresh.length" class="text-center text-xs text-pretty text-muted">
          <template v-if="quickPays">{{ t('batch.viaQuick') }}</template>
          <template v-else-if="transactions > 1">{{
            t('batch.viaWallet', { n: transactions }, transactions)
          }}</template>
          <template v-if="cost !== null"> {{ t('batch.total', { sol: formatSol(cost, 4) }) }}</template>
        </p>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.strip {
  position: relative;
  height: 2.5rem;
  overflow: hidden;
  border-radius: 0.9rem;
  box-shadow: var(--neu-in);
}

.strip-range {
  position: absolute;
  inset-block: 0;
  background: color-mix(in oklab, var(--ui-primary) 12%, transparent);
  box-shadow:
    inset 1px 0 0 var(--ui-primary),
    inset -1px 0 0 var(--ui-primary);
  transition:
    left 0.3s var(--ease-out-expo),
    width 0.3s var(--ease-out-expo);
}

.strip-pick,
.strip-mine {
  position: absolute;
  width: 2px;
  margin-inline-start: -1px;
  border-radius: 1px;
}

.strip-pick {
  inset-block: 0.45rem;
  background: var(--ui-secondary);
}

.strip-mine {
  inset-block: 1rem;
  background: var(--ui-primary);
}

/* The picked numbers, as small keys. */
.pick {
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  color: var(--ui-text-highlighted);
  background: var(--ui-bg);
  box-shadow: var(--neu-xs);
}

.pick.gone {
  color: var(--ui-error);
  text-decoration: line-through;
  box-shadow: var(--neu-in-sm);
}

.picks {
  padding: 0.25rem;
}

.odds-value {
  color: var(--ui-secondary);
}

.buy {
  justify-content: center;
  letter-spacing: 0.02em;
}

@media (prefers-reduced-motion: reduce) {
  .strip-range {
    transition: none;
  }
}
</style>
