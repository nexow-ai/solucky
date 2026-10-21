<script setup lang="ts">
const config = useRuntimeConfig().public;
const { explorer, programAddress, clusterLabel } = useSolana();

const links = computed(() =>
  [
    { icon: 'i-simple-icons-x', label: 'X', to: config.twitterUrl },
    { icon: 'i-simple-icons-discord', label: 'Discord', to: config.discordUrl },
    { icon: 'i-simple-icons-github', label: 'Source code', to: config.githubUrl },
  ].filter((link) => link.to),
);
</script>

<template>
  <UFooter
    class="relative bg-default/60 backdrop-blur-sm before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-secondary/50 before:to-transparent"
    :ui="{ top: 'p-0' }"
  >
    <!-- The neon city from the original landing hero, at the foot of every page. -->
    <template #top>
      <CitySkyline />
    </template>

    <template #left>
      <div class="space-y-1 text-sm text-muted">
        <p>
          © 2022–{{ new Date().getFullYear() }}
          <ULink
            to="https://nexow.studio"
            target="_blank"
            class="text-default underline decoration-primary/50 underline-offset-4 hover:text-primary"
          >
            Nexow, Inc.
          </ULink>
          · MIT License
        </p>
        <p>
          Program
          <ULink :to="explorer('address', programAddress)" target="_blank" class="font-mono text-xs hover:text-primary">
            {{ shortAddress(programAddress, 6) }}
          </ULink>
          on {{ clusterLabel }}. 18+ only. Play for fun, and only where lotteries are legal.
        </p>
        <nav aria-label="Legal" class="flex flex-wrap gap-x-4 gap-y-1 pt-2">
          <ULink
            v-for="page in LEGAL_PAGES"
            :key="page.to"
            :to="page.to"
            exact
            class="underline-offset-4 hover:text-primary hover:underline"
          >
            {{ page.label }}
          </ULink>
        </nav>
      </div>
    </template>

    <template #right>
      <UButton
        v-for="link in links"
        :key="link.label"
        :icon="link.icon"
        :to="link.to"
        :aria-label="link.label"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
