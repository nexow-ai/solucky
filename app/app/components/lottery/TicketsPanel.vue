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
  <LotteryGlass tint="secondary">
    <div class="flex h-full flex-col gap-6 p-5 sm:p-6">
      <section>
        <header class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 class="kicker flex items-center gap-2">
            <UIcon name="i-lucide-ticket" class="size-4 text-primary" />
            {{ t('stat.yourTickets') }}
            <span class="count font-mono tabular-nums">{{ myTickets.length }}</span>
          </h2>
          <p v-if="myChance !== null" class="flex items-baseline gap-2">
            <span class="kicker text-[0.65rem]">{{ t('stat.winChance') }}</span>
            <span class="chance font-mono text-lg font-semibold tabular-nums">{{ formatPercent(myChance, intl) }}</span>
          </p>
        </header>

        <div v-if="stubs.length" class="stubs mt-3" role="group" :aria-label="t('stat.yourTickets')">
          <TransitionGroup name="stub">
            <div
              v-for="(stub, i) in stubs"
              :key="stub.key"
              class="stub"
              :data-state="stub.state ?? undefined"
              :style="{ '--i': Math.min(i, 8) }"
            >
              <span class="stub-flag" aria-hidden="true">{{ flagEmoji(stub.cc) }}</span>
              <span class="stub-number font-mono font-semibold tabular-nums" dir="ltr">{{
                formatNumber(stub.number)
              }}</span>
              <span v-if="stub.share !== null" class="stub-meta font-mono tabular-nums">
                {{ formatPercent(stub.share, intl) }}
              </span>
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
        <div v-else class="empty table-tray mt-3">
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
          <span class="ms-auto font-mono tabular-nums">{{ formatNumber(tickets.length) }}</span>
        </h2>
        <div class="table-well h-80 flex-1 overflow-y-auto p-2 lg:h-0 lg:min-h-72" data-ticket-well>
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
          <TransitionGroup v-else tag="ol" name="row" class="space-y-0.5 text-xs">
            <li
              v-for="ticket in newestFirst"
              :key="ticket.address"
              class="row grid grid-cols-12 items-center gap-2 rounded-lg px-2 py-1.5 tabular-nums"
              :class="ticket.data.owner === address ? 'mine font-semibold text-primary' : 'text-toned'"
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
              <span class="col-span-4 text-end font-mono font-semibold">{{ formatNumber(ticket.data.number) }}</span>
            </li>
          </TransitionGroup>
        </div>
      </section>
    </div>
  </LotteryGlass>
</template>

<style scoped>
.count {
  padding: 0.05rem 0.45rem;
  border-radius: 9999px;
  color: var(--ui-text-highlighted);
  background: color-mix(in oklab, var(--ui-primary) 22%, transparent);
  letter-spacing: 0;
}

.chance {
  color: var(--ui-secondary);
  text-shadow: 0 0 12px color-mix(in oklab, var(--ui-secondary) 50%, transparent);
}

:root:not(.dark) .chance {
  text-shadow: none;
}

.stubs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  gap: 0.5rem;
  max-height: 13.5rem;
  overflow-y: auto;
  padding: 0.15rem;
  scrollbar-width: thin;
}

/* A ticket stub: brand card with a notch on each side and a dashed tear line. */
.stub {
  --edge: var(--ui-primary);
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.4rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.7rem;
  background:
    linear-gradient(
      135deg,
      color-mix(in oklab, var(--color-purple-500) 26%, transparent),
      color-mix(in oklab, var(--color-pink-600) 16%, transparent)
    ),
    color-mix(in oklab, black 20%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 18%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--edge) 38%, transparent);
  mask:
    radial-gradient(circle at 0 50%, transparent 0.3rem, #000 0.33rem) left / 51% 100% no-repeat,
    radial-gradient(circle at 100% 50%, transparent 0.3rem, #000 0.33rem) right / 51% 100% no-repeat;
}

:root:not(.dark) .stub {
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--color-purple-500) 12%, white),
    color-mix(in oklab, var(--color-pink-600) 8%, white)
  );
}

.stub[data-state='missed'] {
  --edge: var(--ui-border-accented);
  opacity: 0.6;
  filter: saturate(0.4);
}

.stub[data-state='won'] {
  --edge: var(--ui-secondary);
  box-shadow:
    inset 0 0 0 1px var(--ui-secondary),
    0 0 20px -6px var(--ui-secondary);
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

/* A new stub is torn off and dropped in. */
@media (prefers-reduced-motion: no-preference) {
  .stub-enter-active {
    animation: stub-in 0.8s var(--ease-spring);
  }
}

@keyframes stub-in {
  from {
    opacity: 0;
    transform: translateY(-0.8rem) rotate(-6deg) scale(0.85);
    filter: brightness(2);
  }
}

.empty {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
}

.empty-stub {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.7rem;
  color: var(--ui-primary);
  border: 1.5px dashed color-mix(in oklab, var(--ui-primary) 50%, transparent);
}

.row {
  transition: background 0.3s;
}

.row:hover {
  background: color-mix(in oklab, white 5%, transparent);
}

:root:not(.dark) .row:hover {
  background: color-mix(in oklab, var(--ui-primary) 6%, transparent);
}

.row.mine {
  background: color-mix(in oklab, var(--ui-primary) 12%, transparent);
  box-shadow: inset 2px 0 0 var(--ui-primary);
}

.row.mine:dir(rtl) {
  box-shadow: inset -2px 0 0 var(--ui-primary);
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
    background: color-mix(in oklab, var(--ui-secondary) 45%, transparent);
    box-shadow: 0 0 24px -4px var(--ui-secondary);
  }
  40% {
    opacity: 1;
    background: color-mix(in oklab, var(--ui-secondary) 22%, transparent);
  }
}

.live-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
  background: var(--ui-secondary);
  box-shadow: 0 0 8px var(--ui-secondary);
  animation: blink 1.6s ease-in-out infinite;
}

@keyframes blink {
  50% {
    opacity: 0.3;
  }
}
</style>
