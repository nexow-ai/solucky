<script setup lang="ts">
import { countryFromBytes, flagEmoji, formatCountdown, formatDay, msUntilClose } from '@solucky/client';

const { today, pot, tickets, players, countries, loading } = useLottery();
const { address } = useWallet();
const { explorer } = useSolana();
const price = useSolPrice();
const now = useNow();

const countdown = computed(() => formatCountdown(msUntilClose(today.value, now.value)));
const newestFirst = computed(() => [...tickets.value].reverse());
</script>

<template>
  <UCard :ui="{ body: 'space-y-6' }">
    <div class="text-center">
      <p class="kicker">Today's</p>
      <h2 class="text-3xl font-semibold tracking-[0.2em] text-muted">SOLPOT</h2>
      <p class="mt-3 flex items-baseline justify-center gap-3 font-bold">
        <span class="text-lucky text-4xl tabular-nums">◎{{ formatSol(pot, 3) }}</span>
        <span class="text-2xl text-dimmed">/</span>
        <span class="text-lucky text-2xl tabular-nums">{{ formatUsd(pot, price) }}</span>
      </p>
      <p class="mt-3 text-xl font-semibold tracking-widest text-muted">{{ formatDay(today) }}</p>
      <p class="text-xl font-semibold tracking-widest text-highlighted tabular-nums" aria-live="off">
        {{ countdown }}
      </p>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <LotteryStat label="Tickets" :value="tickets.length" />
      <LotteryStat label="Players" :value="players" />
      <LotteryStat label="Countries" :value="countries" />
    </div>

    <div>
      <p class="kicker mb-3 text-center">Numbers in play</p>
      <div class="h-80 overflow-y-auto rounded-lg bg-muted p-2 shadow-inner">
        <div v-if="loading" class="space-y-2 p-1">
          <USkeleton v-for="i in 6" :key="i" class="h-5 w-full" />
        </div>
        <UEmpty
          v-else-if="!tickets.length"
          icon="i-lucide-ticket"
          title="No tickets yet"
          description="Be the first to pick a number today."
          variant="naked"
          class="h-full"
        />
        <ol v-else class="space-y-0.5 text-xs">
          <li
            v-for="ticket in newestFirst"
            :key="ticket.address"
            class="grid grid-cols-12 items-center gap-2 rounded px-2 py-1 tabular-nums"
            :class="ticket.data.owner === address ? 'bg-primary/10 font-semibold text-primary' : 'text-toned'"
          >
            <span class="col-span-3 text-muted">{{ formatUtcTime(ticket.data.createdAt) }}</span>
            <ULink
              :to="explorer('address', ticket.data.owner)"
              target="_blank"
              class="col-span-4 font-mono hover:text-primary"
              :title="ticket.data.owner"
            >
              {{ shortAddress(ticket.data.owner, 5) }}
            </ULink>
            <span class="col-span-1 text-center" :title="countryName(countryFromBytes(ticket.data.country))">
              {{ flagEmoji(countryFromBytes(ticket.data.country)) }}
            </span>
            <span class="col-span-4 text-right font-semibold">{{ formatNumber(ticket.data.number) }}</span>
          </li>
        </ol>
      </div>
    </div>
  </UCard>
</template>
