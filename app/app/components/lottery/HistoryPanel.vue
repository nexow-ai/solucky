<script setup lang="ts">
import type { Account } from '@solana/kit';
import { countryFromBytes, flagEmoji, formatDay, type Ticket } from '@solucky/client';

const { settled, pending, totals, busy, settle, reclaimable, reclaim, loading } = useLottery();
const { connected, address } = useWallet();

const leftovers = ref<Account<Ticket>[]>([]);
async function loadLeftovers() {
  leftovers.value = connected.value ? await reclaimable().catch(() => []) : [];
}
watch([address, () => settled.value.length], loadLeftovers, { immediate: true });

async function reclaimAll() {
  await reclaim(leftovers.value);
  await loadLeftovers();
}
</script>

<template>
  <UCard :ui="{ body: 'space-y-6' }">
    <div class="text-center">
      <p class="kicker">S☉Lucky</p>
      <h2 class="text-3xl font-semibold tracking-[0.2em] text-muted">HISTORY</h2>
      <p class="mt-3 flex items-baseline justify-center gap-3">
        <span class="kicker text-base">Total</span>
        <span class="text-4xl font-bold tabular-nums text-highlighted">{{ totals.rounds }}</span>
        <span class="kicker text-base">{{ totals.rounds === 1 ? 'game' : 'games' }}</span>
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <LotteryStat label="Tickets" :value="formatNumber(totals.tickets)" />
      <LotteryStat label="Winners" :value="totals.winners" />
      <LotteryStat label="Average pot" :value="`◎${formatSol(totals.averagePot, 2)}`" />
      <LotteryStat label="Biggest pot" :value="`◎${formatSol(totals.biggestPot, 2)}`" />
    </div>

    <div v-if="pending.length" class="space-y-2">
      <p class="kicker text-center">Waiting for the draw</p>
      <div
        v-for="round in pending"
        :key="round.address"
        class="flex items-center justify-between gap-2 rounded-lg border border-default px-3 py-2 text-sm"
      >
        <div class="min-w-0">
          <ULink :to="`/rounds/${formatDay(round.data.day)}`" class="font-semibold hover:text-primary">
            {{ formatDay(round.data.day) }}
          </ULink>
          <span class="ml-2 text-muted tabular-nums">◎{{ formatSol(round.data.pot, 3) }}</span>
          <div class="mt-1"><LotteryStatusBadge :status="round.data.status" /></div>
        </div>
        <UButton
          v-if="connected"
          label="Settle"
          :aria-label="`Settle ${formatDay(round.data.day)}`"
          icon="i-lucide-gavel"
          size="sm"
          color="primary"
          variant="soft"
          :loading="busy"
          @click="settle(round)"
        />
      </div>
      <p class="text-center text-xs text-muted">
        Anyone can close, draw and pay a finished round. It only costs network fees; the prize always goes to the
        winner.
      </p>
    </div>

    <UAlert
      v-if="leftovers.length"
      color="info"
      variant="subtle"
      icon="i-lucide-coins"
      :title="`${leftovers.length} old ${leftovers.length === 1 ? 'ticket holds' : 'tickets hold'} ◎${formatSol(
        leftovers.reduce((n, t) => n + t.lamports, 0n),
        4,
      )} of rent`"
      description="Close them to get that SOL back. The round keeps its results."
      :actions="[{ label: 'Get it back', color: 'info', variant: 'solid', loading: busy, onClick: reclaimAll }]"
    />

    <LotteryPotChart :rounds="settled" />

    <div>
      <p class="kicker mb-3 text-center">Winners</p>
      <div class="h-64 overflow-y-auto rounded-lg bg-muted p-2 shadow-inner">
        <div v-if="loading" class="space-y-2 p-1">
          <USkeleton v-for="i in 5" :key="i" class="h-5 w-full" />
        </div>
        <UEmpty
          v-else-if="!settled.length"
          icon="i-lucide-trophy"
          title="No winners yet"
          description="The first draw happens at midnight UTC."
          variant="naked"
          class="h-full"
        />
        <ol v-else class="space-y-0.5 text-xs">
          <li v-for="round in settled" :key="round.address">
            <NuxtLink
              :to="`/rounds/${formatDay(round.data.day)}`"
              class="grid grid-cols-12 items-center gap-2 rounded px-2 py-1 tabular-nums hover:bg-elevated"
              :class="round.data.winner === address ? 'font-semibold text-primary' : 'text-toned'"
            >
              <span class="col-span-3 text-muted">{{ formatDay(round.data.day).slice(2) }}</span>
              <span class="col-span-2 font-semibold">◎{{ formatSol(round.data.pot, 2) }}</span>
              <span class="col-span-3 truncate font-mono">{{ shortAddress(round.data.winner) }}</span>
              <span class="col-span-1 text-center">{{ flagEmoji(countryFromBytes(round.data.winnerCountry)) }}</span>
              <span class="col-span-3 text-right whitespace-nowrap">{{ formatNumber(round.data.winningNumber) }}</span>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </div>
  </UCard>
</template>
