<script setup lang="ts">
/** Readouts under the solar dial, with today's entropy: the rolling hash every purchase feeds. */
const { t } = useI18n();
const { round, tickets, players, ticketPrice } = useLottery();
const { clusterLabel } = useSolana();

const entropy = computed(() => {
  const bytes = round.value?.data.entropy;
  if (!bytes) return null;
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
});

// Lights up for a moment whenever the hash changes, i.e. a ticket was just mixed in.
const changes = ref(0);
watch(entropy, (next, previous) => {
  if (previous && next !== previous) changes.value++;
});
</script>

<template>
  <div
    class="grid grid-cols-3 gap-y-4 rounded-(--ui-radius) bg-default/85 py-3 ring ring-default sm:grid-cols-[1fr_1fr_1fr_1.6fr]"
  >
    <LotteryStat :label="t('stat.tickets')" :value="tickets.length" />
    <LotteryStat :label="t('stat.players')" :value="players" />
    <LotteryStat :label="t('stat.ticket')" :value="ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}`" />
    <div
      class="col-span-3 text-center sm:col-span-1"
      :title="entropy ? t('dial.entropyTitle', { hex: entropy }) : undefined"
    >
      <p class="kicker inline-flex items-center gap-1.5 text-[0.65rem]">
        <span class="relative flex size-1.5">
          <span class="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75" />
          <span class="relative inline-flex size-1.5 rounded-full bg-secondary" />
        </span>
        {{ t('dial.entropy', { cluster: clusterLabel }) }}
      </p>
      <p
        :key="changes"
        class="mt-1.5 font-mono text-sm font-semibold tracking-wider text-secondary motion-safe:animate-bump"
      >
        {{ entropy ? `${entropy.slice(0, 8)}…${entropy.slice(-6)}` : t('dial.noTickets') }}
      </p>
    </div>
  </div>
</template>
