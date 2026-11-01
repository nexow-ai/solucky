<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const faucet = useFaucet();

// The bar is the same on every page: logo, the game tabs, network, language
// and wallet, with no menu behind a toggle. The game tabs sit in its middle
// on wide screens and get a row of their own under it below xl. UHeader
// names the logo's link after the plain text in its title slot (comments
// included, in development), so the slot holds components only: the Beta
// badge is a UBadge.
</script>

<template>
  <UHeader
    :to="localePath('/')"
    title="S☉Lucky"
    :toggle="false"
    :ui="{
      // The bar keeps its height; the game tabs' row (below xl) adds to it.
      root: 'h-auto',
      container: 'h-(--ui-header-height)',
      // Nuxt UI shows the middle from lg; the game tabs need it from xl only.
      center: 'hidden lg:hidden xl:flex',
      // Button labels never wrap: a tight bar hides them first (below).
      right: 'whitespace-nowrap',
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

    <AppGameTabs />

    <template #bottom>
      <UContainer class="pb-2.5 xl:hidden">
        <AppGameTabs wide />
      </UContainer>
    </template>

    <template #right>
      <AppNetwork class="max-lg:hidden" />
      <!-- Only for a connected wallet under ◎0.1; its balance lives in the browser, so the button does too. -->
      <ClientOnly>
        <UTooltip
          v-if="faucet.low.value"
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
        <LazyWalletButton />
        <template #fallback>
          <USkeleton class="h-8 w-36" />
        </template>
      </ClientOnly>
    </template>
  </UHeader>
</template>
