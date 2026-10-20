<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();
const { clusterLabel, isMainnet } = useSolana();
const sound = useSound();

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Play', to: '/play', icon: 'i-lucide-ticket', active: route.path === '/play' },
  { label: 'How it works', to: '/#how-it-works', exactHash: true },
  { label: 'Fairness', to: '/#fairness', exactHash: true },
  { label: 'FAQ', to: '/#faq', exactHash: true },
]);
</script>

<template>
  <UHeader to="/" title="S☉Lucky">
    <template #title>
      <AppLogo />
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UBadge v-if="!isMainnet" :label="clusterLabel" color="warning" variant="subtle" class="hidden sm:inline-flex" />
      <UTooltip :text="sound.enabled.value ? 'Mute sounds' : 'Play sounds'">
        <UButton
          :icon="sound.enabled.value ? 'i-lucide-volume-2' : 'i-lucide-volume-x'"
          color="neutral"
          variant="ghost"
          :aria-label="sound.enabled.value ? 'Mute sounds' : 'Play sounds'"
          @click="sound.toggle()"
        />
      </UTooltip>
      <UColorModeButton />
      <ClientOnly>
        <WalletButton class="hidden sm:inline-flex" />
        <template #fallback>
          <USkeleton class="hidden h-8 w-36 sm:block" />
        </template>
      </ClientOnly>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      <ClientOnly>
        <WalletButton block class="mt-4" />
      </ClientOnly>
    </template>
  </UHeader>
</template>
