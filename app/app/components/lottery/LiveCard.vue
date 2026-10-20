<script setup lang="ts">
import { formatCountdown, formatDay, msUntilClose } from '@solucky/client';

const { today, pot, prize, tickets, players, ticketPrice, loading } = useLottery();
const { clusterLabel } = useSolana();
const price = useSolPrice();
const now = useNow();

const countdown = computed(() => formatCountdown(msUntilClose(today.value, now.value)));
// `13h 05m 09s` → ['13', 'h'], ['05', 'm'], ['09', 's'], one display cell each.
const cells = computed(() => countdown.value.split(' ').map((part) => [part.slice(0, -1), part.slice(-1)] as const));

// Flash the pot whenever it grows, i.e. a ticket just landed.
const bumps = ref(0);
watch(pot, (next, previous) => {
  if (next > previous) bumps.value++;
});
</script>

<template>
  <div class="relative mx-auto w-full max-w-sm">
    <!-- A neon rim running around the card. -->
    <div
      aria-hidden="true"
      class="mask-ring absolute -inset-px overflow-hidden rounded-(--ui-radius) [--ring-width:1.5px]"
    >
      <div
        class="absolute inset-[-60%] animate-spin-slow bg-[conic-gradient(var(--ui-primary),transparent_25%,transparent_50%,var(--ui-secondary),transparent_75%,transparent)]"
      />
    </div>

    <UCard
      class="hud-corners shadow-neon bg-default/75 ring-0 backdrop-blur-xl [--hud-color:var(--ui-secondary)]"
      :ui="{ body: 'relative space-y-5 overflow-hidden text-center' }"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-1/4 animate-scan bg-linear-to-b from-transparent via-primary/10 to-transparent"
      />

      <div class="flex items-center justify-between">
        <span class="kicker inline-flex items-center gap-2 text-success">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Live
        </span>
        <span class="kicker">Solana {{ clusterLabel }}</span>
      </div>

      <div>
        <p class="kicker">Today's pot · {{ formatDay(today) }}</p>
        <USkeleton v-if="loading" class="mx-auto mt-3 h-10 w-40" />
        <p
          v-else
          :key="bumps"
          class="text-lucky glow-primary mt-2 font-display text-4xl font-bold tabular-nums motion-safe:animate-bump"
        >
          ◎{{ formatSol(pot, 3) }}
        </p>
        <p class="mt-1 font-mono text-sm text-muted tabular-nums">{{ formatUsd(pot, price) }}</p>
      </div>

      <div class="grid grid-cols-3 divide-x divide-default border-y border-default py-3">
        <LotteryStat label="Tickets" :value="tickets.length" />
        <LotteryStat label="Players" :value="players" />
        <LotteryStat label="Ticket" :value="ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}`" />
      </div>

      <div>
        <p class="kicker">Draw in</p>
        <p class="mt-2 flex justify-center gap-2">
          <span
            v-for="[value, unit] in cells"
            :key="unit"
            class="min-w-16 rounded-(--ui-radius) bg-elevated/80 px-2 py-1.5 ring ring-primary/25"
          >
            <span class="font-display text-2xl font-bold text-highlighted tabular-nums">{{ value }}</span>
            <span class="ms-0.5 font-mono text-xs text-primary">{{ unit }}</span>
          </span>
        </p>
        <p class="mt-2 text-xs text-muted">Winner takes ◎{{ formatSol(prize, 3) }} so far</p>
      </div>

      <UButton
        to="/play"
        label="Pick your number"
        size="lg"
        block
        trailing-icon="i-lucide-arrow-right"
        class="bg-lucky shadow-neon shine font-semibold tracking-wide text-white hover:opacity-90"
      />
    </UCard>
  </div>
</template>
