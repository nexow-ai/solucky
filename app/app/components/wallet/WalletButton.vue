<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

defineProps<{ block?: boolean }>();

const { wallets, connected, address, ready, status, balance, connect, disconnect } = useWallet();
const { explorer } = useSolana();
const toast = useToast();
const open = ref(false);
const connecting = ref<string | null>(null);

const INSTALL = [
  { name: 'Phantom', to: 'https://phantom.com/download' },
  { name: 'Solflare', to: 'https://www.solflare.com/download/' },
  { name: 'Backpack', to: 'https://backpack.app/downloads' },
];

async function choose(wallet: (typeof wallets.value)[number]) {
  connecting.value = wallet.name;
  try {
    await connect(wallet);
    open.value = false;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      toast.add({ title: `Could not connect ${wallet.name}`, description: friendlyError(error), color: 'error' });
    }
  } finally {
    connecting.value = null;
  }
}

const menu = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Copy address',
      icon: 'i-lucide-copy',
      onSelect: async () => {
        await navigator.clipboard.writeText(address.value ?? '');
        toast.add({ title: 'Address copied', icon: 'i-lucide-check', color: 'success', duration: 2_000 });
      },
    },
    {
      label: 'View in explorer',
      icon: 'i-lucide-external-link',
      to: explorer('address', address.value ?? ''),
      target: '_blank',
    },
  ],
  [{ label: 'Disconnect', icon: 'i-lucide-log-out', color: 'error', onSelect: () => void disconnect() }],
]);
</script>

<template>
  <UDropdownMenu v-if="connected && address" :items="menu" :content="{ align: 'end' }">
    <UButton color="neutral" variant="outline" :block="block" trailing-icon="i-lucide-chevron-down">
      <img v-if="connected.wallet.icon" :src="connected.wallet.icon" alt="" class="size-5 rounded" />
      <span class="font-mono">{{ shortAddress(address) }}</span>
      <span v-if="balance !== null" class="text-muted">◎{{ formatSol(balance, 2) }}</span>
    </UButton>
  </UDropdownMenu>

  <UModal
    v-else
    v-model:open="open"
    title="Connect a wallet"
    description="Any Solana wallet that supports the Wallet Standard works."
  >
    <UButton
      label="Connect wallet"
      icon="i-lucide-wallet"
      :block="block"
      :loading="!ready || status === 'connecting'"
      class="bg-lucky text-white hover:opacity-90"
    />

    <template #body>
      <div v-if="wallets.length" class="grid gap-2">
        <UButton
          v-for="wallet in wallets"
          :key="wallet.name"
          color="neutral"
          variant="outline"
          size="lg"
          block
          :loading="connecting === wallet.name"
          :disabled="!!connecting && connecting !== wallet.name"
          class="justify-start"
          @click="choose(wallet)"
        >
          <img :src="wallet.icon" alt="" class="size-6 rounded" />
          {{ wallet.name }}
        </UButton>
      </div>
      <div v-else class="space-y-3 text-sm text-muted">
        <p>No Solana wallet was found in this browser. Install one, then reload the page:</p>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="wallet in INSTALL"
            :key="wallet.name"
            :label="wallet.name"
            :to="wallet.to"
            target="_blank"
            color="neutral"
            variant="subtle"
            trailing-icon="i-lucide-external-link"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
