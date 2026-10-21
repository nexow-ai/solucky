<script setup lang="ts">
import { type Account, fetchEncodedAccount } from '@solana/kit';
import {
  closestNumber,
  computeRandomness,
  countryFromBytes,
  decodeRound,
  drawnNumber,
  fetchRoundTickets,
  findRoundPda,
  flagEmoji,
  GAME_SLUGS,
  gameFromSlug,
  guessOutcome,
  isLottery,
  parsePeriod,
  periodOf,
  type Round,
  roundNumbers,
  RoundStatus,
  type Ticket,
} from '@solucky/client';

definePageMeta({ validate: (route) => gameFromSlug(String(route.params.game)) !== null });

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
const intl = useIntlLocale();
const kind = useGame();
const lottery = computed(() => isLottery(kind.value));
const period = computed(() => parsePeriod(kind.value, String(route.params.period)));
const title = computed(() =>
  period.value === null ? String(route.params.period) : roundTitle(kind.value, period.value),
);

useSeoMeta({ title: () => `${t('round.title', { day: title.value })} · S☉Lucky` });

const { client, programAddress, explorer } = useSolana();
const { settle, busy, period: onSale } = useLottery();
const { connected } = useWallet();
const price = useSolPrice();

const round = shallowRef<Account<Round> | null>(null);
/** A lottery round's sorted numbers, stored after its fields. */
const numbers = shallowRef<number[]>([]);
const tickets = shallowRef<Account<Ticket>[]>([]);
const loading = ref(true);

