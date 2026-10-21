<script setup lang="ts">
import { flagEmoji, getTicketSize, msUntilClose } from '@solucky/client';

const lottery = useLottery();
const { today, prize, myTickets, tickets, ticketPrice, takenNumbers, config, configMissing, busy } = lottery;
const { connected, balance } = useWallet();
const { country, set: setCountry } = useCountry();
const live = useLive();
const sound = useSound();
const now = useNow();

const digits = ref('0');
const number = computed(() => Number(digits.value));
const maxNumber = computed(() => config.value?.data.maxNumber ?? 1_000_000_000);
const maxDigits = computed(() => String(maxNumber.value).length);
const taken = computed(() => takenNumbers.value.has(number.value));
const tooBig = computed(() => number.value > maxNumber.value);
const left = computed(() => msUntilClose(today.value, now.value));

const chance = computed(() => (myTickets.value.length ? myTickets.value.length / tickets.value.length : null));
// If you buy this ticket, the pot grows by one more ticket.
const prizeIfYouWin = computed(() => {
  const fee = config.value?.data.feeBps ?? 0;
  const next = prize.value + ((ticketPrice.value ?? 0n) * BigInt(10_000 - fee)) / 10_000n;
  return next;
});
const prizeShown = useTween(() => Number(prizeIfYouWin.value));

const notEnoughSol = computed(
  () => balance.value !== null && ticketPrice.value !== null && balance.value < ticketPrice.value,
);
const paused = computed(() => config.value?.data.paused ?? false);

const buyLabel = computed(() => {
  if (taken.value) return `${formatNumber(number.value)} is taken today`;
  if (tooBig.value) return 'Number out of range';
  if (notEnoughSol.value) return 'Not enough SOL';
  return `Buy ${formatNumber(number.value)} for ◎${ticketPrice.value === null ? '…' : formatSol(ticketPrice.value)}`;
});

// Each ticket is its own account; its rent comes back when it is closed.
const { client } = useSolana();
const ticketRent = ref<bigint | null>(null);
onMounted(async () => {
  ticketRent.value = await client.rpc
    .getMinimumBalanceForRentExemption(BigInt(getTicketSize()))
    .send()
    .catch(() => null);
});

const countries = countryOptions();
const selectedCountry = computed({
  get: () => countries.find((c) => c.value === country.value) ?? countries[0],
  set: (option) => setCountry(option?.value ?? null),
});

const spinning = ref(false);
const burst = ref<{ fire: () => void }>();

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

/** Spins the reels and lands on a random number nobody holds yet today. */
async function luckyDip() {
  if (spinning.value) return;
  live.touchKeypad();
  let pick: number | null = null;
  for (let i = 0; i < 100 && pick === null; i++) {
    const candidate = Math.floor(Math.random() * (maxNumber.value + 1));
    if (!takenNumbers.value.has(candidate)) pick = candidate;
  }
  if (pick === null) return;
  sound.play('click');
  // The reels spin at the final width, so they stop where the number will be.
  digits.value = '1'.repeat(String(pick).length);
  spinning.value = true;
  await new Promise((resolve) => setTimeout(resolve, 950));
  digits.value = String(pick);
  spinning.value = false;
  sound.play('commit');
}

async function buy() {
  if (taken.value || tooBig.value || spinning.value) {
    sound.play('wrong');
    return;
  }
  sound.play('commit');
  const signature = await lottery.buy(number.value, country.value);
  sound.play(signature ? 'committed' : 'wrong');
  if (signature) burst.value?.fire();
}

function onKey(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;
  if (target?.closest('input, textarea, [contenteditable], [role="combobox"], [role="dialog"]')) return;
  if (/^\d$/.test(event.key)) press(Number(event.key));
  else if (event.key === 'Backspace') backspace();
  else if (event.key === 'Escape') reset();
  else if (event.key === 'Enter' && connected.value) void buy();
  else return;
  event.preventDefault();
}

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
</script>

