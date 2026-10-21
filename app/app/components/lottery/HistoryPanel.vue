<script setup lang="ts">
import type { Account } from '@solana/kit';
import { countryFromBytes, flagEmoji, formatDay, type Ticket } from '@solucky/client';

const { t } = useI18n();
const localePath = useLocalePath();
const { settled, pending, totals, busy, settle, reclaimable, reclaim, loading } = useLottery();
const { connected, address } = useWallet();

const leftovers = ref<Account<Ticket>[]>([]);
async function loadLeftovers() {
  leftovers.value = connected.value ? await reclaimable().catch(() => []) : [];
}
watch([address, () => settled.value.length], loadLeftovers, { immediate: true });

async function reclaimAll() {
  await reclaim(leftovers.value);
  await loadLeftovers();
}
</script>

<template>
  <LotteryGlass tint="secondary">
    <div class="space-y-6 p-5 sm:p-6">
      <header class="text-center">
        <p class="kicker">S☉Lucky</p>
        <h2 class="text-3xl font-semibold tracking-[0.28em] text-muted uppercase">{{ t('history.title') }}</h2>
        <p class="mt-4 flex items-baseline justify-center gap-3">
          <span class="kicker text-sm">{{ t('history.total') }}</span>
          <span
            class="glow-secondary led font-mono text-5xl font-semibold text-secondary tabular-nums [--led-pitch:0.07em]"
          >
            {{ totals.rounds }}
          </span>
          <span class="kicker text-sm">{{ t('history.games', totals.rounds) }}</span>
        </p>
      </header>

      <div class="tray grid grid-cols-2 gap-3 px-2 py-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <LotteryStat :label="t('stat.tickets')" :value="formatNumber(totals.tickets)" />
        <LotteryStat :label="t('stat.winners')" :value="totals.winners" />
        <LotteryStat :label="t('stat.averagePot')" :value="`◎${formatSol(totals.averagePot, 2)}`" />
        <LotteryStat :label="t('stat.biggestPot')" :value="`◎${formatSol(totals.biggestPot, 2)}`" />
      </div>

      <div v-if="pending.length" class="space-y-2">
        <p class="kicker text-center">{{ t('history.waiting') }}</p>
        <div
          v-for="round in pending"
          :key="round.address"
          class="pending flex items-center justify-between gap-2 px-3 py-2 text-sm"
        >
          <div class="min-w-0">
            <ULink :to="localePath(`/rounds/${formatDay(round.data.day)}`)" class="font-semibold hover:text-primary">
              {{ formatDay(round.data.day) }}
            </ULink>
            <span class="ms-2 font-mono text-muted tabular-nums">◎{{ formatSol(round.data.pot, 3) }}</span>
            <div class="mt-1"><LotteryStatusBadge :status="round.data.status" /></div>
          </div>
          <UButton
            v-if="connected"
            :label="t('history.settle')"
            :aria-label="t('history.settleDay', { day: formatDay(round.data.day) })"
            icon="i-lucide-gavel"
            size="sm"
            color="primary"
            variant="soft"
            :loading="busy"
            @click="settle(round)"
          />
        </div>
        <p class="text-center text-xs text-muted">
          {{ t('history.anyone') }}
        </p>
      </div>

      <UAlert
        v-if="leftovers.length"
        color="info"
        variant="subtle"
        icon="i-lucide-coins"
        :title="
          t(
            'history.rent',
            { n: leftovers.length, sol: formatSol(leftovers.reduce((n, ticket) => n + ticket.lamports, 0n), 4) },
            leftovers.length,
          )
        "
        :description="t('history.rentHint')"
        :actions="[{ label: t('history.getBack'), color: 'info', variant: 'solid', loading: busy, onClick: reclaimAll }]"
      />

      <LotteryPotChart :rounds="settled" />

      <div>
        <p class="kicker mb-3 text-center">{{ t('history.winners') }}</p>
        <div class="well h-64 overflow-y-auto p-2">
          <div v-if="loading" class="space-y-2 p-1">
            <USkeleton v-for="i in 5" :key="i" class="h-5 w-full" />
          </div>
          <UEmpty
            v-else-if="!settled.length"
            icon="i-lucide-trophy"
            :title="t('history.noWinners')"
            :description="t('history.firstDraw')"
            variant="naked"
            class="h-full"
          />
          <ol v-else class="space-y-0.5 text-xs">
            <li v-for="round in settled" :key="round.address">
              <NuxtLink
                :to="localePath(`/rounds/${formatDay(round.data.day)}`)"
                class="row grid grid-cols-12 items-center gap-2 rounded-lg px-2 py-1.5 tabular-nums"
                :class="round.data.winner === address ? 'mine font-semibold text-primary' : 'text-toned'"
              >
                <span class="col-span-3 font-mono text-muted">{{ formatDay(round.data.day).slice(2) }}</span>
                <span class="col-span-2 font-mono font-semibold text-secondary"
                  >◎{{ formatSol(round.data.pot, 2) }}</span
                >
                <span class="col-span-3 truncate font-mono" dir="ltr">{{ shortAddress(round.data.winner) }}</span>
                <span class="col-span-1 text-center">{{ flagEmoji(countryFromBytes(round.data.winnerCountry)) }}</span>
                <span class="col-span-3 text-end font-mono whitespace-nowrap">{{
                  formatNumber(round.data.winningNumber)
                }}</span>
              </NuxtLink>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </LotteryGlass>
</template>

<style scoped>
.tray {
  border-radius: 1rem;
  background: color-mix(in oklab, black 20%, transparent);
  box-shadow:
    inset 0 1px 4px color-mix(in oklab, black 50%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 5%, transparent);
}

.well {
  border-radius: 1.1rem;
  background: color-mix(in oklab, black 32%, transparent);
  box-shadow:
    inset 0 2px 12px color-mix(in oklab, black 65%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 5%, transparent);
  scrollbar-width: thin;
}

.pending {
  border-radius: 1rem;
  background: color-mix(in oklab, var(--ui-warning) 8%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ui-warning) 30%, transparent);
}

.row {
  transition: background 0.3s;
}

.row:hover {
  background: color-mix(in oklab, var(--ui-secondary) 8%, transparent);
}

.row.mine {
  background: color-mix(in oklab, var(--ui-primary) 12%, transparent);
  box-shadow: inset 2px 0 0 var(--ui-primary);
}

.row.mine:dir(rtl) {
  box-shadow: inset -2px 0 0 var(--ui-primary);
}
</style>
