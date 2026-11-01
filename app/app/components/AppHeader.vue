<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
const faucet = useFaucet();

const isHome = computed(() => route.path === localePath('/'));

const drawerItems = computed<NavigationMenuItem[]>(() => [
  {
    label: t('nav.play'),
    to: localePath('/play'),
    icon: 'i-lucide-ticket',
    active: route.path === localePath('/play'),
  },
  { label: t('nav.how'), to: localePath({ path: '/', hash: '#how-it-works' }), exactHash: true },
  { label: t('nav.fairness'), to: localePath({ path: '/', hash: '#fairness' }), exactHash: true },
  { label: t('nav.faq'), to: localePath({ path: '/', hash: '#faq' }), exactHash: true },
]);

/** On the landing page, section links live in LandingSectionIndex (lg+); keep them in the mobile drawer. */
const items = computed(() => (isHome.value ? [] : drawerItems.value));
</script>

<template>
  <UHeader
    :to="localePath('/')"
    title="S☉Lucky"
    :ui="{
      root: 'border-b-0 bg-default/60 backdrop-blur-md after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-linear-to-r after:from-transparent after:via-primary/70 after:to-transparent',
      // The links, the network selector and the wallet only fit side by side
      // from xl on; below that the links stay in the menu.
      center: 'lg:max-xl:hidden',
      // The sides split the bar evenly to center the links; when the buttons
      // need more than half, the links move over instead of the labels wrapping.
      right: 'whitespace-nowrap',
      toggle: 'lg:max-xl:inline-flex',
      overlay: 'lg:max-xl:block',
      content: 'lg:max-xl:flex',
    }"
  >
    <template #title>
      <span class="flex items-center gap-2">
        <AppLogo />
        <UBadge
          :label="t('header.beta')"
          color="primary"
          variant="subtle"
          size="sm"
          class="hidden font-mono tracking-wider uppercase sm:max-xl:inline-flex"
        />
      </span>
    </template>

    <UNavigationMenu
      v-if="items.length"
      :items="items"
      variant="link"
      :ui="{
        link: 'font-mono text-xs tracking-[0.16em] uppercase',
        linkLeadingIcon: 'size-4',
      }"
    />

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
            :ui="{ label: 'hidden md:max-xl:inline' }"
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
      <UNavigationMenu :items="drawerItems" orientation="vertical" class="-mx-2.5" />
      <ClientOnly>
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
      </ClientOnly>
    </template>
  </UHeader>
</template>