<template>
  <LotteryGlass hero>
    <div class="space-y-6 p-5 sm:p-7">
      <header class="text-center">
        <p class="kicker">Pick a</p>
        <h2 class="title text-4xl font-semibold tracking-[0.28em] text-highlighted">NUMBER</h2>
        <p class="mt-4 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <span class="kicker text-sm">Win</span>
          <span class="text-lucky glow-primary font-mono text-4xl font-semibold tabular-nums">
            ◎{{ formatSol(Math.round(prizeShown), 3) }}
          </span>
        </p>
        <div class="mt-3 flex items-center justify-center gap-3">
          <span class="kicker text-sm">in</span>
          <LotteryCountdown :ms="left" />
        </div>
      </header>

      <div class="tray grid grid-cols-3 gap-2 px-2 py-3">
        <LotteryStat label="Your tickets" :value="`×${myTickets.length}`" />
        <LotteryStat label="Win chance" :value="formatPercent(chance)" />
        <LotteryStat label="Ticket" :value="ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}`" />
      </div>

      <div>
        <div class="window" :class="{ bad: taken || tooBig, rolling: spinning }">
          <span class="sr-only" aria-live="polite">{{ formatNumber(number) }}</span>
          <LotteryReels :value="number" :spinning="spinning" :invalid="taken || tooBig" />
          <span v-if="taken" class="mt-2 text-xs font-medium text-error">Already taken today</span>
          <span v-else class="mt-2 text-xs text-muted">0 to {{ formatNumber(maxNumber) }}, one ticket per number</span>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Number pad">
          <UButton
            v-for="key in KEYS"
            :key="key"
            :label="String(key)"
            color="neutral"
            variant="soft"
            size="xl"
            block
            class="keycap py-4 font-mono text-xl font-semibold"
            @click="press(key)"
          />
          <UButton
            icon="i-lucide-rotate-ccw"
            aria-label="Reset"
            color="neutral"
            variant="ghost"
            size="xl"
            block
            class="keycap keycap-quiet"
            @click="reset"
          />
          <UButton
            label="0"
            color="neutral"
            variant="soft"
            size="xl"
            block
            class="keycap py-4 font-mono text-xl font-semibold"
            @click="press(0)"
          />
          <UButton
            icon="i-lucide-delete"
            aria-label="Delete last digit"
            color="neutral"
            variant="ghost"
            size="xl"
            block
            class="keycap keycap-quiet"
            @click="backspace"
          />
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-dices"
            label="Lucky dip"
            color="secondary"
            variant="outline"
            class="dip shrink-0"
            :loading="spinning"
            @click="luckyDip"
          />
          <USelectMenu
            v-model="selectedCountry"
            :items="countries"
            label-key="label"
            :search-input="{ placeholder: 'Search a country' }"
            class="min-w-0 flex-1"
            aria-label="Country shown with your ticket"
          >
            <template #leading>
              <span>{{ selectedCountry?.flag ?? flagEmoji(null) }}</span>
            </template>
            <template #item-leading="{ item }">
              <span>{{ item.flag }}</span>
            </template>
          </USelectMenu>
        </div>

        <UAlert
          v-if="configMissing"
          color="warning"
          variant="subtle"
          icon="i-lucide-construction"
          title="The lottery is not set up on this cluster yet."
        />
        <UAlert
          v-else-if="paused"
          color="warning"
          variant="subtle"
          icon="i-lucide-pause"
          title="Ticket sales are paused."
        />

        <ClientOnly>
          <div class="relative">
            <UButton
              v-if="connected"
              size="xl"
              block
              :loading="busy"
              :disabled="taken || tooBig || paused || configMissing || notEnoughSol || spinning"
              class="bg-lucky shine shadow-neon buy py-4 text-base font-semibold text-white hover:opacity-95 disabled:opacity-50"
              icon="i-lucide-rocket"
              @click="buy"
            >
              {{ buyLabel }}
            </UButton>
            <WalletButton v-else block />
            <LotteryBurst ref="burst" />
          </div>
        </ClientOnly>
        <p class="text-center text-xs text-muted">
          Keys 0–9 type, ⌫ deletes, Enter buys.
          <template v-if="ticketRent !== null">
            A ticket also holds ◎{{ formatSol(ticketRent, 5) }} of account rent, which you get back after the draw.
          </template>
        </p>
      </div>
    </div>
  </LotteryGlass>
</template>

<style scoped>
.title {
  text-shadow:
    0 0 18px color-mix(in oklab, var(--ui-primary) 60%, transparent),
    0 0 2px color-mix(in oklab, white 40%, transparent);
}

/* A shallow tray in the glass for the three readouts. */
.tray {
  border-radius: 1rem;
  background: color-mix(in oklab, black 20%, transparent);
  box-shadow:
    inset 0 1px 4px color-mix(in oklab, black 50%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 5%, transparent);
}

/* The reel window, sunk into the glass. */
.window {
  container-type: inline-size;
  display: flex;
  min-height: 7.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.1rem 1rem 0.9rem;
  border-radius: 1.25rem;
  background:
    radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--ui-primary) 14%, transparent), transparent 60%),
    color-mix(in oklab, black 38%, transparent);
  box-shadow:
    inset 0 2px 10px color-mix(in oklab, black 70%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 6%, transparent),
    0 1px 0 color-mix(in oklab, white 10%, transparent);
  transition: box-shadow 0.3s;
}

.window.rolling {
  box-shadow:
    inset 0 2px 10px color-mix(in oklab, black 70%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-secondary) 45%, transparent),
    0 0 40px -10px var(--ui-secondary);
}

.window.bad {
  box-shadow:
    inset 0 2px 10px color-mix(in oklab, black 70%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-error) 60%, transparent),
    0 0 30px -12px var(--ui-error);
}

/* Keys as glass chips: lit edge on top, they sink when pressed. */
.keycap {
  justify-content: center;
  border-radius: 1rem;
  color: var(--ui-text-highlighted);
  background: linear-gradient(180deg, color-mix(in oklab, white 11%, transparent), color-mix(in oklab, white 3%, transparent));
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 28%, transparent),
    inset 0 -2px 0 color-mix(in oklab, black 40%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 6%, transparent),
    0 6px 14px -8px rgb(0 0 0 / 0.8);
  transition:
    transform 0.08s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.keycap:hover {
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--ui-primary) 26%, transparent),
    color-mix(in oklab, var(--ui-primary) 8%, transparent)
  );
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 30%, transparent),
    inset 0 -2px 0 color-mix(in oklab, black 40%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-primary) 45%, transparent),
    0 0 22px -6px var(--ui-primary);
}

.keycap:active {
  transform: translateY(1px) scale(0.98);
  box-shadow:
    inset 0 2px 6px color-mix(in oklab, black 55%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--ui-primary) 55%, transparent),
    0 0 28px -4px var(--ui-primary);
}

.keycap-quiet {
  color: var(--ui-text-muted);
}

.dip {
  box-shadow: 0 0 22px -10px var(--ui-secondary);
}

.buy {
  justify-content: center;
  letter-spacing: 0.02em;
}
</style>
