<script setup lang="ts">
import { flagEmoji, formatCountdown, getTicketSize, msUntilClose } from '@solucky/client';

const lottery = useLottery();
const { today, prize, myTickets, tickets, ticketPrice, takenNumbers, config, configMissing, busy } = lottery;
const { connected, balance } = useWallet();
const { country, set: setCountry } = useCountry();
const sound = useSound();
const now = useNow();

const digits = ref('0');
const number = computed(() => Number(digits.value));
const maxNumber = computed(() => config.value?.data.maxNumber ?? 1_000_000_000);
const maxDigits = computed(() => String(maxNumber.value).length);
const taken = computed(() => takenNumbers.value.has(number.value));
const tooBig = computed(() => number.value > maxNumber.value);
const countdown = computed(() => formatCountdown(msUntilClose(today.value, now.value)));

const chance = computed(() => (myTickets.value.length ? myTickets.value.length / tickets.value.length : null));
// If you buy this ticket, the pot grows by one more ticket.
const prizeIfYouWin = computed(() => {
  const fee = config.value?.data.feeBps ?? 0;
  const next = prize.value + ((ticketPrice.value ?? 0n) * BigInt(10_000 - fee)) / 10_000n;
  return next;
});

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

function press(digit: number) {
  sound.play('click');
  const next = digits.value === '0' ? String(digit) : digits.value + digit;
  if (next.length > maxDigits.value || Number(next) > maxNumber.value) {
    sound.play('wrong');
    return;
  }
  digits.value = next;
}

function backspace() {
  sound.play('click');
  digits.value = digits.value.length > 1 ? digits.value.slice(0, -1) : '0';
}

function reset() {
  sound.play('click');
  digits.value = '0';
}

/** Picks a random number nobody holds yet today. */
function luckyDip() {
  sound.play('click');
  for (let i = 0; i < 100; i++) {
    const candidate = Math.floor(Math.random() * (maxNumber.value + 1));
    if (!takenNumbers.value.has(candidate)) {
      digits.value = String(candidate);
      return;
    }
  }
}

async function buy() {
  if (taken.value || tooBig.value) {
    sound.play('wrong');
    return;
  }
  sound.play('commit');
  const signature = await lottery.buy(number.value, country.value);
  sound.play(signature ? 'committed' : 'wrong');
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
  <UCard :ui="{ body: 'space-y-6' }">
    <div class="text-center">
      <p class="kicker">Pick a</p>
      <h2 class="text-3xl font-semibold tracking-[0.2em] text-muted">NUMBER</h2>
      <p class="mt-3 flex items-baseline justify-center gap-3">
        <span class="kicker text-base">Win</span>
        <span class="text-4xl font-bold tabular-nums text-highlighted">◎{{ formatSol(prizeIfYouWin, 3) }}</span>
        <span class="kicker text-base">in</span>
      </p>
      <p class="text-lucky text-2xl font-bold tracking-widest tabular-nums">{{ countdown }}</p>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <LotteryStat label="Your tickets" :value="`×${myTickets.length}`" />
      <LotteryStat label="Win chance" :value="formatPercent(chance)" />
      <LotteryStat label="Ticket" :value="ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}`" />
    </div>

    <div>
      <div
        class="flex min-h-24 flex-col items-center justify-center rounded-lg bg-muted px-4 py-4 text-center"
        :class="taken || tooBig ? 'ring-2 ring-error/60' : ''"
      >
        <span class="text-4xl font-bold tabular-nums text-highlighted" aria-live="polite">
          {{ formatNumber(number) }}
        </span>
        <span v-if="taken" class="mt-1 text-xs font-medium text-error">Already taken today</span>
        <span v-else class="mt-1 text-xs text-muted">0 to {{ formatNumber(maxNumber) }}, one ticket per number</span>
      </div>

      <div class="mt-3 grid grid-cols-3 gap-1.5" role="group" aria-label="Number pad">
        <UButton
          v-for="key in KEYS"
          :key="key"
          :label="String(key)"
          color="neutral"
          variant="soft"
          size="xl"
          block
          class="py-4 text-lg font-semibold"
          @click="press(key)"
        />
        <UButton
          icon="i-lucide-rotate-ccw"
          aria-label="Reset"
          color="neutral"
          variant="ghost"
          size="xl"
          block
          @click="reset"
        />
        <UButton
          label="0"
          color="neutral"
          variant="soft"
          size="xl"
          block
          class="py-4 text-lg font-semibold"
          @click="press(0)"
        />
        <UButton
          icon="i-lucide-delete"
          aria-label="Delete last digit"
          color="neutral"
          variant="ghost"
          size="xl"
          block
          @click="backspace"
        />
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex gap-2">
        <UButton
          icon="i-lucide-dices"
          label="Lucky dip"
          color="neutral"
          variant="outline"
          class="shrink-0"
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
        <UButton
          v-if="connected"
          size="xl"
          block
          :loading="busy"
          :disabled="taken || tooBig || paused || configMissing || notEnoughSol"
          class="bg-lucky font-semibold text-white hover:opacity-90 disabled:opacity-50"
          icon="i-lucide-rocket"
          @click="buy"
        >
          {{ buyLabel }}
        </UButton>
        <WalletButton v-else block />
      </ClientOnly>
      <p class="text-center text-xs text-muted">
        Keys 0–9 type, ⌫ deletes, Enter buys.
        <template v-if="ticketRent !== null">
          A ticket also holds ◎{{ formatSol(ticketRent, 5) }} of account rent, which you get back after the draw.
        </template>
      </p>
    </div>
  </UCard>
</template>
