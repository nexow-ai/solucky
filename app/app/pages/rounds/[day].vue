<script setup lang="ts">
import type { Account } from '@solana/kit';
import {
  computeRandomness,
  countryFromBytes,
  dayOf,
  fetchRoundTickets,
  findRoundPda,
  flagEmoji,
  formatDay,
  parseDay,
  type Round,
  RoundStatus,
  type Ticket,
  winningIndex,
} from '@solucky/client';

const route = useRoute();
const label = computed(() => String(route.params.day));
const day = computed(() => parseDay(label.value));

useSeoMeta({ title: () => `Round ${label.value} · S☉Lucky` });

const { client, programAddress, explorer } = useSolana();
const { settle, busy } = useLottery();
const { connected } = useWallet();
const price = useSolPrice();

const round = shallowRef<Account<Round> | null>(null);
const tickets = shallowRef<Account<Ticket>[]>([]);
const loading = ref(true);

async function load() {
  if (day.value === null) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const [address] = await findRoundPda({ day: day.value }, { programAddress });
    const account = await client.solucky.accounts.round.fetchMaybe(address, { commitment: 'confirmed' });
    round.value = account.exists ? account : null;
    tickets.value = account.exists ? await fetchRoundTickets(client.rpc, address, programAddress) : [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(day, load);

const now = useNow();
const isToday = computed(() => day.value === dayOf(now.value));
const drawn = computed(() => !!round.value && round.value.data.status >= RoundStatus.Drawn);

const hex = (bytes: ArrayLike<number>) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** Recomputes the draw in the browser from the round's public fields. */
const check = ref<{ randomness: string; index: number; matches: boolean } | null>(null);
async function verify() {
  const r = round.value;
  if (!r) return;
  const randomness = await computeRandomness({
    entropy: r.data.entropy,
    slotHash: r.data.slotHash,
    slot: r.data.drawSlot,
    round: r.address,
  });
  const index = winningIndex(randomness, r.data.ticketCount);
  check.value = {
    randomness: hex(randomness),
    index,
    matches: hex(randomness) === hex(r.data.randomness) && index === r.data.winningIndex,
  };
}

const facts = computed(() => {
  const r = round.value?.data;
  if (!r) return [];
  return [
    { label: 'Tickets sold', value: formatNumber(r.ticketCount) },
    { label: 'Ticket price', value: `◎${formatSol(r.ticketPrice)}` },
    { label: 'House fee', value: `${r.feeBps / 100}%` },
    { label: 'Pinned slot', value: r.targetSlot ? formatNumber(r.targetSlot) : '—' },
  ];
});
</script>

<template>
  <UContainer class="max-w-4xl space-y-6 py-8">
    <UButton to="/play" label="Back to the game" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />

    <UAlert
      v-if="day === null"
      color="error"
      variant="subtle"
      icon="i-lucide-calendar-x"
      title="This is not a date. Rounds are named YYYY-MM-DD."
    />

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="kicker">Round</p>
          <h1 class="text-3xl font-bold tracking-widest text-highlighted">{{ label }}</h1>
        </div>
        <LotteryStatusBadge v-if="round" :status="round.data.status" :today="isToday" />
      </div>

      <USkeleton v-if="loading" class="h-64 w-full" />

      <UEmpty
        v-else-if="!round"
        icon="i-lucide-ticket-x"
        title="Nobody played this day"
        :description="
          isToday ? 'Be the first to buy a ticket today.' : 'A round only exists once its first ticket is sold.'
        "
        :actions="isToday ? [{ label: 'Play now', to: '/play' }] : []"
      />

      <template v-else>
        <UCard>
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <p class="kicker">Pot</p>
              <p class="text-lucky text-4xl font-bold tabular-nums">◎{{ formatSol(round.data.pot, 4) }}</p>
              <p class="text-sm text-muted tabular-nums">{{ formatUsd(round.data.pot, price) }} at today's price</p>
            </div>
            <div v-if="round.data.status === RoundStatus.Settled">
              <p class="kicker">Winner</p>
              <p class="text-2xl font-bold tabular-nums text-highlighted">
                {{ flagEmoji(countryFromBytes(round.data.winnerCountry)) }} {{ formatNumber(round.data.winningNumber) }}
              </p>
              <ULink
                :to="explorer('address', round.data.winner)"
                target="_blank"
                class="font-mono text-sm hover:text-primary"
              >
                {{ shortAddress(round.data.winner, 6) }}
              </ULink>
              <p class="text-sm text-muted">
                Won ◎{{ formatSol(round.data.payout) }} · fee ◎{{ formatSol(round.data.fee) }}
              </p>
            </div>
            <div v-else-if="!isToday" class="flex flex-col items-start gap-2">
              <p class="kicker">Not paid yet</p>
              <p class="text-sm text-muted">Anyone can finish this round. It only costs network fees.</p>
              <UButton
                v-if="connected"
                label="Settle this round"
                icon="i-lucide-gavel"
                :loading="busy"
                @click="settle(round).then(load)"
              />
              <WalletButton v-else />
            </div>
          </div>

          <USeparator class="my-6" />

          <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div v-for="fact in facts" :key="fact.label">
              <dt class="kicker text-[0.65rem]">{{ fact.label }}</dt>
              <dd class="mt-1 font-semibold tabular-nums text-highlighted">{{ fact.value }}</dd>
            </div>
          </dl>
        </UCard>

        <UCard v-if="drawn">
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 class="font-semibold text-highlighted">Check the draw</h2>
                <p class="text-sm text-muted">randomness = sha256(entropy ‖ slot hash ‖ draw slot ‖ round address)</p>
              </div>
              <UButton
                label="Recompute in my browser"
                icon="i-lucide-calculator"
                color="neutral"
                variant="outline"
                @click="verify"
              />
            </div>
          </template>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-muted">Entropy (every purchase, hashed in order)</dt>
              <dd class="break-all font-mono text-xs">{{ hex(round.data.entropy) }}</dd>
            </div>
            <div>
              <dt class="text-muted">
                Slot hash of slot
                <ULink :to="explorer('block', round.data.drawSlot)" target="_blank" class="hover:text-primary">
                  {{ formatNumber(round.data.drawSlot) }}
                </ULink>
                (read by the program from the SlotHashes sysvar)
              </dt>
              <dd class="break-all font-mono text-xs">{{ hex(round.data.slotHash) }}</dd>
            </div>
            <div>
              <dt class="text-muted">Randomness</dt>
              <dd class="break-all font-mono text-xs">{{ hex(round.data.randomness) }}</dd>
            </div>
            <div>
              <dt class="text-muted">Winning ticket</dt>
              <dd class="font-mono text-xs">
                first 8 bytes as u64 mod {{ round.data.ticketCount }} = purchase #{{ round.data.winningIndex }}
              </dd>
            </div>
          </dl>
          <UAlert
            v-if="check"
            class="mt-4"
            :color="check.matches ? 'success' : 'error'"
            variant="subtle"
            :icon="check.matches ? 'i-lucide-badge-check' : 'i-lucide-badge-x'"
            :title="check.matches ? 'The draw checks out.' : 'Mismatch: the stored result does not match the inputs.'"
            :description="`Your browser got ${check.randomness.slice(0, 16)}… and ticket #${check.index}.`"
          />
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">Tickets</h2>
            <p class="text-sm text-muted">
              Tickets closed by their owners after the payout no longer show here; the round keeps the totals.
            </p>
          </template>
          <p v-if="!tickets.length" class="text-sm text-muted">No open tickets left for this round.</p>
          <ol v-else class="divide-y divide-default text-sm">
            <li
              v-for="ticket in tickets"
              :key="ticket.address"
              class="grid grid-cols-12 items-center gap-2 py-2 tabular-nums"
              :class="drawn && ticket.data.index === round.data.winningIndex ? 'font-semibold text-primary' : ''"
            >
              <span class="col-span-1 text-muted">#{{ ticket.data.index }}</span>
              <span class="col-span-3 text-muted">{{ formatUtcTime(ticket.data.createdAt) }} UTC</span>
              <ULink
                :to="explorer('address', ticket.data.owner)"
                target="_blank"
                class="col-span-4 font-mono hover:text-primary"
              >
                {{ shortAddress(ticket.data.owner, 6) }}
              </ULink>
              <span class="col-span-1 text-center">{{ flagEmoji(countryFromBytes(ticket.data.country)) }}</span>
              <span class="col-span-3 text-right">{{ formatNumber(ticket.data.number) }}</span>
            </li>
          </ol>
        </UCard>

        <p class="text-center text-xs text-muted">
          Round account
          <ULink :to="explorer('address', round.address)" target="_blank" class="font-mono hover:text-primary">{{
            round.address
          }}</ULink>
          · {{ formatDay(round.data.day) }}
        </p>
      </template>
    </template>
  </UContainer>
</template>
