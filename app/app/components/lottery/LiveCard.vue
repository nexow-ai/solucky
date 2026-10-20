<script setup lang="ts">
import { formatCountdown, formatDay, msUntilClose } from '@solucky/client';

const { today, pot, prize, tickets, players, ticketPrice, loading } = useLottery();
const price = useSolPrice();
const now = useNow();

const countdown = computed(() => formatCountdown(msUntilClose(today.value, now.value)));
</script>

<template>
  <UCard class="mx-auto w-full max-w-sm shadow-2xl ring-primary/30" :ui="{ body: 'space-y-5 text-center' }">
    <div>
      <p class="kicker">Today's pot · {{ formatDay(today) }}</p>
      <USkeleton v-if="loading" class="mx-auto mt-3 h-10 w-40" />
      <p v-else class="text-lucky mt-2 text-5xl font-bold tabular-nums">◎{{ formatSol(pot, 3) }}</p>
      <p class="mt-1 text-sm text-muted tabular-nums">{{ formatUsd(pot, price) }}</p>
    </div>
    <div class="grid grid-cols-3 gap-2">
      <LotteryStat label="Tickets" :value="tickets.length" />
      <LotteryStat label="Players" :value="players" />
      <LotteryStat label="Ticket" :value="ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}`" />
    </div>
    <div>
      <p class="kicker">Draw in</p>
      <p class="text-2xl font-semibold tracking-widest tabular-nums text-highlighted">{{ countdown }}</p>
      <p class="mt-1 text-xs text-muted">Winner takes ◎{{ formatSol(prize, 3) }} so far</p>
    </div>
    <UButton
      to="/play"
      label="Pick your number"
      size="lg"
      block
      trailing-icon="i-lucide-arrow-right"
      class="bg-lucky text-white hover:opacity-90"
    />
  </UCard>
</template>
