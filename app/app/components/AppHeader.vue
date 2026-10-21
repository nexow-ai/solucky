<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { lamports } from '@solana/kit';

/** Provisional beta faucet: enough for a handful of ◎0.1 tickets on non-mainnet. */
const AIRDROP_LAMPORTS = 1_000_000_000n;

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
const { client, cluster, clusterLabel, isMainnet } = useSolana();
const { address, balance, refreshBalance } = useWallet();
const sound = useSound();
const toast = useToast();
const airdropping = ref(false);

const items = computed<NavigationMenuItem[]>(() => [
  { label: t('nav.play'), to: localePath('/play'), icon: 'i-lucide-ticket', active: route.path === localePath('/play') },
  { label: t('nav.how'), to: localePath({ path: '/', hash: '#how-it-works' }), exactHash: true },
  { label: t('nav.fairness'), to: localePath({ path: '/', hash: '#fairness' }), exactHash: true },
  { label: t('nav.faq'), to: localePath({ path: '/', hash: '#faq' }), exactHash: true },
]);

function faucetUrl(owner: string) {
  return `https://faucet.solana.com/?address=${encodeURIComponent(owner)}`;
}

async function openWebFaucet(owner: string) {
  try {
    await navigator.clipboard.writeText(owner);
  } catch {
    // Clipboard may be blocked; the URL still carries the address.
  }
  window.open(faucetUrl(owner), '_blank', 'noopener,noreferrer');
}

/** Wait until the wallet balance rises after a local requestAirdrop. */
async function waitForAirdrop(before: bigint | null) {
  for (let i = 0; i < 20; i++) {
    await refreshBalance();
    const next = balance.value === null ? null : BigInt(balance.value);
    if (next !== null && (before === null || next > before)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(t('faucet.slow'));
}

async function airdropSol() {
  const owner = address.value;
  if (!owner) {
    toast.add({
      title: t('faucet.connectFirst'),
      description: t('faucet.connectFirstHint'),
      color: 'warning',
      icon: 'i-lucide-wallet',
    });
    return;
  }
  if (airdropping.value) return;
  airdropping.value = true;
  try {
    // Public RPCs rate-limit requestAirdrop (often 429). Use the web faucet on
    // shared clusters; only the local validator can airdrop reliably.
    if (cluster !== 'localnet') {
      await openWebFaucet(owner);
      toast.add({
        title: t('faucet.request'),
        description: t('faucet.requestHint'),
        color: 'success',
        icon: 'i-lucide-external-link',
        actions: [{ label: t('faucet.openAgain'), onClick: () => void openWebFaucet(owner) }],
      });
      return;
    }

    const before = balance.value === null ? null : BigInt(balance.value);
    await client.rpc.requestAirdrop(owner, lamports(AIRDROP_LAMPORTS), { commitment: 'confirmed' }).send();
    await waitForAirdrop(before);
    toast.add({
      title: t('faucet.airdropped'),
      description: t('faucet.airdroppedHint', { cluster: clusterLabel }),
      color: 'success',
      icon: 'i-lucide-sparkles',
    });
  } catch (error) {
    toast.add({
      title: t('faucet.failed'),
      description: friendlyError(error, t),
      color: 'error',
      icon: 'i-lucide-cloud-off',
    });
  } finally {
    airdropping.value = false;
  }
}
</script>

<template>
  <UHeader
    :to="localePath('/')"
    title="S☉Lucky"
    :ui="{
      root: 'border-b-0 bg-default/60 backdrop-blur-md after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-linear-to-r after:from-transparent after:via-primary/70 after:to-transparent',
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
          class="hidden font-mono tracking-wider uppercase sm:inline-flex"
        />
      </span>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{ link: 'font-mono text-xs tracking-[0.16em] uppercase', linkLeadingIcon: 'size-4' }"
    />

    <template #right>
      <UBadge v-if="!isMainnet" :label="clusterLabel" color="warning" variant="subtle" class="hidden sm:inline-flex" />
      <UTooltip v-if="!isMainnet" :text="t('header.faucetTip')">
        <UButton
          :label="t('header.getSol')"
          :aria-label="t('header.getSol')"
          icon="i-lucide-droplets"
          :ui="{ label: 'hidden sm:inline' }"
          size="xs"
          color="success"
          variant="soft"
          :loading="airdropping"
          class="font-mono uppercase tracking-wider"
          @click="airdropSol()"
        />
      </UTooltip>
      <UTooltip :text="sound.enabled.value ? t('header.mute') : t('header.unmute')">
        <UButton
          :icon="sound.enabled.value ? 'i-lucide-volume-2' : 'i-lucide-volume-x'"
          color="neutral"
          variant="ghost"
          :aria-label="sound.enabled.value ? t('header.mute') : t('header.unmute')"
          @click="sound.toggle()"
        />
      </UTooltip>
      <AppLangMenu />
      <UColorModeButton />
      <ClientOnly>
        <LazyWalletButton class="hidden sm:inline-flex" />
        <template #fallback>
          <USkeleton class="hidden h-8 w-36 sm:block" />
        </template>
      </ClientOnly>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      <UButton
        v-if="!isMainnet"
        :label="t('header.getSol')"
        icon="i-lucide-droplets"
        color="success"
        variant="soft"
        block
        class="mt-4 font-mono uppercase tracking-wider"
        :loading="airdropping"
        @click="airdropSol()"
      />
      <ClientOnly>
        <LazyWalletButton block class="mt-4" />
      </ClientOnly>
    </template>
  </UHeader>
</template>
