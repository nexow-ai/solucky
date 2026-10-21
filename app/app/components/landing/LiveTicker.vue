<script setup lang="ts">
const { tickets } = useLottery();
</script>

<template>
  <LandingTicker :tickets="tickets" />
</template>
