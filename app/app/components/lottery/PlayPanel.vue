<script setup lang="ts">
import {
  flagEmoji,
  GAME_SLUGS,
  getRoundSize,
  getTicketSize,
  type LotteryKind,
  MAX_LOTTERY_TICKETS,
  msUntilClose,
  prizeFor,
  RoundStatus,
} from '@solucky/client';

/**
 * Where a number is picked and bought, dressed as the ticket it becomes: the
 * number on slot-machine reels, and in the lotteries the number line with the
 * stretch the number would win on and its odds before you buy. Keys, a pad, a
 * lucky dip and the best free spot pick it; on phones the buy button follows
 * the player down the page until its own place scrolls into view.
 */
const { t } = useI18n();
const intl = useIntlLocale();
const lottery = useLottery();
const {
  kind,
  lottery: isLottery,
  period,
  pot,
  round,
  myTickets,
  ticketPrice,
  takenNumbers,
  maxNumber,
  unchecked,
  numbersLeft,
  config,
  configMissing,
  busy,
  loading,
  error,
} = lottery;
const { connected, balance } = useWallet();
const { country, set: setCountry } = useCountry();
const live = useLive();
const sound = useSound();
const now = useNow();

const digits = ref('0');
const number = computed(() => Number(digits.value));
const maxDigits = computed(() => String(maxNumber.value).length);
const taken = computed(() => takenNumbers.value.has(number.value));
const tooBig = computed(() => number.value > maxNumber.value);
const left = computed(() =>
  isLottery.value && period.value !== null ? msUntilClose(kind.value as LotteryKind, period.value, now.value) : 0,
);

// If you buy this ticket, the pot grows by one more ticket.
const prizeIfYouWin = computed(() => prizeFor(pot.value + (ticketPrice.value ?? 0n)));
const prizeShown = useTween(() => Number(prizeIfYouWin.value));

const paused = computed(() => config.value?.data.paused ?? false);

// The number line: the round's numbers in order, yours, and what the picked number would win on.
const sorted = computed(() => sortNumbers(takenNumbers.value));
const mine = computed(() => myTickets.value.map((ticket) => ticket.data.number));
const preview = computed(() => {
  if (!isLottery.value || taken.value || tooBig.value) return null;
  const { lo, hi } = territory(sorted.value, number.value, maxNumber.value);
  return { lo, hi, share: (hi - lo + 1) / (maxNumber.value + 1) };
});
const shareShown = useTween(() => preview.value?.share ?? 0, 500);

// Each ticket is its own account; its rent comes back when it is closed.
const { rentPerByte } = useRent();
const ticketRent = computed(() =>
  rentPerByte.value === null ? null : (128n + BigInt(getTicketSize())) * rentPerByte.value,
);
const cost = computed(() =>
  ticketPrice.value === null || rentPerByte.value === null
    ? null
    : purchaseCost({
        price: ticketPrice.value,
        lottery: isLottery.value,
        roundExists: !!round.value,
        ticketSize: getTicketSize(),
        roundSize: getRoundSize(),
        rentPerByte: rentPerByte.value,
      }),
);

const spinning = ref(false);

/** One number on the reels, or many picked from a range. */
const mode = ref<'one' | 'many'>('one');
const modes = computed(() => [
  { label: t('batch.one'), value: 'one', icon: 'i-lucide-ticket' },
  { label: t('batch.many'), value: 'many', icon: 'i-lucide-layers' },
]);

// Quick buy pays when it is on and covers this ticket: the wallet's balance doesn't matter then.
const quick = useQuickBuy();
const quickPays = computed(() => quick.covers(lottery.sessionCost(1)));

// A Guess round takes guesses while its last batch waits for the check (the
// program refuses them once the check's slot is out); a found number ends it.
const roundOpen = computed(() => {
  const status = round.value?.data.status;
  return status === undefined || status === RoundStatus.Open || (!isLottery.value && status === RoundStatus.Closed);
});

const block = computed(() =>
  buyBlock({
    price: ticketPrice.value,
    period: period.value,
    loading: loading.value,
    failed: !!error.value,
    notSetUp: configMissing.value,
    paused: paused.value,
    taken: taken.value,
    tooBig: tooBig.value,
    lottery: isLottery.value,
    msLeft: left.value,
    open: roundOpen.value,
    full: isLottery.value && (round.value?.data.ticketCount ?? 0) >= MAX_LOTTERY_TICKETS,
    balance: quickPays.value ? null : balance.value,
    cost: cost.value,
    busy: busy.value,
    spinning: spinning.value,
  }),
);

