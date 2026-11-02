<script setup lang="ts">
import { type GameKind, isLottery, msUntilClose, periodOf } from '@solucky/client';

/**
 * A header tab's readout: its game's pot and, for a lottery, the time to its
 * draw (from sm up). The page's own game is live already, so its pot is
 * too; the others' refresh once a minute, in one light call for all
 * (`useGamePots`). Browser only.
 */
const props = defineProps<{ kind: GameKind; live?: boolean }>();

const pots = useGamePots();
const now = useNow();
// The tabs key this by `live`, so it runs again when the page's game changes.
const state = props.live ? useLottery(props.kind) : null;

const pot = computed(() => (state && !state.loading.value ? state.pot.value : (pots.value[props.kind] ?? null)));

const pad = (n: number) => String(n).padStart(2, '0');
const clock = computed(() => {
  if (!isLottery(props.kind)) return null;
  const s = Math.floor(msUntilClose(props.kind, periodOf(props.kind, now.value), now.value) / 1000);
  const h = Math.floor(s / 3600);
  const tail = `${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  return h ? `${h}:${tail}` : tail;
});
</script>

<template>
  <span class="block truncate font-mono text-[0.65rem] text-muted tabular-nums" aria-hidden="true" dir="ltr">
    <span :class="{ 'text-primary': props.live }">◎{{ pot === null ? '…' : formatSol(pot, 2) }}</span>
    <span v-if="clock" class="max-sm:hidden"> · {{ clock }}</span>
  </span>
</template>
