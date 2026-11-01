<script setup lang="ts">
import { GameKind } from '@solucky/client';

/** The counters under the landing's dial: today's tickets, players and the ticket price. Browser only. */
const { t } = useI18n();
const { tickets, players, ticketPrice } = useLottery(GameKind.Daily);
</script>

<template>
  <LotteryStat :label="t('stat.tickets')" :value="tickets.length" />
  <LotteryStat :label="t('stat.players')" :value="players" />
  <LotteryStat :label="t('stat.ticket')" :value="ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}`" />
</template>
