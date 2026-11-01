<script setup lang="ts">
import type { GameKind } from '@solucky/client';

/** The counters under a game's dial: its round's tickets, players and the ticket price. Browser only. */
// The kind as a number (0 daily, 1 hourly, 2 guess), as `GAME_SLUGS` indexes it.
const props = defineProps<{ kind: number }>();

const { t } = useI18n();
const { tickets, players, ticketPrice } = useLottery(() => props.kind as GameKind);
</script>

<template>
  <LotteryStat :label="t('stat.tickets')" :value="tickets.length" />
  <LotteryStat :label="t('stat.players')" :value="players" />
  <LotteryStat :label="t('stat.ticket')" :value="ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}`" />
</template>
