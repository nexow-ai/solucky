<script setup lang="ts">
import { GameKind, isLottery, msUntilClose } from '@solucky/client';

/**
 * The live half of a game's ticket on the landing: its round, a picture of
 * the round so far and its numbers. The daily lottery draws its day as an arc
 * with the sun on it, the hourly one its hour as a clock, and Guess the
 * number its range with every guess on it, dim once checked. Every mark is a
 * real ticket. Browser only.
 */
const props = defineProps<{ kind: number; big?: boolean }>();

const { t } = useI18n();
const intl = useIntlLocale();
const price = useSolPrice();
const now = useNow();
const { period, round, tickets, pot, ticketPrice, maxNumber, checked, numbersLeft, loading } = useLottery(
  () => props.kind as GameKind,
);

const lottery = computed(() => isLottery(props.kind));
const count = computed(() => round.value?.data.ticketCount ?? tickets.value.length);
const clock = computed(() => {
  if (!isLottery(props.kind) || period.value === null) return null;
  const total = Math.floor(msUntilClose(props.kind, period.value, now.value) / 1000);
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
});

const share = (n: number) => Math.min(1, n / Math.max(1, maxNumber.value));
const point = (cx: number, cy: number, r: number, angle: number) => ({
  x: Math.round((cx + Math.cos(angle) * r) * 100) / 100,
  y: Math.round((cy + Math.sin(angle) * r) * 100) / 100,
});

// Daily: the UTC day as a half circle over the horizon, 00:00 on the left, 24:00 on the right.
const day = computed(() => {
  const at = (progress: number, r: number) => point(200, 150, r, Math.PI + progress * Math.PI);
  const progress = dayProgress(now.value);
  const sun = at(progress, 136);
  const start = at(0, 136);
  return {
    sun,
    arc: `M ${start.x} ${start.y} A 136 136 0 0 1 ${sun.x} ${sun.y}`,
    dots: tickets.value.map((ticket) => ({
      key: ticket.address,
      ...at(dayProgress(Number(ticket.data.createdAt) * 1000), 56 + 62 * share(ticket.data.number)),
    })),
  };
});

// Hourly: the hour as a clock face, the sweep at the current minute.
const hour = computed(() => {
  const at = (progress: number, r: number) => point(80, 80, r, -Math.PI / 2 + progress * 2 * Math.PI);
  const progress = (now.value % 3_600_000) / 3_600_000;
  const hand = at(progress, 62);
  return {
    hand,
    sweep: `M 80 80 L 80 14 A 66 66 0 ${progress > 0.5 ? 1 : 0} 1 ${at(progress, 66).x} ${at(progress, 66).y} Z`,
    dots: tickets.value.map((ticket) => ({
      key: ticket.address,
      ...at(((Number(ticket.data.createdAt) * 1000) % 3_600_000) / 3_600_000, 24 + 32 * share(ticket.data.number)),
    })),
  };
});
const ticks = Array.from({ length: 60 }, (_, i) => {
  const angle = -Math.PI / 2 + (i / 60) * 2 * Math.PI;
  const long = i % 5 === 0;
  return { key: i, long, from: point(80, 80, 72, angle), to: point(80, 80, long ? 64 : 68, angle) };
});

// Guess: the range from 0 to the highest number, each guess a mark on it.
const field = computed(() =>
  tickets.value.map((ticket) => ({
    key: ticket.address,
    x: Math.round(share(ticket.data.number) * 4000) / 10,
    done: ticket.data.index < checked.value,
  })),
);
</script>