const buyLabel = computed(() => {
  switch (block.value) {
    case 'taken':
      return t('pick.takenToday', { number: formatNumber(number.value) });
    case 'outOfRange':
      return t('pick.outOfRange');
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
  const price = ticketPrice.value === null ? '…' : formatSol(ticketPrice.value);
  return t('pick.buy', { number: formatNumber(number.value), price });
});

const countries = computed(() => countryOptions(intl.value, t('country.private')));
const selectedCountry = computed({
  get: () => countries.value.find((c) => c.value === country.value) ?? countries.value[0],
  set: (option) => setCountry(option?.value ?? null),
});

function press(digit: number) {
  if (spinning.value) return;
  live.touchKeypad();
  sound.play('click');
  const next = digits.value === '0' ? String(digit) : digits.value + digit;
  if (next.length > maxDigits.value || Number(next) > maxNumber.value) {
    sound.play('wrong');
    return;
  }
  digits.value = next;
}

function backspace() {
  if (spinning.value) return;
  live.touchKeypad();
  sound.play('click');
  digits.value = digits.value.length > 1 ? digits.value.slice(0, -1) : '0';
}

function reset() {
  if (spinning.value) return;
  live.touchKeypad();
  sound.play('click');
  digits.value = '0';
}

/** A number picked on the line: it follows the pointer, and clicks once when let go. */
function fromLine(picked: number) {
  if (spinning.value) return;
  live.touchKeypad();
  digits.value = String(Math.min(maxNumber.value, Math.max(0, picked)));
}

/** Spins the reels and lands on `pick`. */
async function spinTo(pick: number) {
  live.touchKeypad();
  sound.play('click');
  // The reels spin at the final width, so they stop where the number will be.
  digits.value = '1'.repeat(String(pick).length);
  spinning.value = true;
  await new Promise((resolve) => setTimeout(resolve, 950));
  digits.value = String(pick);
  spinning.value = false;
  sound.play('commit');
}

/** Lands on a random number nobody holds yet in this round. */
async function luckyDip() {
  if (spinning.value) return;
  let pick: number | null = null;
  for (let i = 0; i < 100 && pick === null; i++) {
    const candidate = Math.floor(Math.random() * (maxNumber.value + 1));
    if (!takenNumbers.value.has(candidate)) pick = candidate;
  }
  if (pick !== null) await spinTo(pick);
}

/** Lands on the free number that would win the largest stretch of the line right now. */
async function bestPick() {
  if (spinning.value) return;
  const spot = bestSpot(sorted.value, maxNumber.value);
  if (spot === null) await luckyDip();
  else await spinTo(spot);
}

const burstMain = useTemplateRef<{ fire: () => void }>('burstMain');
const burstBar = useTemplateRef<{ fire: () => void }>('burstBar');

/** Buys the number; `fromBar` when the phone buy bar was pressed, so the celebration starts there. */
async function buy(fromBar = false) {
  if (block.value !== null) {
    sound.play('wrong');
    return;
  }
  sound.play('commit');
  // A code the picker doesn't know (the host may report one) stays private.
  const code = country.value && COUNTRY_CODES.includes(country.value) ? country.value : null;
  const signature = await lottery.buy(number.value, code);
  sound.play(signature ? 'committed' : 'wrong');
  if (signature) (fromBar ? burstBar : burstMain).value?.fire();
}

const panel = ref<HTMLElement>();

function onKey(event: KeyboardEvent) {
  // Many numbers are picked with their own fields.
  if (mode.value !== 'one') return;
  const target = event.target as HTMLElement | null;
  if (target?.closest('input, textarea, [contenteditable], [role="combobox"], [role="dialog"]')) return;
  // Enter belongs to whatever control has focus outside the panel (a link, a
  // toast's Cancel…); in the panel, or with nothing focused, it buys.
  const elsewhere =
    !!target && target !== document.body && !panel.value?.contains(target) && !!target.closest('a, button, [role]');
  if (/^\d$/.test(event.key)) press(Number(event.key));
  else if (event.key === 'Backspace') backspace();
  else if (event.key === 'Escape') reset();
  else if (event.key === 'Enter' && !elsewhere && connected.value) void buy();
  else return;
  event.preventDefault();
}

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

// On phones, the buy bar stays at the bottom of the screen until the panel's own button scrolls into view.
const buyArea = useTemplateRef<HTMLElement>('buyArea');
const buyBelow = ref(false);
let observer: IntersectionObserver | undefined;
watch(buyArea, (el) => {
  observer?.disconnect();
  if (!el) return;
  observer = new IntersectionObserver(([entry]) => {
    buyBelow.value = !!entry && !entry.isIntersecting && entry.boundingClientRect.top > 0;
  });
  observer.observe(el);
});
onBeforeUnmount(() => observer?.disconnect());

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
</script>

<template>
  <LotterySurface hero>
    <div ref="panel" class="grid gap-6 p-6 sm:p-7 md:grid-cols-[1.25fr_1fr] md:gap-7">
      <header class="flex items-end justify-between gap-3 md:col-span-2">
        <h2 class="leading-none">
          <span class="kicker block">{{ t('pick.kicker') }}</span>
          <span class="mt-1.5 block text-3xl font-light tracking-[0.24em] text-highlighted uppercase">
            {{ t('pick.title') }}
          </span>
        </h2>
        <p class="text-end leading-none">
          <span class="kicker block">{{ t('pick.win') }}</span>
          <span class="readout mt-1.5 block text-3xl" dir="ltr"> ◎{{ formatSol(Math.round(prizeShown), 3) }} </span>
        </p>
      </header>

      <UTabs
        v-model="mode"
        :items="modes"
        :content="false"
        variant="pill"
        size="sm"
        color="neutral"
        class="md:col-span-2"
      />

      <LotteryBatchPicker v-if="mode === 'many'" class="md:col-span-2" />

      <div v-if="mode === 'one'" class="min-w-0 space-y-4">
        <!-- The ticket: the number on reels in a window pressed into it, between its header and its foot. -->
        <div class="ticket" :class="{ bad: taken || tooBig, rolling: spinning }">
          <div class="ticket-head">
            <span class="font-mono font-semibold tracking-[0.2em]">S☉LUCKY</span>
            <span class="truncate font-mono" dir="ltr">
              {{ t(`games.${GAME_SLUGS[kind]}.short`) }}
              <template v-if="period !== null"> · {{ roundTitle(kind, period) }}</template>
            </span>
          </div>
          <div class="ticket-window" :style="{ '--n': formatNumber(number).length }">
            <span class="sr-only" aria-live="polite">{{ formatNumber(number) }}</span>
            <LotteryReels :value="number" :spinning="spinning" :invalid="taken || tooBig" />
          </div>
          <div class="ticket-foot">
            <span v-if="taken" class="font-medium text-error">{{ t('pick.taken') }}</span>
            <span v-else>{{ t('pick.range', { max: formatNumber(maxNumber) }) }}</span>
          </div>
        </div>

        <!-- Lotteries: where the number sits among the others, and its odds before buying. -->
        <template v-if="isLottery">
          <LotteryNumberLine
            :sorted="sorted"
            :mine="mine"
            :value="number"
            :max="maxNumber"
            :valid="!taken && !tooBig"
            @pick="fromLine"
            @done="sound.play('click')"
          />
          <div class="odds" :class="{ off: !preview }">
            <div class="flex items-baseline justify-between gap-3">
              <span class="kicker text-[0.65rem]">{{ t('pick.share', { number: formatNumber(number) }) }}</span>
              <span class="odds-value font-mono text-2xl tabular-nums">
                {{ preview ? formatPercent(shareShown, intl) : '—' }}
              </span>
            </div>
            <div
              class="gauge mt-3"
              :style="{ '--p': preview ? shareShown : 0, '--c': 'var(--ui-secondary)' }"
              aria-hidden="true"
            >
              <i />
            </div>
            <p class="mt-2 text-xs text-pretty text-muted">
              <template v-if="preview">
                {{ t('pick.wins', { lo: formatNumber(preview.lo), hi: formatNumber(preview.hi) }) }}
              </template>
              <template v-else>{{ t('pick.taken') }}</template>
            </p>
          </div>
        </template>

        <!-- Guess: every guess has the same odds at the next check. -->
        <div v-else class="odds space-y-2">
          <p class="flex items-baseline justify-between gap-3">
            <span class="kicker text-[0.65rem]">{{ t('stat.winChance') }}</span>
            <span class="odds-value font-mono text-lg tabular-nums" dir="ltr">
              1 : {{ formatNumber(numbersLeft) }}
            </span>
          </p>
          <p class="text-xs text-pretty text-muted">{{ t('guess.perGuess', { n: formatNumber(numbersLeft) }) }}</p>
          <div v-if="unchecked > 0 && round" class="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span class="min-w-0 flex-1">{{ t('guess.checkHint') }}</span>
            <ClientOnly>
              <UButton
                v-if="connected"
                :label="t('guess.checkNow')"
                icon="i-lucide-scan-search"
                size="xs"
                color="secondary"
                variant="soft"
                :loading="busy"
                @click="lottery.settle(round)"
              />
            </ClientOnly>
          </div>
        </div>
      </div>

      <div v-if="mode === 'one'" class="flex min-w-0 flex-col gap-3">
        <!-- A keypad: 1 2 3 on top, read left to right, in every language. -->
        <div class="keypad grid flex-1 grid-cols-3 gap-3" dir="ltr" role="group" :aria-label="t('pick.pad')">
          <UButton
            v-for="key in KEYS"
            :key="key"
            :label="String(key)"
            color="neutral"
            variant="soft"
            size="lg"
            block
            class="keycap py-3 font-mono text-xl"
            @click="press(key)"
          />
          <UButton
            icon="i-lucide-rotate-ccw"
            :aria-label="t('pick.reset')"
            color="neutral"
            variant="ghost"
            size="lg"
            block
            class="keycap keycap-quiet"
            @click="reset"
          />
          <UButton
            label="0"
            color="neutral"
            variant="soft"
            size="lg"
            block
            class="keycap py-3 font-mono text-xl"
            @click="press(0)"
          />
          <UButton
            icon="i-lucide-delete"
            :aria-label="t('pick.delete')"
            color="neutral"
            variant="ghost"
            size="lg"
            block
            class="keycap keycap-quiet"
            @click="backspace"
          />
        </div>

        <div class="grid gap-2" :class="isLottery ? 'grid-cols-2' : 'grid-cols-1'">
          <UButton
            icon="i-lucide-dices"
            :label="t('pick.dip')"
            color="secondary"
            variant="outline"
            block
            class="quick"
            :loading="spinning"
            @click="luckyDip"
          />
          <UTooltip v-if="isLottery" :text="t('pick.bestHint')">
            <UButton
              icon="i-lucide-crosshair"
              :label="t('pick.best')"
              color="primary"
              variant="outline"
              block
              class="quick quick-best"
              :disabled="spinning"
              @click="bestPick"
            />
          </UTooltip>
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

      <div class="space-y-3 md:col-span-2">
        <UAlert
          v-if="configMissing"
          color="warning"
          variant="subtle"
          icon="i-lucide-construction"
          :title="t('pick.notSetUp')"
        />
        <UAlert v-else-if="paused" color="warning" variant="subtle" icon="i-lucide-pause" :title="t('pick.paused')" />

        <ClientOnly>
          <div v-if="mode === 'one'" ref="buyArea" class="relative">
            <UButton
              v-if="connected"
              size="xl"
              block
              :loading="busy"
              :disabled="block !== null && block !== 'busy'"
              class="bg-lucky buy rounded-2xl py-4 text-base font-medium text-white shadow-(--neu-accent) hover:opacity-95 active:shadow-(--neu-in-sm) disabled:opacity-50"
              icon="i-lucide-rocket"
              @click="buy()"
            >
              {{ buyLabel }}
            </UButton>
            <WalletButton v-else block />
            <LotteryBurst ref="burstMain" />
          </div>

          <!-- Phones: the buy bar, until the button above scrolls into view. -->
          <Teleport to="body">
            <Transition name="bar">
              <div v-if="buyBelow && mode === 'one'" class="buy-bar lg:hidden">
                <div class="flex items-center gap-3">
                  <span class="readout min-w-0 shrink-0 font-mono text-lg" dir="ltr">
                    {{ formatNumber(number) }}
                  </span>
                  <div class="relative min-w-0 flex-1">
                    <UButton
                      v-if="connected"
                      size="lg"
                      block
                      :loading="busy"
                      :disabled="block !== null && block !== 'busy'"
                      class="bg-lucky buy truncate rounded-xl font-medium text-white shadow-(--neu-accent) disabled:opacity-50"
                      icon="i-lucide-rocket"
                      @click="buy(true)"
                    >
                      {{ buyLabel }}
                    </UButton>
                    <WalletButton v-else block />
                    <LotteryBurst ref="burstBar" />
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
          <LotteryQuickBuy v-if="connected" />
        </ClientOnly>
        <p v-if="mode === 'one'" class="text-center text-xs text-muted">
          {{ t('pick.keys') }}
          <template v-if="ticketRent !== null">
            {{ t('pick.rent', { rent: formatSol(ticketRent, 5) }) }}
          </template>
        </p>
      </div>
    </div>
  </LotterySurface>
</template>

<style scoped>
/* The ticket: a card standing out of the panel, its number in a window pressed into it. */
.ticket {
  --edge: transparent;
  border-radius: 1.5rem;
  background: var(--ui-bg);
  box-shadow: var(--neu-sm);
}

.ticket.rolling {
  --edge: color-mix(in oklab, var(--ui-secondary) 60%, transparent);
}

.ticket.bad {
  --edge: color-mix(in oklab, var(--ui-error) 70%, transparent);
}

.ticket-head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem 0;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--ui-text-muted);
}

