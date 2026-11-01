<script setup lang="ts">
/**
 * Quick buy, under the buy button: whether it is on, what its budget has
 * left and when it ends, and a popover to turn it on (one wallet approval),
 * add to it, renew it or turn it off (which returns everything to the wallet).
 */
const { t } = useI18n();
const intl = useIntlLocale();
const quick = useQuickBuy();
const { ticketPrice, busy } = useLottery();
const { balance } = useWallet();
const now = useNow();

const open = ref(false);
const amount = ref(1);
const days = ref(7);
const durations = computed(() => [1, 7, 30].map((n) => ({ label: t('quick.days', { n }, n), value: n })));

const deposit = computed(() => BigInt(Math.round(Math.max(0, amount.value ?? 0) * 1e9)));
const tickets = computed(() => (ticketPrice.value ? Number(deposit.value / ticketPrice.value) : null));
/** What turning it on takes from the wallet: the budget, the session's rent and the key's fee float. */
const needed = computed(
  () =>
    deposit.value +
    (quick.session.value ? 0n : (quick.sessionRent.value ?? 0n)) +
    (quick.keyLow.value ? KEY_FLOAT : 0n),
);
/** What turning it off returns: the session's lamports, and the key's float when this browser holds it. */
const back = computed(
  () =>
    (quick.session.value?.lamports ?? 0n) +
    (quick.mine.value && quick.keyLamports.value !== null ? quick.keyLamports.value : 0n),
);
const short = computed(() => balance.value !== null && balance.value < needed.value);

const state = computed(() => {
  if (quick.active.value) return 'on';
  if (quick.mine.value) return 'ended';
  if (quick.elsewhere.value) return 'elsewhere';
  return 'off';
});

/** "in 6 days", "in 3 hours"… by the cluster's clock. */
const endsIn = computed(() => {
  const end = quick.session.value?.expiresAt;
  if (!end) return '';
  const ms = Math.max(0, end - now.value);
  const format = new Intl.RelativeTimeFormat(intl.value, { numeric: 'always' });
  if (ms >= 86_400_000) return format.format(Math.floor(ms / 86_400_000), 'day');
  if (ms >= 3_600_000) return format.format(Math.floor(ms / 3_600_000), 'hour');
  return format.format(Math.max(1, Math.floor(ms / 60_000)), 'minute');
});

const status = computed(() => {
  const budget = formatSol(quick.budget.value);
  switch (state.value) {
    case 'on':
      return quick.keyLow.value
        ? t('quick.statusLow', { sol: budget })
        : t('quick.statusOn', { sol: budget, when: endsIn.value });
    case 'ended':
      return t('quick.statusEnded', { sol: budget });
    case 'elsewhere':
      return t('quick.statusElsewhere', { sol: budget });
    default:
      return t('quick.statusOff');
  }
});

async function turnOn() {
  if (await quick.open(deposit.value, days.value)) open.value = false;
}
async function addFunds() {
  if (await quick.open(deposit.value, null)) open.value = false;
}
async function renew() {
  if (await quick.open(0n, days.value)) open.value = false;
}
async function turnOff() {
  if (await quick.close()) open.value = false;
}

watch(open, (shown) => {
  if (shown) void quick.refresh().catch(() => {});
});
</script>

<template>
  <div class="flex items-center gap-3 rounded-2xl py-2 ps-4 pe-2 shadow-(--neu-in-sm)">
    <UIcon
      name="i-lucide-zap"
      class="size-4 shrink-0"
      :class="state === 'on' ? 'text-primary' : 'text-muted'"
      aria-hidden="true"
    />
    <p class="min-w-0 flex-1 text-xs text-pretty" :class="state === 'on' ? 'text-highlighted' : 'text-muted'">
      <span class="font-semibold">{{ t('quick.title') }}</span> · {{ status }}
    </p>
    <UPopover v-model:open="open" :content="{ align: 'end', sideOffset: 8 }">
      <UButton
        :label="state === 'off' ? t('quick.setUp') : t('quick.manage')"
        :icon="state === 'off' ? 'i-lucide-zap' : 'i-lucide-settings-2'"
        color="primary"
        variant="soft"
        size="xs"
        :disabled="!quick.supported.value"
      />
      <template #content>
        <div class="w-80 max-w-[calc(100vw-2rem)] space-y-3 p-4 text-sm">
          <p class="font-semibold text-highlighted">{{ t('quick.title') }}</p>
          <p class="text-xs text-pretty text-toned">{{ t('quick.explain') }}</p>
          <p class="text-xs text-pretty text-muted">{{ t('quick.safety') }}</p>

          <template v-if="state === 'off' || state === 'elsewhere'">
            <p v-if="state === 'elsewhere'" class="text-xs text-pretty text-warning">{{ t('quick.elsewhereHint') }}</p>
            <UFormField
              v-if="state === 'off'"
              :label="t('quick.budget')"
              :hint="tickets !== null ? t('quick.tickets', { n: tickets }, tickets) : undefined"
            >
              <UInputNumber
                v-model="amount"
                :min="0"
                :step="0.1"
                :format-options="{ maximumFractionDigits: 3 }"
                class="w-full"
              />
            </UFormField>
            <UFormField :label="t('quick.lasts')">
              <USelect v-model="days" :items="durations" class="w-full" />
            </UFormField>
            <p v-if="state === 'off'" class="text-xs text-pretty text-muted">
              {{ t('quick.float', { sol: formatSol(KEY_FLOAT, 2) }) }}
            </p>
            <UButton
              block
              icon="i-lucide-zap"
              :label="state === 'off' ? t('quick.turnOn', { sol: formatSol(deposit) }) : t('quick.useHere')"
              :loading="busy"
              :disabled="short || (state === 'off' && deposit === 0n)"
              @click="state === 'off' ? turnOn() : renew()"
            />
            <p v-if="short" class="text-xs text-error">{{ t('pick.notEnough') }}</p>
            <UButton
              v-if="state === 'elsewhere'"
              block
              color="neutral"
              variant="outline"
              icon="i-lucide-power"
              :label="t('quick.turnOff')"
              @click="turnOff"
            />
          </template>

          <template v-else>
            <UFormField :label="t('quick.add')">
              <UInputNumber
                v-model="amount"
                :min="0"
                :step="0.1"
                :format-options="{ maximumFractionDigits: 3 }"
                class="w-full"
              />
            </UFormField>
            <UButton
              block
              icon="i-lucide-plus"
              :label="t('quick.addButton', { sol: formatSol(deposit) })"
              :loading="busy"
              :disabled="short || deposit === 0n || state === 'ended'"
              @click="addFunds"
            />
            <div v-if="state === 'ended'" class="space-y-2">
              <UFormField :label="t('quick.lasts')">
                <USelect v-model="days" :items="durations" class="w-full" />
              </UFormField>
              <UButton block icon="i-lucide-refresh-cw" :label="t('quick.renew')" :loading="busy" @click="renew" />
            </div>
            <UButton
              block
              color="neutral"
              variant="outline"
              icon="i-lucide-power"
              :label="t('quick.turnOffReturn', { sol: formatSol(back) })"
              :loading="busy"
              @click="turnOff"
            />
          </template>

          <UButton
            v-if="quick.stranded.value !== null"
            block
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-undo-2"
            :label="t('quick.returnFloat', { sol: formatSol(quick.stranded.value) })"
            @click="quick.returnFloat()"
          />
          <p v-if="!quick.supported.value" class="text-xs text-error">{{ t('quick.unsupported') }}</p>
        </div>
      </template>
    </UPopover>
  </div>
</template>
