<script setup lang="ts">
import { countryFromBytes, flagEmoji, GAME_SLUGS, type LotteryKind, msUntilClose } from '@solucky/client';

const { t } = useI18n();
const intl = useIntlLocale();
const { kind, lottery, period, pot, carry, feeBps, tickets, players, countries, loading } = useLottery();
const { address } = useWallet();
const { explorer } = useSolana();
const price = useSolPrice();
const now = useNow();

const left = computed(() =>
  lottery.value && period.value !== null ? msUntilClose(kind.value as LotteryKind, period.value, now.value) : 0,
);
const fee = computed(() =>
  new Intl.NumberFormat(intl.value, { style: 'percent', maximumFractionDigits: 2 }).format(feeBps.value / 10_000),
);
const newestFirst = computed(() => [...tickets.value].reverse());
const potShown = useTween(() => Number(pot.value), 1_600);

// When the pot grows, a chip with the difference floats off the counter.
const gains = ref<{ id: number; amount: bigint }[]>([]);
let gainId = 0;
watch(pot, (to, from) => {
  if (from === undefined || to <= from || loading.value) return;
  const id = gainId++;
  gains.value = [...gains.value, { id, amount: to - from }];
  setTimeout(() => (gains.value = gains.value.filter((g) => g.id !== id)), 2_400);
});
</script>

<template>
  <LotteryGlass>
    <div class="space-y-6 p-5 sm:p-6">
      <header class="text-center">
        <p class="kicker">{{ t(`games.${GAME_SLUGS[kind]}.name`) }}</p>
        <h2 class="text-3xl font-semibold tracking-[0.28em] text-muted">{{ t('pot.title') }}</h2>
        <div class="jackpot relative mt-4">
          <p class="text-lucky glow-primary led font-mono text-5xl font-semibold tabular-nums [--led-pitch:0.07em]">
            ◎{{ formatSol(Math.round(potShown), 3) }}
          </p>
          <span
            v-for="g in gains"
            :key="g.id"
            class="gain font-mono text-sm font-semibold text-secondary"
            aria-hidden="true"
          >
            +◎{{ formatSol(g.amount, 3) }}
          </span>
        </div>
        <p class="mt-1 font-mono text-lg font-semibold text-toned tabular-nums">{{ formatUsd(pot, price, intl) }}</p>
        <p v-if="carry > 0n" class="mt-1 text-xs text-muted">
          {{ t('pot.carried', { carry: formatSol(carry, 3) }) }}
        </p>
        <p class="mt-1 text-xs text-muted">{{ t('pot.split', { fee }) }}</p>
        <template v-if="lottery && period !== null">
          <p class="kicker mt-4 text-sm">{{ t('pot.closesIn', { day: roundTitle(kind, period) }) }}</p>
          <div class="mt-2 flex justify-center">
            <LotteryCountdown :ms="left" />
          </div>
        </template>
      </header>

      <div class="tray grid grid-cols-3 gap-2 px-2 py-3">
        <LotteryStat :label="t('stat.tickets')" :value="tickets.length" />
        <LotteryStat :label="t('stat.players')" :value="players" />
        <LotteryStat :label="t('stat.countries')" :value="countries" />
      </div>

      <div>
        <p class="kicker mb-3 flex items-center justify-center gap-2">
          <span class="live-dot" aria-hidden="true" />
          {{ t('pot.inPlay') }}
        </p>
        <div class="well h-80 overflow-y-auto p-2">
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

/* A well sunk into the glass, where the tickets pile up. */
.well {
  border-radius: 1.1rem;
  background: color-mix(in oklab, black 32%, transparent);
  box-shadow:
    inset 0 2px 12px color-mix(in oklab, black 65%, transparent),
    inset 0 0 0 1px color-mix(in oklab, white 5%, transparent);
  scrollbar-width: thin;
}

.row {
  transition: background 0.3s;
}

.row:hover {
  background: color-mix(in oklab, white 5%, transparent);
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

.gain {
  position: absolute;
  inset-inline: 0;
  top: -0.25rem;
  text-shadow: 0 0 12px var(--ui-secondary);
  animation: rise 2.4s ease-out forwards;
}

@keyframes rise {
  0% {
    opacity: 0;
    transform: translateY(0.75rem) scale(0.9);
  }
  15% {
    opacity: 1;
    transform: translateY(0) scale(1.05);
  }
  100% {
    opacity: 0;
    transform: translateY(-2.5rem) scale(1);
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
