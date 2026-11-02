<script setup lang="ts">
import type { Account } from '@solana/kit';
import { countryFromBytes, flagEmoji, GameKind, type Ticket } from '@solucky/client';

const { t } = useI18n();
const localePath = useLocalePath();
const { lottery, settled, pending, totals, busy, settle, reclaimable, reclaim, loading } = useLottery();
const { connected, address } = useWallet();

const leftovers = ref<Account<Ticket>[]>([]);
async function loadLeftovers() {
  leftovers.value = connected.value ? await reclaimable().catch(() => []) : [];
}
watch([address, () => settled.value.length], loadLeftovers, { immediate: true });

/** A round's name, short enough for the winners list: `26-10-21`, `10-21 14:00`, `#3`. */
function shortTitle(kind: number, period: number) {
  const title = roundTitle(kind, period);
  if (kind === GameKind.Daily) return title.slice(2);
  return kind === GameKind.Hourly ? title.slice(5, 16) : title;
}

// The rounds counter counts up to its value.
const roundsShown = useTween(() => totals.value.rounds, 1_400);

async function reclaimAll() {
  await reclaim(leftovers.value);
  await loadLeftovers();
}
</script>

<template>
  <LotterySurface>
    <div class="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-10">
      <div class="min-w-0 space-y-6">
        <header class="flex flex-wrap items-end justify-between gap-4">
          <h2
            class="min-w-0 text-2xl font-light tracking-[0.16em] wrap-break-word text-highlighted uppercase sm:text-3xl sm:tracking-[0.24em]"
          >
            {{ t('history.title') }}
          </h2>
          <p class="flex items-baseline gap-2.5">
            <span class="kicker">{{ t('history.total') }}</span>
            <span class="readout font-mono text-4xl leading-none">{{ Math.round(roundsShown) }}</span>
            <span class="kicker">{{ t('history.games', totals.rounds) }}</span>
          </p>
        </header>

        <div class="grid grid-cols-2 gap-3 rounded-[1.5rem] px-2 py-4 shadow-(--neu-in-sm) sm:grid-cols-4">
          <LotteryStat :label="t('stat.tickets')" :value="formatNumber(totals.tickets)" />
          <LotteryStat :label="t('stat.winners')" :value="totals.winners" />
          <LotteryStat :label="t('stat.averagePot')" :value="`◎${formatSol(totals.averagePot, 2)}`" />
          <LotteryStat :label="t('stat.biggestPot')" :value="`◎${formatSol(totals.biggestPot, 2)}`" />
        </div>

        <LotteryPotChart :rounds="settled" />
      </div>

      <div class="min-w-0 space-y-6">
        <div v-if="pending.length" class="space-y-2">
          <p class="kicker">{{ t('history.waiting') }}</p>
          <div
            v-for="round in pending"
            :key="round.address"
            class="pending flex items-center justify-between gap-2 px-3 py-2 text-sm"
          >
            <div class="min-w-0">
              <ULink
                :to="localePath(roundPath(round.data.kind, round.data.period))"
                class="font-semibold hover:text-primary"
                dir="ltr"
              >
                {{ roundTitle(round.data.kind, round.data.period) }}
              </ULink>
              <span class="ms-2 font-mono text-muted tabular-nums">◎{{ formatSol(round.data.pot, 3) }}</span>
              <div class="mt-1"><LotteryStatusBadge :status="round.data.status" :lottery="lottery" /></div>
            </div>
            <UButton
              v-if="connected"
              :label="t('history.settle')"
              :aria-label="t('history.settleDay', { day: roundTitle(round.data.kind, round.data.period) })"
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
              {
                n: leftovers.length,
                sol: formatSol(
                  leftovers.reduce((n, ticket) => n + ticket.lamports, 0n),
                  4,
                ),
              },
              leftovers.length,
            )
          "
          :description="t('history.rentHint')"
          :actions="[
            { label: t('history.getBack'), color: 'info', variant: 'solid', loading: busy, onClick: reclaimAll },
          ]"
        />

        <div>
          <p class="kicker mb-3">{{ t('history.winners') }}</p>
          <div class="well h-72 overflow-y-auto p-2.5">
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
              <li v-for="(round, i) in settled" :key="round.address" class="appear" :style="{ '--i': Math.min(i, 14) }">
                <NuxtLink
                  :to="localePath(roundPath(round.data.kind, round.data.period))"
                  class="row grid grid-cols-[auto_4rem_minmax(0,1fr)_1.25rem_auto] items-center gap-2 rounded-lg px-2 py-1.5 tabular-nums sm:gap-3"
                  :class="round.data.winner === address ? 'mine text-primary' : 'text-toned'"
                >
                  <span class="font-mono whitespace-nowrap text-muted" dir="ltr">{{
                    shortTitle(round.data.kind, round.data.period)
                  }}</span>
                  <span class="truncate font-mono text-secondary">◎{{ formatSol(round.data.pot, 2) }}</span>
                  <span class="truncate font-mono" dir="ltr">{{ shortAddress(round.data.winner) }}</span>
                  <span class="text-center">{{ flagEmoji(countryFromBytes(round.data.winnerCountry)) }}</span>
                  <span class="text-end font-mono whitespace-nowrap">{{ formatNumber(round.data.winningNumber) }}</span>
                </NuxtLink>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </LotterySurface>
</template>

<style scoped>
/* A finished round waiting for its draw: a strip pressed into the panel, with a warm edge. */
.pending {
  border-radius: 1.25rem;
  box-shadow:
    var(--neu-in-sm),
    inset 3px 0 0 var(--ui-warning);
}

.pending:dir(rtl) {
  box-shadow:
    var(--neu-in-sm),
    inset -3px 0 0 var(--ui-warning);
}

.well {
  border-radius: 1.4rem;
  box-shadow: var(--neu-in);
  scrollbar-width: thin;
}

/* The winners list cascades in when it first fills. */
@media (prefers-reduced-motion: no-preference) {
  .appear {
    animation: appear 0.6s var(--ease-out-expo) backwards;
    animation-delay: calc(var(--i) * 45ms + 150ms);
  }
}

@keyframes appear {
  from {
    opacity: 0;
    translate: 0 0.6rem;
  }
}

.row {
  transition: background 0.3s;
}

@media (hover: hover) {
  .row:hover {
    background: color-mix(in oklab, var(--ui-text-muted) 7%, transparent);
  }
}

.row.mine {
  background: color-mix(in oklab, var(--ui-primary) 9%, transparent);
}
</style>
