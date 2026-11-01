<script setup lang="ts">
import { isSolanaError, SOLANA_ERROR__WALLET__NOT_CONNECTED } from '@solana/kit';

defineProps<{ block?: boolean }>();

const { t } = useI18n();
const localePath = useLocalePath();
const intl = useIntlLocale();
const { wallets, connected, address, ready, status, balance, connect, disconnect, refreshBalance } = useWallet();
const { explorer, clusterLabel, isMainnet } = useSolana();
const { myTickets, myChance: chance, ticketPrice, pot, prize } = useLottery();
const solUsd = useSolPrice();
const faucet = useFaucet();
const toast = useToast();
const open = ref(false);
const dashOpen = ref(false);
const connecting = ref<string | null>(null);

const INSTALL = [
  { name: 'Phantom', to: 'https://phantom.com/download' },
  { name: 'Solflare', to: 'https://www.solflare.com/download/' },
  { name: 'Backpack', to: 'https://backpack.app/downloads' },
];

const ticketNumbers = computed(() =>
  [...myTickets.value]
    .map((ticket) => ticket.data.number)
    .sort((a, b) => a - b)
    .slice(0, 8),
);
const moreTickets = computed(() => Math.max(0, myTickets.value.length - ticketNumbers.value.length));

watch(dashOpen, (isOpen) => {
  if (isOpen) void refreshBalance();
});

// A wallet may never answer a connect request (its window fails to open, or
// it is stuck). Every choice stays clickable: picking again, or picking another
// wallet, supersedes the request that hangs, and only the latest one reports.
let attempts = 0;

async function choose(wallet: (typeof wallets.value)[number]) {
  const attempt = ++attempts;
  connecting.value = wallet.name;
  try {
    await connect(wallet);
    if (attempt === attempts) open.value = false;
  } catch (error) {
    if (attempt === attempts && (error as Error).name !== 'AbortError') {
      toast.add({
        title: t('wallet.failed', { wallet: wallet.name }),
        // The wallet answered without a Solana account (MetaMask without one does).
        description: isSolanaError(error, SOLANA_ERROR__WALLET__NOT_CONNECTED)
          ? t('wallet.noAccount', { wallet: wallet.name })
          : friendlyError(error, t),
        color: 'error',
      });
    }
  } finally {
    if (attempt === attempts) connecting.value = null;
  }
}

async function copyAddress() {
  await navigator.clipboard.writeText(address.value ?? '');
  toast.add({ title: t('wallet.copied'), icon: 'i-lucide-check', color: 'success', duration: 2_000 });
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
      <!-- No max-width: a percentage one lets the button size itself without the icon, and the chevron spills out. -->
      <img v-if="connected.wallet.icon" :src="connected.wallet.icon" alt="" class="size-5 max-w-none rounded" />
      <span class="font-mono" dir="ltr">{{ shortAddress(address) }}</span>
      <!-- On phones the bar is tight: the balance waits in the popover. -->
      <span v-if="balance !== null" class="hidden text-muted sm:inline">◎{{ formatSol(balance, 2) }}</span>
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
              class="mt-1 flex w-full items-center gap-1.5 text-start font-mono text-xs text-muted hover:text-highlighted"
              @click="copyAddress()"
            >
              <span class="truncate">{{ address }}</span>
              <UIcon name="i-lucide-copy" class="size-3.5 shrink-0" />
            </button>
          </div>
        </div>

        <div class="rounded-2xl px-4 py-3 shadow-(--neu-in-sm)">
          <p class="kicker text-[0.65rem]">{{ t('wallet.balance') }}</p>
          <p class="readout mt-1 font-mono text-3xl">
            {{ balance === null ? '—' : `◎${formatSol(balance, 4)}` }}
          </p>
          <p class="mt-0.5 font-mono text-xs text-muted tabular-nums">
            {{ balance === null ? '—' : formatUsd(balance, solUsd, intl) }}
            <span v-if="ticketPrice !== null && balance !== null" class="text-toned">
              ·
              {{
                balance >= ticketPrice
                  ? t('wallet.ticketsLeft', { n: formatNumber(balance / ticketPrice) }, Number(balance / ticketPrice))
                  : t('wallet.needMore')
              }}
            </span>
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <LotteryStat :label="t('stat.yourTickets')" :value="`×${myTickets.length}`" />
          <LotteryStat :label="t('stat.chance')" :value="formatPercent(chance, intl)" />
          <LotteryStat :label="t('stat.todaysPot')" :value="pot === 0n ? '—' : `◎${formatSol(prize, 2)}`" />
        </div>

        <div v-if="ticketNumbers.length" class="space-y-2">
          <p class="kicker text-[0.65rem]">{{ t('wallet.numbers') }}</p>
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
            :label="t('wallet.copy')"
            icon="i-lucide-copy"
            color="neutral"
            variant="soft"
            size="sm"
            block
            @click="copyAddress()"
          />
          <UButton
            :label="t('wallet.explorer')"
            icon="i-lucide-external-link"
            color="neutral"
            variant="soft"
            size="sm"
            block
            :to="explorer('address', address)"
            target="_blank"
          />
          <UButton
            v-if="faucet.available.value"
            :label="t('header.getSol')"
            icon="i-lucide-droplets"
            color="success"
            variant="soft"
            size="sm"
            block
            :to="faucet.url.value ?? undefined"
            :target="faucet.url.value ? '_blank' : undefined"
            :loading="faucet.busy.value"
            @click="faucet.request()"
          />
          <UButton
            :label="t('wallet.play')"
            icon="i-lucide-ticket"
            color="primary"
            variant="soft"
            size="sm"
            block
            :class="isMainnet ? 'col-span-2' : undefined"
            :to="localePath('/play')"
            @click="dashOpen = false"
          />
        </div>

        <UButton
          :label="t('wallet.disconnect')"
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

  <UModal v-else v-model:open="open" :title="t('wallet.title')" :description="t('wallet.description')">
    <!-- Never disabled: a wallet that hangs while reconnecting or connecting must not lock the player out. -->
    <UButton
      :label="t('wallet.connect')"
      :icon="!ready || status === 'connecting' ? 'i-lucide-loader-circle' : 'i-lucide-wallet'"
      :block="block"
      :ui="{ leadingIcon: !ready || status === 'connecting' ? 'animate-spin' : '' }"
      class="bg-lucky text-white shadow-(--neu-accent) hover:opacity-90 active:shadow-(--neu-in-sm)"
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
          :icon="connecting === wallet.name ? 'i-lucide-loader-circle' : undefined"
          :ui="{ leadingIcon: 'animate-spin' }"
          class="justify-start"
          @click="choose(wallet)"
        >
          <img :src="wallet.icon" alt="" class="size-6 rounded" />
          {{ wallet.name }}
        </UButton>
      </div>
      <div v-else class="space-y-3 text-sm text-muted">
        <p>{{ t('wallet.none') }}</p>
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
