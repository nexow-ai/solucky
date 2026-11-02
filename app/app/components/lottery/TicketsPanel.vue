<script setup lang="ts">
import { countryFromBytes, flagEmoji, RoundStatus } from '@solucky/client';

/**
 * The tickets of the round on sale: the connected wallet's own as stubs, each
 * with what it holds right now (its chance in a lottery, its check in Guess),
 * then every number in play as it lands.
 */
const { t } = useI18n();
const intl = useIntlLocale();
const { lottery, tickets, myTickets, myChance, maxNumber, takenNumbers, round, checked, loading } = useLottery();
const { address, connected } = useWallet();
const { explorer } = useSolana();

const sorted = computed(() => sortNumbers(takenNumbers.value));
const newestFirst = computed(() => [...tickets.value].reverse());

/** The search over the numbers in play: a number, a wallet or a country. */
const query = ref('');
const searching = computed(() => query.value.trim() !== '');
const shown = computed(() =>
  searchTickets(newestFirst.value, query.value, (ticket) => ({
    number: ticket.data.number,
    owner: ticket.data.owner,
    country: countryName(countryFromBytes(ticket.data.country), intl.value, t('country.private')),
  })),
);
// A new search starts at the top of the list.
const well = useTemplateRef('well');
watch(query, () => well.value?.scrollTo({ top: 0 }));

interface Stub {
  key: string;
  number: number;
  cc: string | null;
  /** Lotteries: the share of the draw the ticket wins on now. */
  share: number | null;
  /** Guess: how its check went. */
  state: 'won' | 'missed' | 'waiting' | null;
}

/** Your tickets, newest first. */
const stubs = computed(() => {
  const r = round.value?.data;
  return [...myTickets.value].reverse().map((ticket): Stub => {
    const { number, index } = ticket.data;
    const base = { key: ticket.address, number, cc: countryFromBytes(ticket.data.country) };
    if (lottery.value) return { ...base, share: shareOf(sorted.value, number, maxNumber.value), state: null };
    const won = !!r && r.status >= RoundStatus.Drawn && index === r.winningIndex;
    return { ...base, share: null, state: won ? 'won' : index < checked.value ? 'missed' : 'waiting' };
  });
});
</script>

<template>
  <LotterySurface>
    <div class="flex h-full flex-col gap-7 p-6 sm:p-7">
      <section>
        <header class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 class="kicker flex items-center gap-2">
            <UIcon name="i-lucide-ticket" class="size-4 text-primary" />
            {{ t('stat.yourTickets') }}
            <span class="count font-mono tabular-nums">{{ myTickets.length }}</span>
          </h2>
          <p v-if="myChance !== null" class="flex items-baseline gap-2">
            <span class="kicker text-[0.65rem]">{{ t('stat.winChance') }}</span>
            <LotteryPercent :ratio="myChance" class="chance font-mono text-lg tabular-nums" />
          </p>
        </header>

        <div v-if="stubs.length" class="stubs mt-4" role="group" :aria-label="t('stat.yourTickets')">
          <TransitionGroup name="stub">
            <div
              v-for="(stub, i) in stubs"
              :key="stub.key"
              class="stub"
              :data-state="stub.state ?? undefined"
              :style="{ '--i': Math.min(i, 8) }"
            >
              <span class="stub-flag" aria-hidden="true">{{ flagEmoji(stub.cc) }}</span>
              <span class="stub-number font-mono tabular-nums" dir="ltr">{{ formatNumber(stub.number) }}</span>
              <LotteryPercent v-if="stub.share !== null" :ratio="stub.share" class="stub-meta font-mono tabular-nums" />
              <span v-else class="stub-meta">
                {{
                  stub.state === 'won'
                    ? t('tickets.won')
                    : stub.state === 'missed'
                      ? t('tickets.missed')
                      : t('stat.waiting')
                }}
              </span>
            </div>
          </TransitionGroup>
        </div>
        <div v-else class="empty mt-4">
          <span class="empty-stub" aria-hidden="true">
            <UIcon name="i-lucide-ticket-plus" class="size-5" />
          </span>
          <p class="text-sm text-pretty text-muted">{{ connected ? t('tickets.none') : t('tickets.connect') }}</p>
        </div>
      </section>

      <section class="flex min-h-0 flex-1 flex-col">
        <h2 class="kicker mb-3 flex items-center gap-2">
          <span class="live-dot" aria-hidden="true" />
          {{ t('pot.inPlay') }}
          <span class="ms-auto font-mono tabular-nums" dir="ltr">
            <template v-if="searching">{{ formatNumber(shown.length) }} / </template>{{ formatNumber(tickets.length) }}
          </span>
        </h2>
        <UInput
          v-if="tickets.length"
          v-model="query"
          icon="i-lucide-search"
          size="sm"
          :placeholder="t('pot.search')"
          :aria-label="t('pot.search')"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="search"
          class="mb-3 w-full"
          :ui="{ base: 'text-base sm:text-sm', trailing: 'pe-1' }"
          data-ticket-search
          @keydown.esc="query = ''"
        >
          <template v-if="query" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="xs"
              icon="i-lucide-circle-x"
              :aria-label="t('pot.clearSearch')"
              @click="query = ''"
            />
          </template>
        </UInput>
        <!--
          The list scrolls in its well and never makes the panel taller: the
          well fills this box (its content cannot size it), which is 20rem high
          below lg and, from lg, the height the play panel beside it leaves
          (at least 18rem).
        -->
        <div class="relative h-80 lg:h-auto lg:min-h-72 lg:flex-1">
          <div ref="well" class="well absolute inset-0 overflow-y-auto overscroll-contain p-2.5" data-ticket-well>
            <div v-if="loading" class="space-y-2 p-1">
              <USkeleton v-for="i in 6" :key="i" class="h-5 w-full" />
            </div>
            <UEmpty
              v-else-if="!tickets.length"
              icon="i-lucide-ticket"
              :title="t('pot.empty')"
              :description="t('pot.beFirst')"
              variant="naked"
              class="h-full"
            />
            <UEmpty
              v-else-if="!shown.length"
              icon="i-lucide-search-x"
              :title="t('pot.noMatch', { query: query.trim() })"
              variant="naked"
              class="h-full"
            />
            <!-- Keyed by the search, so a new one swaps the list instead of dropping its rows in as new tickets. -->
            <TransitionGroup v-else :key="query.trim()" tag="ol" name="row" class="space-y-0.5 text-xs">
              <li
                v-for="ticket in shown"
                :key="ticket.address"
                class="row grid grid-cols-12 items-center gap-2 rounded-lg px-2 py-1.5 tabular-nums"
                :class="ticket.data.owner === address ? 'mine text-primary' : 'text-toned'"
              >
                <span class="col-span-3 font-mono text-muted">{{ formatUtcTime(ticket.data.createdAt) }}</span>
                <ULink
                  :to="explorer('address', ticket.data.owner)"
                  target="_blank"
                  class="col-span-4 font-mono hover:text-primary"
                  :title="ticket.data.owner"
                  dir="ltr"
                >
                  {{ shortAddress(ticket.data.owner, 5) }}
                </ULink>
                <span
                  class="col-span-1 text-center"
                  :title="countryName(countryFromBytes(ticket.data.country), intl, t('country.private'))"
                >
                  {{ flagEmoji(countryFromBytes(ticket.data.country)) }}
                </span>
                <span class="col-span-4 text-end font-mono text-highlighted">{{
                  formatNumber(ticket.data.number)
                }}</span>
              </li>
            </TransitionGroup>
          </div>
        </div>
      </section>
    </div>
  </LotterySurface>
