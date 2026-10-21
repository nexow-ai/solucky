<script setup lang="ts">
import { flagEmoji } from '@solucky/client';
import type { FeedItem } from '~/composables/useTableFeed';

/**
 * The strip across the top of the table: is the live link up, who is here,
 * who is picking a number right now, and a ticker of what just happened.
 */
const props = defineProps<{ feed: readonly FeedItem[] }>();

const { status, online, others, picking } = useLive();

const label = computed(() => ({ live: 'Live', connecting: 'Connecting', offline: 'Offline' })[status.value]);
const flags = computed(() => others.value.slice(0, 6).map((p) => ({ id: p.id, flag: flagEmoji(p.cc), pick: p.pick })));
const more = computed(() => Math.max(0, others.value.length - flags.value.length));

// A coarse local clock for "12s ago": the ticker does not need the cluster's time.
const now = ref(Date.now());
let clock: ReturnType<typeof setInterval> | undefined;
onMounted(() => (clock = setInterval(() => (now.value = Date.now()), 5_000)));
onBeforeUnmount(() => clearInterval(clock));

function ago(at: number) {
  const s = Math.max(0, Math.round((now.value - at) / 1000));
  if (s < 60) return s < 10 ? 'now' : `${s}s`;
  const m = Math.round(s / 60);
  return m < 60 ? `${m}m` : `${Math.round(m / 60)}h`;
}

// The ticker runs one item every four seconds, so a long feed does not race.
const duration = computed(() => `${Math.max(18, props.feed.length * 4)}s`);
</script>

<template>
  <LotteryGlass as="div" rounded="rounded-full" class="livebar">
    <div class="flex items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
      <span class="status" :data-status="status">
        <span class="dot" />
        <span class="kicker text-[0.65rem] text-current">{{ label }}</span>
      </span>

      <span class="flex shrink-0 items-center gap-2">
        <span class="flex -space-x-1.5" aria-hidden="true">
          <span v-for="f in flags" :key="f.id" class="seat" :class="{ picking: f.pick }">{{ f.flag }}</span>
          <span v-if="more" class="seat seat-more font-mono">+{{ more }}</span>
        </span>
        <span class="text-sm text-toned">
          <span class="font-mono font-semibold tabular-nums text-highlighted">{{
            status === 'live' ? online : '—'
          }}</span>
          at the table
        </span>
      </span>

      <span v-if="picking" class="picking-label hidden shrink-0 text-sm text-secondary sm:inline-flex">
        {{ picking }} picking<span class="dots"><i>.</i><i>.</i><i>.</i></span>
      </span>

      <div class="ticker min-w-0 flex-1" aria-hidden="true">
        <div v-if="props.feed.length" class="track" :style="{ '--duration': duration }">
          <template v-for="copy in 2" :key="copy">
            <span v-for="item in props.feed" :key="`${copy}-${item.key}`" class="item">
              <template v-if="item.kind === 'ticket'">
                <UIcon name="i-lucide-ticket" class="size-3.5 text-primary" />
                {{ flagEmoji(item.cc) }}
                <span class="font-mono">{{ item.mine ? 'you' : shortAddress(item.owner ?? '', 4) }}</span>
                <span class="text-muted">→</span>
                <span class="font-mono font-semibold text-highlighted">{{ formatNumber(item.number ?? 0) }}</span>
              </template>
              <template v-else>
                <UIcon name="i-lucide-user-round-plus" class="size-3.5 text-secondary" />
                {{ flagEmoji(item.cc) }} joined
              </template>
              <span class="font-mono text-[0.65rem] text-dimmed">{{ ago(item.at) }}</span>
            </span>
          </template>
        </div>
        <p v-else class="truncate text-sm text-muted">
          The table is open. The next ticket shows up here the moment it lands.
        </p>
      </div>
    </div>
  </LotteryGlass>
</template>

<style scoped>
.status {
  --c: var(--ui-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.65rem;
  border-radius: 9999px;
  color: var(--c);
  background: color-mix(in oklab, var(--c) 12%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--c) 35%, transparent);
  flex-shrink: 0;
}

.status[data-status='live'] {
  --c: var(--ui-secondary);
}

.status[data-status='connecting'] {
  --c: var(--ui-warning);
}

.dot {
  position: relative;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--c);
  box-shadow: 0 0 10px var(--c);
}

.status[data-status='live'] .dot::after,
.status[data-status='connecting'] .dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 9999px;
  border: 1px solid var(--c);
  animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  to {
    transform: scale(2.4);
    opacity: 0;
  }
}

.seat {
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  background: color-mix(in oklab, var(--ui-bg-elevated) 85%, transparent);
  box-shadow:
    0 0 0 2px color-mix(in oklab, var(--ui-bg) 80%, transparent),
    inset 0 1px 0 color-mix(in oklab, white 15%, transparent);
  transition: box-shadow 0.3s;
}

.seat.picking {
  box-shadow:
    0 0 0 2px var(--ui-secondary),
    0 0 12px var(--ui-secondary);
}

.seat-more {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--ui-text-toned);
}

.dots i {
  font-style: normal;
  animation: dot 1.2s infinite;
}

.dots i:nth-child(2) {
  animation-delay: 0.2s;
}

.dots i:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot {
  0%,
  60%,
  100% {
    opacity: 0.2;
  }
  30% {
    opacity: 1;
  }
}

.ticker {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}

.track {
  display: flex;
  width: max-content;
  gap: 1.75rem;
  animation: marquee var(--duration) linear infinite;
}

.ticker:hover .track {
  animation-play-state: paused;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  white-space: nowrap;
  color: var(--ui-text-toned);
}

@keyframes marquee {
  to {
    transform: translateX(calc(-50% - 0.875rem));
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker {
    overflow-x: auto;
  }
}
</style>
