<script setup lang="ts">
import type { Account } from '@solana/kit';
import { computeRandomness, countryFromBytes, flagEmoji, formatDay, type Round, winningIndex } from '@solucky/client';

/**
 * The last settled draw, printed like a receipt: the public inputs, the hash
 * they give, the winning ticket, and a button that redoes the hash in the
 * browser. Until a round is settled it prints blanks of the same length, so
 * the receipt keeps one height whether it is loading, empty or filled.
 */
const { t } = useI18n();
const localePath = useLocalePath();
const { settled, loading } = useLottery();
const { explorer } = useSolana();

const last = computed(() =>
  settled.value.reduce<Account<Round> | null>((a, b) => (!a || b.data.day > a.data.day ? b : a), null),
);

const hex = (bytes: ArrayLike<number>) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
// A 32-byte hash in hex is 64 characters; the blank wraps the same way.
const BLANK = '·'.repeat(64);

// The randomness as bars: one module per bit, between guard bars.
const barcode = computed(() => {
  const bytes = last.value?.data.randomness;
  if (!bytes) return '';
  const bits = [
    1,
    0,
    1,
    ...Array.from(bytes).flatMap((b) => [7, 6, 5, 4, 3, 2, 1, 0].map((i) => (b >> i) & 1)),
    1,
    0,
    1,
  ];
  return bits.map((bit, x) => (bit ? `M${x} 0h1v40h-1z` : '')).join('');
});

const check = ref<'idle' | 'running' | 'ok' | 'mismatch'>('idle');
watch(last, () => (check.value = 'idle'));

async function verify() {
  const round = last.value;
  if (!round) return;
  check.value = 'running';
  const randomness = await computeRandomness({
    entropy: round.data.entropy,
    slotHash: round.data.slotHash,
    slot: round.data.drawSlot,
    round: round.address,
  });
  const index = winningIndex(randomness, round.data.ticketCount);
  check.value = hex(randomness) === hex(round.data.randomness) && index === round.data.winningIndex ? 'ok' : 'mismatch';
}
</script>

<template>
  <div class="drop-shadow-xl">
    <div
      class="perforated mx-auto w-full max-w-sm rotate-1 bg-elevated px-6 py-9 font-mono text-xs text-toned transition-transform duration-500 hover:rotate-0"
    >
      <header class="text-center">
        <p class="text-sm font-semibold tracking-[0.35em] text-highlighted">S☉LUCKY</p>
        <p class="mt-1 tracking-[0.25em] text-muted uppercase">{{ t('receipt.title') }}</p>
      </header>
      <hr class="my-4 border-dashed border-accented" />

      <dl class="space-y-1.5">
        <div class="flex justify-between gap-4">
          <dt class="uppercase">{{ t('receipt.round') }}</dt>
          <dd class="font-semibold text-highlighted">
            {{ last ? formatDay(last.data.day) : loading ? '…' : t('receipt.noneYet') }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="uppercase">{{ t('receipt.tickets') }}</dt>
          <dd class="text-highlighted">{{ last ? formatNumber(last.data.ticketCount) : '—' }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="uppercase">{{ t('receipt.pot') }}</dt>
          <dd class="text-highlighted">{{ last ? `◎${formatSol(last.data.pot)}` : '—' }}</dd>
        </div>
      </dl>
      <hr class="my-4 border-dashed border-accented" />

      <p class="text-muted uppercase">{{ t('receipt.entropy') }}</p>
      <p class="break-all" :class="last ? 'text-highlighted' : 'text-dimmed'">
        {{ last ? hex(last.data.entropy) : BLANK }}
      </p>
      <p class="mt-3 text-muted uppercase">
        {{ t('receipt.slotHash', { slot: last ? String(last.data.drawSlot) : '—' }) }}
      </p>
      <p class="break-all" :class="last ? 'text-highlighted' : 'text-dimmed'">
        {{ last ? hex(last.data.slotHash) : BLANK }}
      </p>
      <hr class="my-4 border-dashed border-accented" />

      <p class="text-muted">{{ t('receipt.formula') }}</p>
      <p class="break-all font-semibold" :class="last ? 'text-secondary' : 'text-dimmed'">
        {{ last ? hex(last.data.randomness) : BLANK }}
      </p>
      <i18n-t keypath="receipt.mod" tag="p" scope="global" class="mt-3 text-muted">
        <template #count>{{ last ? last.data.ticketCount : t('receipt.ticketCount') }}</template>
        <template #ticket>
          <span class="font-semibold text-highlighted">{{
            t('receipt.ticket', { index: last ? last.data.winningIndex : '—' })
          }}</span>
        </template>
      </i18n-t>
      <hr class="my-4 border-dashed border-accented" />

      <dl class="space-y-1.5">
        <div class="flex justify-between gap-4">
          <dt class="uppercase">{{ t('receipt.number') }}</dt>
          <dd class="font-semibold text-highlighted">
            <template v-if="last">
              {{ flagEmoji(countryFromBytes(last.data.winnerCountry)) }} {{ formatNumber(last.data.winningNumber) }}
            </template>
            <template v-else>—</template>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="uppercase">{{ t('receipt.paidTo') }}</dt>
          <dd>
            <ULink
              v-if="last"
              :to="explorer('address', last.data.winner)"
              target="_blank"
              class="text-highlighted hover:text-primary"
            >
              {{ shortAddress(last.data.winner) }}
            </ULink>
            <template v-else>—</template>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="uppercase">{{ t('receipt.payout') }}</dt>
          <dd class="font-semibold text-highlighted">{{ last ? `◎${formatSol(last.data.payout)}` : '—' }}</dd>
        </div>
      </dl>

      <svg
        viewBox="0 0 262 40"
        class="mt-5 h-10 w-full fill-(--ui-text-highlighted)"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path v-if="last" :d="barcode" />
        <rect v-else y="19" width="262" height="2" class="fill-(--ui-text-dimmed)" />
      </svg>

      <div class="mt-5 flex flex-wrap items-center justify-between gap-2">
        <UButton
          :label="t('receipt.check')"
          icon="i-lucide-cpu"
          size="sm"
          color="neutral"
          variant="outline"
          :disabled="!last"
          :loading="check === 'running'"
          @click="verify"
        />
        <UButton
          v-if="last"
          :to="localePath(`/rounds/${formatDay(last.data.day)}`)"
          :label="t('receipt.roundPage')"
          trailing-icon="i-lucide-arrow-right"
          :ui="{ trailingIcon: 'rtl:-scale-x-100' }"
          size="sm"
          color="neutral"
          variant="ghost"
        />
        <span v-else class="py-1.5 text-muted">{{ t('receipt.nextDraw') }}</span>
      </div>
      <p v-if="last && check === 'ok'" class="mt-3 text-success" role="status">
        {{ t('receipt.ok', { index: last.data.winningIndex }) }}
      </p>
      <p v-else-if="last && check === 'mismatch'" class="mt-3 text-error" role="status">
        {{ t('receipt.mismatch') }}
      </p>
    </div>
  </div>
</template>
