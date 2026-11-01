<script setup lang="ts">
import type { Account } from '@solana/kit';
import { GameKind, type Round } from '@solucky/client';

/**
 * Renderless: the hourly lottery's and Guess the number's settled rounds,
 * for the orrery's winner stars. Mounted only once the winners wall is near,
 * because reading them scans every past round of those games.
 */
const emit = defineEmits<{ rounds: [Account<Round>[]] }>();
const hourly = useLottery(GameKind.Hourly);
const guess = useLottery(GameKind.Guess);
watch(
  () => [...hourly.settled.value, ...guess.settled.value],
  (rounds) => emit('rounds', rounds),
  { immediate: true },
);
</script>

<template>
  <span hidden />
</template>