</template>

<style scoped>
.count {
  padding: 0.05rem 0.5rem;
  border-radius: 9999px;
  color: var(--ui-text-highlighted);
  box-shadow: var(--neu-in-sm);
  letter-spacing: 0;
}

.chance {
  color: var(--ui-secondary);
}

.stubs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  gap: 0.75rem;
  max-height: 14rem;
  overflow-y: auto;
  padding: 0.5rem;
  margin: -0.5rem;
  scrollbar-width: thin;
}

/* A ticket of yours: a small key standing out of the panel. */
.stub {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.5rem;
  align-items: center;
  padding: 0.55rem 0.85rem;
  border-radius: 1rem;
  background: var(--ui-bg);
  box-shadow: var(--neu-sm);
}

.stub[data-state='missed'] {
  opacity: 0.55;
  box-shadow: var(--neu-in-sm);
}

.stub[data-state='won'] {
  box-shadow:
    var(--neu-sm),
    inset 0 0 0 1.5px var(--ui-secondary);
}

.stub-flag {
  grid-row: span 2;
  font-size: 1.1rem;
}

.stub-number {
  font-size: 0.95rem;
  color: var(--ui-text-highlighted);
  white-space: nowrap;
}

.stub-meta {
  font-size: 0.68rem;
  color: var(--ui-secondary);
}

.stub[data-state] .stub-meta {
  color: var(--ui-text-muted);
}

.stub[data-state='won'] .stub-meta {
  color: var(--ui-secondary);
}

/* A new ticket rises out of the panel. */
@media (prefers-reduced-motion: no-preference) {
  .stub-enter-active {
    animation: stub-in 0.7s var(--ease-spring);
  }
}

@keyframes stub-in {
  from {
    opacity: 0;
    transform: translateY(-0.6rem) scale(0.9);
    box-shadow: none;
  }
}

.empty {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  border-radius: 1.25rem;
  box-shadow: var(--neu-in-sm);
}

.empty-stub {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 9999px;
  color: var(--ui-primary);
  background: var(--ui-bg);
  box-shadow: var(--neu-xs);
}

.well {
  border-radius: 1.4rem;
  box-shadow: var(--neu-in);
  scrollbar-width: thin;
}

.row {
  transition: background 0.3s;
}

.row:hover {
  background: color-mix(in oklab, var(--ui-text-muted) 7%, transparent);
}

.row.mine {
  background: color-mix(in oklab, var(--ui-primary) 9%, transparent);
}

/* A new ticket drops in at the top with a flash. */
.row-enter-active {
  animation: drop-in 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.row-move {
  transition: transform 0.5s ease;
}

@keyframes drop-in {
  0% {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
    background: color-mix(in oklab, var(--ui-secondary) 30%, transparent);
  }
  40% {
    opacity: 1;
    background: color-mix(in oklab, var(--ui-secondary) 14%, transparent);
  }
}

.live-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
  background: var(--ui-secondary);
  box-shadow: 0 0 8px var(--ui-secondary);
  animation: var(--animate-breathe);
}
</style>