.ticket-window {
  container-type: inline-size;
  display: grid;
  place-items: center;
  min-height: 6.5rem;
  margin: 0.7rem 0.9rem 0;
  padding: 0.9rem 0.75rem;
  border-radius: 1.1rem;
  box-shadow:
    var(--neu-in),
    inset 0 0 0 1.5px var(--edge);
  transition: box-shadow 0.3s;
}

/* The reels fill the window: as large as the number's width allows. */
.ticket-window :deep(.reels) {
  font-size: min(4.25rem, calc(100cqw / (var(--n) * 1.02 + 0.6)));
}

.ticket-foot {
  padding: 0.7rem 1rem 0.85rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}

.odds {
  padding: 0.9rem 1.05rem;
  border-radius: 1.25rem;
  box-shadow: var(--neu-in-sm);
  transition: opacity 0.3s;
}

.odds.off {
  opacity: 0.7;
}

.odds-value {
  color: var(--ui-secondary);
}

/* Keys standing out of the panel: they sink when pressed. */
.keycap {
  justify-content: center;
  border-radius: 1.1rem;
  color: var(--ui-text-highlighted);
  background: var(--ui-bg);
  box-shadow: var(--neu-sm);
  transition:
    box-shadow 0.15s ease,
    color 0.2s ease;
}