async function load() {
  if (period.value === null) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const [address] = await findRoundPda({ kind: kind.value, period: period.value }, { programAddress });
    const account = await fetchEncodedAccount(client.rpc, address, { commitment: 'confirmed' });
    round.value = account.exists ? decodeRound(account) : null;
    numbers.value = account.exists ? roundNumbers(account.data) : [];
    tickets.value = account.exists ? await fetchRoundTickets(client.rpc, address, programAddress) : [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(period, load);

const now = useNow();
/** The round on sale: today, this hour, or the Guess round nobody has won yet. */
const isCurrent = computed(() =>
  isLottery(kind.value) ? period.value === periodOf(kind.value, now.value) : period.value === onSale.value,
);
const drawn = computed(() => !!round.value && round.value.data.status >= RoundStatus.Drawn);
const isWinner = (ticket: Account<Ticket>) =>
  lottery.value
    ? ticket.data.number === round.value?.data.winningNumber
    : ticket.data.index === round.value?.data.winningIndex;

const hex = (bytes: ArrayLike<number>) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** Recomputes the draw in the browser from the round's public fields. */
const check = ref<{ randomness: string; number: number | null; matches: boolean } | null>(null);
async function verify() {
  const r = round.value?.data;
  if (!r || !round.value) return;
  const randomness = await computeRandomness({
    entropy: r.entropy,
    slotHash: r.slotHash,
    slot: r.drawSlot,
    round: round.value.address,
  });
  const same = hex(randomness) === hex(r.randomness);
  if (isLottery(r.kind)) {
    const drawnAgain = drawnNumber(randomness, r.maxNumber);
    const number = closestNumber(numbers.value, drawnAgain);
    check.value = {
      randomness: hex(randomness),
      number,
      matches: same && drawnAgain === r.drawnNumber && number === r.winningNumber,
    };
  } else {
    const index = guessOutcome(randomness, r.checked, r.sealedCount, r.maxNumber);
    check.value = {
      randomness: hex(randomness),
      number: index === r.winningIndex ? r.winningNumber : null,
      matches: same && index === r.winningIndex,
    };
  }
}

const facts = computed(() => {
  const r = round.value?.data;
  if (!r) return [];
  return [
    { label: t('round.sold'), value: formatNumber(r.ticketCount) },
    { label: t('round.price'), value: `◎${formatSol(r.ticketPrice)}` },
    {
      label: t('round.fee'),
      value: new Intl.NumberFormat(intl.value, { style: 'percent', maximumFractionDigits: 2 }).format(
        r.feeBps / 10_000,
      ),
    },
    { label: t('round.slot'), value: r.targetSlot ? formatNumber(r.targetSlot) : '—' },
  ];
});
</script>

<template>
  <UContainer class="max-w-4xl space-y-6 py-8">
    <UButton
      :to="localePath(`/play/${GAME_SLUGS[kind]}`)"
      :label="t('round.back')"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      :ui="{ leadingIcon: 'rtl:-scale-x-100' }"
    />

    <UAlert
      v-if="period === null"
      color="error"
      variant="subtle"
      icon="i-lucide-calendar-x"
      :title="t('round.notDate')"
    />

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="kicker">{{ t(`games.${GAME_SLUGS[kind]}.name`) }} · {{ t('round.kicker') }}</p>
          <h1 class="text-3xl font-bold tracking-widest text-highlighted" dir="ltr">{{ title }}</h1>
        </div>
        <LotteryStatusBadge v-if="round" :status="round.data.status" :current="isCurrent" :lottery="lottery" />
      </div>

      <USkeleton v-if="loading" class="h-64 w-full" />

      <UEmpty
        v-else-if="!round"
        icon="i-lucide-ticket-x"
        :title="t('round.nobody')"
        :description="isCurrent ? t('round.beFirst') : t('round.onlyExists')"
        :actions="isCurrent ? [{ label: t('home.playNow'), to: localePath(`/play/${GAME_SLUGS[kind]}`) }] : []"
      />

      <template v-else>
        <UCard>
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <p class="kicker">{{ t('round.pot') }}</p>
              <p class="text-lucky text-4xl font-bold tabular-nums">◎{{ formatSol(round.data.pot, 4) }}</p>
              <p class="text-sm text-muted tabular-nums">
                {{ t('round.usd', { usd: formatUsd(round.data.pot, price, intl) }) }}
              </p>
            </div>
            <div v-if="round.data.status === RoundStatus.Settled">
              <p class="kicker">{{ t('round.winner') }}</p>
              <p class="text-2xl font-bold tabular-nums text-highlighted">
                {{ flagEmoji(countryFromBytes(round.data.winnerCountry)) }} {{ formatNumber(round.data.winningNumber) }}
              </p>
              <ULink
                :to="explorer('address', round.data.winner)"
                target="_blank"
                class="font-mono text-sm hover:text-primary"
                dir="ltr"
              >
                {{ shortAddress(round.data.winner, 6) }}
              </ULink>
              <p class="text-sm text-muted">
                {{ t('round.won', { payout: formatSol(round.data.payout), fee: formatSol(round.data.fee) }) }}
              </p>
            </div>
            <div v-else-if="!isCurrent" class="flex flex-col items-start gap-2">
              <p class="kicker">{{ t('round.unpaid') }}</p>
              <p class="text-sm text-muted">{{ t('round.anyone') }}</p>
              <UButton
                v-if="connected"
                :label="t('round.settle')"
                icon="i-lucide-gavel"
                :loading="busy"
                @click="settle(round).then(load)"
              />
              <WalletButton v-else />
            </div>
          </div>

          <USeparator class="my-6" />

          <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div v-for="fact in facts" :key="fact.label">
              <dt class="kicker text-[0.65rem]">{{ fact.label }}</dt>
              <dd class="mt-1 font-semibold tabular-nums text-highlighted">{{ fact.value }}</dd>
            </div>
          </dl>
        </UCard>

        <UCard v-if="drawn">
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 class="font-semibold text-highlighted">{{ t('round.check') }}</h2>
                <p class="text-sm text-muted">{{ t('round.formula') }}</p>
              </div>
              <UButton
                :label="t('round.recompute')"
                icon="i-lucide-calculator"
                color="neutral"
                variant="outline"
                @click="verify"
              />
            </div>
          </template>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-muted">{{ t('round.entropy') }}</dt>
              <dd class="break-all font-mono text-xs">{{ hex(round.data.entropy) }}</dd>
            </div>
            <div>
              <i18n-t keypath="round.slotHash" tag="dt" scope="global" class="text-muted">
                <template #slot>
                  <ULink :to="explorer('block', round.data.drawSlot)" target="_blank" class="hover:text-primary">
                    {{ formatNumber(round.data.drawSlot) }}
                  </ULink>
                </template>
              </i18n-t>
              <dd class="break-all font-mono text-xs">{{ hex(round.data.slotHash) }}</dd>
            </div>
            <div>
              <dt class="text-muted">{{ t('round.randomness') }}</dt>
              <dd class="break-all font-mono text-xs">{{ hex(round.data.randomness) }}</dd>
            </div>
            <div>
              <dt class="text-muted">{{ t('round.winning') }}</dt>
              <dd class="font-mono text-xs">
                {{
                  lottery
                    ? t('round.winningFormula', {
                        count: formatNumber(round.data.maxNumber + 1),
                        drawn: formatNumber(round.data.drawnNumber),
                        number: formatNumber(round.data.winningNumber),
                      })
                    : t('round.guessFormula', {
                        left: formatNumber(round.data.maxNumber + 1 - round.data.checked),
                        r: formatNumber(round.data.winningIndex - round.data.checked),
                        batch: formatNumber(round.data.sealedCount - round.data.checked),
                        index: round.data.winningIndex,
                      })
                }}
              </dd>
            </div>
          </dl>
          <UAlert
            v-if="check"
            class="mt-4"
            :color="check.matches ? 'success' : 'error'"
            variant="subtle"
            :icon="check.matches ? 'i-lucide-badge-check' : 'i-lucide-badge-x'"
            :title="check.matches ? t('round.ok') : t('round.mismatch')"
            :description="
              t('round.got', {
                hash: check.randomness.slice(0, 16),
                number: check.number === null ? '—' : formatNumber(check.number),
              })
            "
          />
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">{{ t('round.tickets') }}</h2>
            <p class="text-sm text-muted">{{ t('round.ticketsHint') }}</p>
          </template>
          <p v-if="!tickets.length" class="text-sm text-muted">{{ t('round.noTickets') }}</p>
          <ol v-else class="divide-y divide-default text-sm">
            <li
              v-for="ticket in tickets"
              :key="ticket.address"
              class="grid grid-cols-12 items-center gap-2 py-2 tabular-nums"
              :class="drawn && isWinner(ticket) ? 'font-semibold text-primary' : ''"
            >
              <span class="col-span-1 text-muted">#{{ ticket.data.index }}</span>
              <span class="col-span-3 text-muted">{{ formatUtcTime(ticket.data.createdAt) }} UTC</span>
              <ULink
                :to="explorer('address', ticket.data.owner)"
                target="_blank"
                class="col-span-4 font-mono hover:text-primary"
                dir="ltr"
              >
                {{ shortAddress(ticket.data.owner, 6) }}
              </ULink>
              <span class="col-span-1 text-center">{{ flagEmoji(countryFromBytes(ticket.data.country)) }}</span>
              <span class="col-span-3 text-end">{{ formatNumber(ticket.data.number) }}</span>
            </li>
          </ol>
        </UCard>

        <i18n-t keypath="round.account" tag="p" scope="global" class="text-center text-xs text-muted">
          <template #address>
            <ULink :to="explorer('address', round.address)" target="_blank" class="font-mono hover:text-primary">{{
              round.address
            }}</ULink>
          </template>
          <template #day>
            <span dir="ltr">{{ title }}</span>
          </template>
        </i18n-t>
      </template>
    </template>
  </UContainer>
</template>
