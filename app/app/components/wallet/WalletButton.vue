<script setup lang="ts">
defineProps<{ block?: boolean }>();

const { wallets, connected, address, ready, status, balance, connect, disconnect, refreshBalance } = useWallet();
const { explorer, clusterLabel, isMainnet } = useSolana();
const { myTickets, tickets: dayTickets, ticketPrice, pot, prize } = useLottery();
const solUsd = useSolPrice();
const toast = useToast();
const open = ref(false);
const dashOpen = ref(false);
const connecting = ref<string | null>(null);

const INSTALL = [
  { name: 'Phantom', to: 'https://phantom.com/download' },
  { name: 'Solflare', to: 'https://www.solflare.com/download/' },
  { name: 'Backpack', to: 'https://backpack.app/downloads' },
];

const chance = computed(() => (myTickets.value.length ? myTickets.value.length / dayTickets.value.length : null));
const ticketNumbers = computed(() =>
  [...myTickets.value]
    .map((t) => t.data.number)
    .sort((a, b) => a - b)
    .slice(0, 8),
);
const moreTickets = computed(() => Math.max(0, myTickets.value.length - ticketNumbers.value.length));

watch(dashOpen, (isOpen) => {
  if (isOpen) void refreshBalance();
});

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

async function copyAddress() {
  await navigator.clipboard.writeText(address.value ?? '');
  toast.add({ title: 'Address copied', icon: 'i-lucide-check', color: 'success', duration: 2_000 });
}

async function signOut() {
  dashOpen.value = false;
  await disconnect();
}
</script>

<template>
  <UPopover
    v-if="connected && address"
    v-model:open="dashOpen"
    :content="{ align: 'end', sideOffset: 8 }"
    :ui="{ content: 'w-[min(100vw-2rem,22rem)] p-0' }"
  >
    <UButton color="neutral" variant="outline" :block="block" trailing-icon="i-lucide-chevron-down">
      <img v-if="connected.wallet.icon" :src="connected.wallet.icon" alt="" class="size-5 rounded" />
      <span class="font-mono">{{ shortAddress(address) }}</span>
      <span v-if="balance !== null" class="text-muted">◎{{ formatSol(balance, 2) }}</span>
    </UButton>

    <template #content>
      <div class="space-y-4 p-4">
        <div class="flex items-start gap-3">
          <img v-if="connected.wallet.icon" :src="connected.wallet.icon" alt="" class="size-10 shrink-0 rounded-lg" />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate font-semibold text-highlighted">{{ connected.wallet.name }}</p>
              <UBadge :label="clusterLabel" color="warning" variant="subtle" size="sm" />
            </div>
            <button
              type="button"
              class="mt-1 flex w-full items-center gap-1.5 text-left font-mono text-xs text-muted hover:text-highlighted"
              @click="copyAddress()"
            >
              <span class="truncate">{{ address }}</span>
              <UIcon name="i-lucide-copy" class="size-3.5 shrink-0" />
            </button>
          </div>
        </div>

        <div class="rounded-lg bg-elevated px-4 py-3">
          <p class="kicker text-[0.65rem]">Balance</p>
          <p class="led mt-1 font-mono text-3xl font-semibold tabular-nums text-highlighted">
            {{ balance === null ? '—' : `◎${formatSol(balance, 4)}` }}
          </p>
          <p class="mt-0.5 font-mono text-xs text-muted tabular-nums">
            {{ balance === null ? '—' : formatUsd(balance, solUsd) }}
            <span v-if="ticketPrice !== null && balance !== null" class="text-toned">
              ·
              {{
                balance >= ticketPrice
                  ? `${formatNumber(balance / ticketPrice)} ticket${balance / ticketPrice === 1n ? '' : 's'} left`
                  : 'need more SOL to play'
              }}
            </span>
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <LotteryStat label="Your tickets" :value="`×${myTickets.length}`" />
          <LotteryStat label="Chance" :value="formatPercent(chance)" />
          <LotteryStat label="Today's pot" :value="pot === 0n ? '—' : `◎${formatSol(prize, 2)}`" />
        </div>

        <div v-if="ticketNumbers.length" class="space-y-2">
          <p class="kicker text-[0.65rem]">Your numbers today</p>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="n in ticketNumbers"
              :key="n"
              :label="formatNumber(n)"
              color="neutral"
              variant="subtle"
              class="font-mono tabular-nums"
            />
            <UBadge v-if="moreTickets" :label="`+${moreTickets}`" color="neutral" variant="outline" class="font-mono" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <UButton
            label="Copy address"
            icon="i-lucide-copy"
            color="neutral"
            variant="soft"
            size="sm"
            block
            @click="copyAddress()"
          />
          <UButton
            label="Explorer"
            icon="i-lucide-external-link"
            color="neutral"
            variant="soft"
            size="sm"
            block
            :to="explorer('address', address)"
            target="_blank"
          />
          <UButton
            v-if="!isMainnet"
            label="Get SOL"
            icon="i-lucide-droplets"
            color="success"
            variant="soft"
            size="sm"
            block
            :to="`https://faucet.solana.com/?address=${encodeURIComponent(address)}`"
            target="_blank"
          />
          <UButton
            label="Play"
            icon="i-lucide-ticket"
            color="primary"
            variant="soft"
            size="sm"
            block
            :class="isMainnet ? 'col-span-2' : undefined"
            to="/play"
            @click="dashOpen = false"
          />
        </div>

        <UButton
          label="Disconnect"
          icon="i-lucide-log-out"
          color="error"
          variant="ghost"
          size="sm"
          block
          @click="signOut()"
        />
      </div>
    </template>
  </UPopover>

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
