<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
const faucet = useFaucet();

/** Under a section: the section itself or any page below it. */
const within = (path: string) => route.path === path || route.path.startsWith(`${path}/`);

// The bar is the same on every page, the landing's: logo, network, language
// and wallet. The links live in the menu. UHeader names the logo's link after
// the plain text in its title slot (comments included, in development), so
// the slot holds components only: the Beta badge is a UBadge.
const menuItems = computed<NavigationMenuItem[]>(() => [
  {
    label: t('nav.play'),
    to: localePath('/play'),
    icon: 'i-lucide-ticket',
    // Every game's table and its past rounds.
    active: within(localePath('/play')) || within(localePath('/rounds')),
  },
  { label: t('nav.how'), to: localePath({ path: '/', hash: '#how-it-works' }), exactHash: true },
  { label: t('nav.fairness'), to: localePath({ path: '/', hash: '#fairness' }), exactHash: true },
  { label: t('nav.faq'), to: localePath({ path: '/', hash: '#faq' }), exactHash: true },
]);
</script>

<template>
  <UHeader
    :to="localePath('/')"
    title="S☉Lucky"
    :ui="{
      // Button labels never wrap: a tight bar hides them first (below).
      right: 'whitespace-nowrap',
      // The links are in the menu at every width (Nuxt UI hides it from lg).
      toggle: 'lg:inline-flex',
      overlay: 'lg:block',
      content: 'lg:flex',
      // The open menu repeats the bar: keep it in the bar's container, so nothing shifts.
      header: 'mx-auto w-full max-w-(--ui-container) lg:px-8',
      body: 'mx-auto w-full max-w-(--ui-container) lg:px-8',
    }"
  >
    <template #title>
      <span class="flex items-center gap-2">
        <AppLogo />
        <UBadge
          :label="t('header.beta')"
          color="primary"
          variant="soft"
          size="sm"
          class="hidden bg-transparent px-2 font-mono text-[0.6rem] tracking-[0.18em] uppercase shadow-(--neu-in-sm) sm:inline-flex"
        />
      </span>
    </template>

    <template #right>
      <AppNetwork class="max-lg:hidden" />
      <!-- The wallet's address lives in the browser, so the faucet button does too. -->
      <ClientOnly>
        <UTooltip
          v-if="faucet.available.value"
          :text="t('header.faucetTip', { amount: FAUCET_SOL })"
          :disabled="!faucet.url.value"
        >
          <UButton
            :label="t('header.getSol')"
            :aria-label="t('header.getSol')"
            icon="i-lucide-droplets"
            :ui="{ label: 'hidden md:inline' }"
            size="xs"
            color="success"
            variant="soft"
            :to="faucet.url.value ?? undefined"
            :target="faucet.url.value ? '_blank' : undefined"
            :loading="faucet.busy.value"
            class="font-mono tracking-wider uppercase"
            @click="faucet.request()"
          />
        </UTooltip>
      </ClientOnly>
      <ClientOnly>
        <AppInstall />
      </ClientOnly>
      <AppLangMenu />
      <ClientOnly>
        <LazyWalletButton class="hidden sm:inline-flex" />
        <template #fallback>
          <USkeleton class="hidden h-8 w-36 sm:block" />
        </template>
      </ClientOnly>
    </template>

    <template #body>
      <AppNetwork block class="mb-4 lg:hidden" />
      <UNavigationMenu :items="menuItems" orientation="vertical" class="-mx-2.5 sm:max-w-sm" />
      <!-- From sm the bar shows both. -->
      <ClientOnly>
        <div class="sm:hidden">
          <UButton
            v-if="faucet.available.value"
            :label="t('header.getSol')"
            icon="i-lucide-droplets"
            color="success"
            variant="soft"
            block
            :to="faucet.url.value ?? undefined"
            :target="faucet.url.value ? '_blank' : undefined"
            :loading="faucet.busy.value"
            class="mt-4 font-mono tracking-wider uppercase"
            @click="faucet.request()"
          />
          <LazyWalletButton block class="mt-4" />
        </div>
      </ClientOnly>
    </template>
  </UHeader>
</template>
