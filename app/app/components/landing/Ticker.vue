<script setup lang="ts">
import type { Account } from '@solana/kit';
import { countryFromBytes, flagEmoji, type Ticket } from '@solucky/client';

/** A neon news band: today's newest tickets, between the rules every round runs by. */
const props = defineProps<{ tickets?: readonly Account<Ticket>[] }>();

const RULES = [
  'New round every day at 00:00 UTC',
  'One ticket wins the pot',
  'Numbers from 0 to 1 000 000 000',
  'House fee capped at 10% by the program',
  'Anyone can close, draw and pay a round',
  'Recompute every draw in your browser',
  'Open source',
];

const latest = computed(() => [...(props.tickets ?? [])].reverse().slice(0, 12));
</script>

<template>
  <div
    class="relative border-y border-primary/30 bg-default/90 py-3 shadow-[0_0_40px_-12px_var(--ui-primary)]"
  >
    <UMarquee pause-on-hover :repeat="2" :ui="{ root: '[--gap:--spacing(8)] [--duration:60s]' }">
      <span
        v-for="ticket in latest"
        :key="ticket.address"
        class="inline-flex items-center gap-2 font-mono text-xs tracking-widest whitespace-nowrap uppercase"
      >
        <span class="text-success">New ticket</span>
        <span>{{ flagEmoji(countryFromBytes(ticket.data.country)) }}</span>
        <span class="font-semibold text-highlighted tabular-nums">{{ formatNumber(ticket.data.number) }}</span>
        <span class="text-dimmed">{{ shortAddress(ticket.data.owner) }}</span>
      </span>
      <span
        v-for="(rule, index) in RULES"
        :key="rule"
        class="inline-flex items-center gap-2 font-mono text-xs tracking-widest whitespace-nowrap text-muted uppercase"
      >
        <span :class="index % 2 ? 'text-secondary' : 'text-primary'">◆</span>
        {{ rule }}
      </span>
    </UMarquee>
  </div>
</template>