.keycap:hover {
  color: var(--ui-primary);
  background: var(--ui-bg);
}

.keycap:active {
  box-shadow: var(--neu-in-sm);
}

.keypad {
  grid-auto-rows: minmax(3.25rem, 1fr);
}

.keycap-quiet {
  color: var(--ui-text-muted);
}

.quick,
.buy {
  justify-content: center;
}

.buy {
  letter-spacing: 0.02em;
}

/* The phone buy bar: a panel floating at the bottom edge, above the home indicator. */
.buy-bar {
  position: fixed;
  inset-inline: 0.75rem;
  bottom: calc(0.75rem + env(safe-area-inset-bottom));
  z-index: 40;
  padding: 0.6rem 0.6rem 0.6rem 1.1rem;
  border-radius: 1.5rem;
  background: var(--ui-bg);
  box-shadow:
    var(--neu-lg),
    0 0 0 1px var(--ui-border-muted);
}

/*
 * A dialog (the header's menu, the wallet picker) hides the rest of the page
 * from assistive tech with `aria-hidden`; the bar, which sits above the page,
 * steps aside on screen too instead of floating over the dialog.
 */
.buy-bar[aria-hidden='true'] {
  visibility: hidden;
}

.bar-enter-active,
.bar-leave-active {
  transition:
    transform 0.4s var(--ease-out-expo),
    opacity 0.3s ease;
}

.bar-enter-from,
.bar-leave-to {
  transform: translateY(120%);
  opacity: 0;
}
</style>
