<script setup lang="ts">
import { countryFromBytes, flagEmoji, GameKind, msUntilClose } from '@solucky/client';

/**
 * The live layer of the solar dial: the sun at the cluster's time of day, the
 * share of the round already gone, and today's tickets, each placed by the
 * time it was bought (around) and its number (outwards). Sits on `LandingDialFace`.
 */
const { t } = useI18n();
const intl = useIntlLocale();
const { period, tickets, pot, maxNumber, loading } = useLottery(GameKind.Daily);
const { address } = useWallet();
const { flare } = useSolarFlares();
const price = useSolPrice();
const now = useNow();

const sun = computed(() => {
  const angle = dialAngle(now.value);
  const progress = dayProgress(now.value);
  const end = dialPoint(angle, DIAL.ring);
  const arc = `M 0 ${-DIAL.ring} A ${DIAL.ring} ${DIAL.ring} 0 ${progress > 0.5 ? 1 : 0} 1 ${end.x} ${end.y}`;
  return { ...end, arc, hand: { from: dialPoint(angle, DIAL.core), to: dialPoint(angle, DIAL.ring - 16) } };
});

const dots = computed(() =>
  tickets.value.map((ticket) => {
    const { number, createdAt, owner, country } = ticket.data;
    const angle = dialAngle(Number(createdAt) * 1000);
    const radius = DIAL.inner + (DIAL.outer - DIAL.inner) * Math.min(1, number / maxNumber.value);
    const flag = flagEmoji(countryFromBytes(country));
    return {
      key: ticket.address,
      angle,
      mine: owner === address.value,
      title: `${formatNumber(number)} ${flag} · ${formatUtcTime(createdAt)} UTC`,
      ...dialPoint(angle, radius),
    };
  }),
);

// A ping on the dial and a flare in the corona for each ticket bought while the page is open.
const ping = ref<{ key: string; x: number; y: number } | null>(null);
watch(
  () => dots.value.at(-1),
  (newest, previous) => {
    if (!newest || !previous || newest.key === previous.key) return;
    ping.value = { key: newest.key, x: newest.x, y: newest.y };
    flare(newest.angle);
  },
);

// Flash the pot whenever it grows.
const bumps = ref(0);
watch(pot, (next, previous) => {
  if (next > previous) bumps.value++;
});

const countdown = computed(() => {
  const day = period.value ?? 0;
  const total = Math.max(0, Math.floor(msUntilClose(GameKind.Daily, day, now.value) / 1000));
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
});
</script>

<template>
  <div class="absolute inset-0" dir="ltr">
    <svg viewBox="-300 -300 600 600" class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id="dial-arc" x1="0" y1="-1" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" style="stop-color: var(--ui-color-primary-300)" />
          <stop offset="1" style="stop-color: var(--ui-color-primary-600)" />
        </linearGradient>
      </defs>

      <!-- The day so far, from 00:00 UTC to now. -->
      <path :d="sun.arc" class="fill-none stroke-(--ui-primary)/25" stroke-width="12" stroke-linecap="round" />
      <path :d="sun.arc" fill="none" stroke="url(#dial-arc)" stroke-width="3" stroke-linecap="round" />
      <line
        :x1="sun.hand.from.x"
        :y1="sun.hand.from.y"
        :x2="sun.hand.to.x"
        :y2="sun.hand.to.y"
        class="stroke-(--ui-primary)/50"
        stroke-dasharray="3 5"
      />

      <!-- Scale of the numbers, from 0 at the inner ring to the highest at the outer one. -->
      <g class="fill-(--ui-text-dimmed) font-mono text-[10px]">
        <text :x="6" :y="-DIAL.inner - 5">0</text>
        <text :x="6" :y="-DIAL.outer - 5">{{ formatNumber(maxNumber) }}</text>
      </g>
    </svg>

    <!-- Tickets: a native tooltip names each one. -->
    <svg
      viewBox="-300 -300 600 600"
      class="absolute inset-0 size-full"
      role="img"
      :aria-label="t('dial.tickets', { n: dots.length }, dots.length)"
    >
      <g v-for="(dot, index) in dots" :key="dot.key">
        <title>{{ dot.title }}</title>
        <circle :cx="dot.x" :cy="dot.y" r="9" fill="transparent" />
        <circle
          v-if="dot.mine"
          :cx="dot.x"
          :cy="dot.y"
          r="7"
          class="fill-none stroke-(--ui-secondary)"
          stroke-width="1.5"
        />
        <circle
          :cx="dot.x"
          :cy="dot.y"
          r="3.4"
          :class="dot.mine ? 'fill-(--ui-secondary)' : 'fill-(--ui-primary)'"
          class="animate-twinkle"
          :style="{ animationDelay: `${-((index * 0.37) % 4)}s` }"
        />
      </g>
      <circle
        v-if="ping"
        :key="ping.key"
        :cx="ping.x"
        :cy="ping.y"
        r="6"
        class="animate-ping-once fill-none stroke-(--ui-secondary) [transform-box:fill-box] origin-center"
        stroke-width="2"
      />

      <!-- The sun, riding the ring at the current time. -->
      <g :transform="`translate(${sun.x} ${sun.y})`" aria-hidden="true">
        <circle r="16" class="animate-ping fill-(--ui-primary)/30 [transform-box:fill-box] origin-center" />
        <circle r="10" class="fill-(--ui-color-primary-300) glow-primary" />
        <circle r="10" class="fill-none stroke-(--ui-bg)" stroke-width="2" />
        <circle r="3" class="fill-(--ui-bg)" />
      </g>
    </svg>

    <!-- The pot, in the middle of the sun. -->
    <div class="absolute inset-[28%] flex flex-col items-center justify-center text-center">
      <p class="kicker text-[0.6rem]">{{ t('dial.pot') }}</p>
      <USkeleton v-if="loading" class="mt-2 h-8 w-28" />
      <p v-else :key="bumps" class="glow-primary mt-1.5 motion-safe:animate-bump">
        <span
          class="led block font-mono text-[min(3rem,9cqw)] leading-none font-extrabold text-highlighted tabular-nums"
        >
          ◎{{ formatSol(pot, 3) }}
        </span>
      </p>
      <p class="mt-1.5 font-mono text-[0.7rem] text-muted tabular-nums">{{ formatUsd(pot, price, intl) }}</p>
      <p
        class="led mt-3 font-mono text-[min(1.7rem,5cqw)] leading-none font-extrabold text-primary tabular-nums [--led-pitch:0.1em]"
      >
        {{ countdown }}
      </p>
      <p class="kicker mt-1 text-[0.6rem] text-secondary">
        {{ t('dial.toDraw', { day: roundTitle(GameKind.Daily, period ?? 0) }) }}
      </p>
    </div>
  </div>
</template>
