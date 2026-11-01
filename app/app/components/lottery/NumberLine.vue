<script setup lang="ts">
/**
 * A lottery's number line, 0 to `max`, read left to right in every language:
 * how the tickets in play crowd it, the player's own tickets, and the number
 * about to be bought with the stretch of the line it would win on. Tap or
 * drag along it to pick a number (`pick` while it moves, `done` on release).
 * Pointer only: the keypad and the buttons beside it do the same by keyboard.
 */
const props = defineProps<{
  /** The round's numbers, ascending (see `sortNumbers`). */
  sorted: readonly number[];
  mine: readonly number[];
  value: number;
  max: number;
  /** False when `value` is taken or out of range: no stretch to show. */
  valid: boolean;
}>();
const emit = defineEmits<{ pick: [number: number]; done: [] }>();
const { t, localeProperties } = useI18n();
/** The line runs left to right everywhere; its legend reads in the page's direction. */
const pageDir = computed(() => localeProperties.value.dir ?? 'ltr');

const BINS = 96;
/** Each slice's bar height, 0 to 1: square-root scaled so one ticket still shows next to a crowd. */
const bars = computed(() => {
  const counts = density(props.sorted, props.max, BINS);
  const top = Math.max(1, ...counts);
  return counts.map((count) => (count ? 0.3 + 0.7 * Math.sqrt(count / top) : 0));
});
const at = (n: number) => `${(Math.min(props.max, Math.max(0, n)) / props.max) * 100}%`;
// A whale's thousand tickets would be a thousand pins: a few hundred draw the same picture.
const pins = computed(() => props.mine.slice(0, 300));
const zone = computed(() => {
  if (!props.valid) return null;
  const { lo, hi } = territory(props.sorted, props.value, props.max);
  return { left: at(lo), width: `${((hi - lo + 1) / (props.max + 1)) * 100}%` };
});
const ticks = computed(() => [0, Math.round(props.max / 2), props.max]);

const track = useTemplateRef<HTMLElement>('track');
const dragging = ref(false);
let frame = 0;

function numberAt(event: PointerEvent) {
  const box = track.value!.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
  return Math.round(x * props.max);
}

function onDown(event: PointerEvent) {
  if (event.button !== 0) return;
  dragging.value = true;
  track.value?.setPointerCapture(event.pointerId);
  emit('pick', numberAt(event));
}

function onMove(event: PointerEvent) {
  if (!dragging.value) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => emit('pick', numberAt(event)));
}

function onUp() {
  if (!dragging.value) return;
  dragging.value = false;
  emit('done');
}

onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>

<template>
  <div class="number-line" dir="ltr">
    <div
      ref="track"
      class="track table-well"
      :class="{ dragging }"
      :title="t('pick.line')"
      aria-hidden="true"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
    >
      <div class="bars">
        <i v-for="(h, i) in bars" :key="i" :style="{ '--h': h }" />
      </div>
      <span v-if="zone" class="zone" :style="{ left: zone.left, width: zone.width }" />
      <span v-for="(n, i) in pins" :key="i" class="pin" :style="{ left: at(n) }" />
      <span class="needle" :class="{ bad: !valid }" :style="{ left: at(value) }"><b /></span>
    </div>
    <div class="scale font-mono" aria-hidden="true">
      <span v-for="(n, i) in ticks" :key="i">{{ formatNumber(n) }}</span>
    </div>
    <ul class="legend" :dir="pageDir">
      <li><i class="key key-play" />{{ t('pot.inPlay') }}</li>
      <li><i class="key key-mine" />{{ t('stat.yourTickets') }}</li>
      <li><i class="key key-pick" />{{ t('pick.yourPick') }}</li>
    </ul>
  </div>
</template>

<style scoped>
.track {
  position: relative;
  height: 3.25rem;
  overflow: hidden;
  border-radius: 0.9rem;
  cursor: crosshair;
  /* Vertical swipes still scroll the page; sideways ones pick. */
  touch-action: pan-y;
  user-select: none;
}

.bars {
  position: absolute;
  inset: 0.5rem 0.4rem 0.35rem;
  display: flex;
  align-items: flex-end;
  gap: 1px;
}

.bars > i {
  flex: 1;
  height: calc(var(--h) * 100%);
  border-radius: 1px 1px 0 0;
  background: linear-gradient(
    to top,
    color-mix(in oklab, var(--ui-primary) 25%, transparent),
    color-mix(in oklab, var(--ui-primary) 65%, transparent)
  );
  transition: height 0.6s var(--ease-out-expo);
}

/* The stretch of the line the picked number would win on. */
.zone {
  position: absolute;
  inset-block: 0;
  min-width: 3px;
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, var(--ui-secondary) 22%, transparent),
    color-mix(in oklab, var(--ui-secondary) 5%, transparent)
  );
  box-shadow:
    inset 1px 0 0 color-mix(in oklab, var(--ui-secondary) 70%, transparent),
    inset -1px 0 0 color-mix(in oklab, var(--ui-secondary) 70%, transparent);
  transition:
    left 0.45s var(--ease-out-expo),
    width 0.45s var(--ease-out-expo);
}

/* The player's own tickets: pins along the top edge. */
.pin {
  position: absolute;
  top: 0.2rem;
  width: 0.45rem;
  height: 0.45rem;
  translate: -50% 0;
  rotate: 45deg;
  border-radius: 1px;
  background: var(--color-pink-500);
  box-shadow: 0 0 8px var(--color-pink-500);
}

/* The picked number: a needle with a knob, gliding when it changes. */
.needle {
  position: absolute;
  inset-block: 0;
  width: 2px;
  translate: -50% 0;
  background: var(--ui-secondary);
  box-shadow: 0 0 10px var(--ui-secondary);
  transition: left 0.45s var(--ease-out-expo);
}

.needle > b {
  position: absolute;
  bottom: 0.25rem;
  left: 50%;
  width: 0.7rem;
  height: 0.7rem;
  translate: -50% 0;
  border-radius: 9999px;
  background: var(--ui-secondary);
  box-shadow:
    0 0 0 2px color-mix(in oklab, var(--ui-bg) 70%, transparent),
    0 0 14px var(--ui-secondary);
}

.needle.bad,
.needle.bad > b {
  background: var(--ui-error);
  box-shadow: 0 0 10px var(--ui-error);
}

.dragging .needle,
.dragging .zone {
  transition: none;
}

.scale {
  display: flex;
  justify-content: space-between;
  margin-top: 0.3rem;
  padding-inline: 0.15rem;
  font-size: 0.625rem;
  color: var(--ui-text-dimmed);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 1rem;
  margin-top: 0.35rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.key {
  display: inline-block;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 2px;
}

.key-play {
  background: color-mix(in oklab, var(--ui-primary) 65%, transparent);
}

.key-mine {
  rotate: 45deg;
  background: var(--color-pink-500);
}

.key-pick {
  width: 0.2rem;
  height: 0.75rem;
  background: var(--ui-secondary);
  box-shadow: 0 0 6px var(--ui-secondary);
}
</style>
