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
  <UFooter>
    <template #left>
      <div class="space-y-1 text-sm text-muted">
        <p>
          © 2022–{{ new Date().getFullYear() }}
          <ULink to="https://nexow.studio" target="_blank" class="text-default hover:text-primary">Nexow, Inc.</ULink>
          · MIT License
        </p>
        <p>
          Program
          <ULink :to="explorer('address', programAddress)" target="_blank" class="font-mono text-xs hover:text-primary">
            {{ shortAddress(programAddress, 6) }}
          </ULink>
          on {{ clusterLabel }}. 18+ only. Play for fun, and only where lotteries are legal.
        </p>
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