<template>
  <div class="flex flex-1 flex-col gap-5">
    <!-- The round so far: decorative, the numbers below say it in words. -->
    <div aria-hidden="true" dir="ltr" class="art">
      <svg v-if="props.kind === GameKind.Daily" viewBox="0 0 400 160" class="w-full" :class="props.big ? 'max-h-60' : 'max-h-32'">
        <line x1="40" y1="150" x2="360" y2="150" class="stroke-(--ui-border-accented)" />
        <path d="M 64 150 A 136 136 0 0 1 336 150" class="fill-none stroke-(--ui-border)" stroke-dasharray="2 5" />
        <path d="M 144 150 A 56 56 0 0 1 256 150" class="fill-none stroke-(--ui-border)" />
        <path d="M 82 150 A 118 118 0 0 1 318 150" class="fill-none stroke-(--ui-border)" stroke-dasharray="1 6" />
        <path :d="day.arc" class="fill-none stroke-(--ui-primary)" stroke-width="2.5" stroke-linecap="round" />
        <circle v-for="dot in day.dots" :key="dot.key" :cx="dot.x" :cy="dot.y" r="2.6" class="dot fill-(--ui-primary)" />
        <g :transform="`translate(${day.sun.x} ${day.sun.y})`">
          <circle r="13" class="fill-(--ui-primary)/25 sun-halo" />
          <circle r="7" class="fill-(--ui-color-primary-300)" />
        </g>
        <text x="64" y="160" text-anchor="middle" class="fill-(--ui-text-dimmed) font-mono text-[9px]">00:00</text>
        <text x="200" y="160" text-anchor="middle" class="fill-(--ui-text-dimmed) font-mono text-[9px]">UTC</text>
        <text x="336" y="160" text-anchor="middle" class="fill-(--ui-secondary) font-mono text-[9px]">24:00</text>
      </svg>

      <svg v-else-if="props.kind === GameKind.Hourly" viewBox="0 0 160 160" class="mx-auto max-h-32 w-full">
        <circle cx="80" cy="80" r="74" class="fill-none stroke-(--ui-border)" />
        <line
          v-for="tick in ticks"
          :key="tick.key"
          :x1="tick.from.x"
          :y1="tick.from.y"
          :x2="tick.to.x"
          :y2="tick.to.y"
          :class="tick.long ? 'stroke-(--ui-text-toned)' : 'stroke-(--ui-text-dimmed)'"
        />
        <circle cx="80" cy="80" r="24" class="fill-none stroke-(--ui-border)" stroke-dasharray="1 4" />
        <path :d="hour.sweep" class="fill-(--ui-primary)/15" />
        <line x1="80" y1="80" :x2="hour.hand.x" :y2="hour.hand.y" class="stroke-(--ui-secondary)" stroke-width="2" stroke-linecap="round" />
        <circle v-for="dot in hour.dots" :key="dot.key" :cx="dot.x" :cy="dot.y" r="2.6" class="dot fill-(--ui-primary)" />
        <circle cx="80" cy="80" r="3.5" class="fill-(--ui-secondary)" />
      </svg>

      <svg v-else viewBox="0 0 400 64" class="w-full max-h-32" preserveAspectRatio="none">
        <rect x="0" y="22" width="400" height="20" rx="3" class="fill-(--ui-bg-elevated) stroke-(--ui-border)" />
        <line
          v-for="mark in field"
          :key="mark.key"
          :x1="mark.x"
          :x2="mark.x"
          :y1="mark.done ? 26 : 8"
          :y2="mark.done ? 38 : 56"
          :class="mark.done ? 'stroke-(--ui-text-dimmed)' : 'mark stroke-(--ui-secondary)'"
          :stroke-width="mark.done ? 1 : 2"
          vector-effect="non-scaling-stroke"
        />
        <rect class="scan fill-(--ui-primary)/20" x="0" y="22" width="24" height="20" />
      </svg>
    </div>

    <dl class="grid grid-cols-2 gap-x-4 gap-y-3" :class="props.big ? 'sm:grid-cols-4' : ''">
      <div class="col-span-2" :class="props.big ? 'sm:col-span-2' : ''">
        <dt class="kicker text-[0.6rem]">{{ t('stat.todaysPot') }}</dt>
        <dd v-if="loading"><USkeleton class="mt-1 h-8 w-32" /></dd>
        <dd v-else class="flex flex-wrap items-baseline gap-x-2">
          <span
            class="led font-mono leading-tight font-extrabold text-highlighted tabular-nums [--led-pitch:0.1em]"
            :class="props.big ? 'text-5xl' : 'text-3xl'"
            dir="ltr"
            >◎{{ formatSol(pot, 3) }}</span
          >
          <span class="font-mono text-xs text-muted">{{ formatUsd(pot, price, intl) }}</span>
        </dd>
      </div>
      <div>
        <dt class="kicker text-[0.6rem]">{{ lottery ? t('home.live.drawIn') : t('stat.numbersLeft') }}</dt>
        <dd class="mt-0.5 font-mono text-sm font-semibold text-primary tabular-nums" dir="ltr">
          {{ lottery ? (clock ?? '—') : formatNumber(numbersLeft) }}
        </dd>
      </div>
      <div>
        <dt class="kicker text-[0.6rem]">{{ t('stat.tickets') }} · {{ t('stat.ticket') }}</dt>
        <dd class="mt-0.5 font-mono text-sm text-toned tabular-nums" dir="ltr">
          {{ formatNumber(count) }} · {{ ticketPrice === null ? '—' : `◎${formatSol(ticketPrice)}` }}
        </dd>
      </div>
    </dl>
    <p class="kicker -mt-2 text-[0.6rem] text-dimmed">
      {{ t('receipt.round') }} <span dir="ltr">{{ period === null ? '…' : roundTitle(props.kind, period) }}</span>
    </p>
  </div>
</template>

<style scoped>
.dot {
  filter: drop-shadow(0 0 3px var(--ui-primary));
}

.sun-halo {
  transform-box: fill-box;
  transform-origin: center;
  animation: halo 3s ease-in-out infinite;
}

.mark {
  filter: drop-shadow(0 0 3px var(--ui-secondary));
}

/* The check, scanning the range for the hidden number. */
.scan {
  animation: scan 4.5s ease-in-out infinite alternate;
}

@keyframes halo {
  50% {
    scale: 1.35;
    opacity: 0.6;
  }
}

@keyframes scan {
  to {
    translate: 376px 0;
  }
}
</style>
