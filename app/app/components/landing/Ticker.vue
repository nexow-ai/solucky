<script setup lang="ts">
import type { Account } from '@solana/kit';
import { countryFromBytes, flagEmoji, GameKind, type Ticket } from '@solucky/client';

/** A neon news band: today's newest tickets, between the rules every round runs by. */
const props = defineProps<{ tickets?: readonly Account<Ticket>[] }>();

const { t } = useI18n();
const RULES = ['daily', 'hourly', 'pot', 'carry', 'guess', 'numbers', 'fee', 'anyone', 'check', 'open'] as const;
const { maxNumber } = useLottery(GameKind.Daily);
const max = computed(() => formatNumber(maxNumber.value));

const latest = computed(() => [...(props.tickets ?? [])].reverse().slice(0, 12));
</script>

<template>
  <div class="relative border-y border-primary/30 bg-default/90 py-3 shadow-[0_0_40px_-12px_var(--ui-primary)]">
    <UMarquee pause-on-hover :repeat="2" :ui="{ root: '[--gap:--spacing(8)] [--duration:60s]' }">
      <span
        v-for="ticket in latest"
        :key="ticket.address"
        class="inline-flex items-center gap-2 font-mono text-xs tracking-widest whitespace-nowrap uppercase"
      >
        <span class="text-success">{{ t('ticker.newTicket') }}</span>
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
        {{ t(`ticker.rules.${rule}`, { max }) }}
      </span>
    </UMarquee>
  </div>
</template>
