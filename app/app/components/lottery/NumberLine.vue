<script setup lang="ts">
/**
 * A lottery's number line, 0 to `max`, read left to right in every language:
 * how the tickets in play crowd it, the player's own tickets, and the number
 * about to be bought with the stretch of the line it would win on. Tap or
 * drag along it to pick a number (`pick` while it moves, `done` on release).
 * When that stretch is too thin to see (a crowded round), a lens below
 * magnifies it between the two tickets that cut it, and picks numbers one by
 * one. Pointer only: the keypad and the buttons beside it do the same by
 * keyboard.
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

/** Below this share of the line, the picked number's stretch is a sliver: the lens shows it. */
const LENS_BELOW = 0.08;
const mineSet = computed(() => new Set(props.mine));
/** While a drag runs in the lens, its window holds still under the pointer. */
const lensHeld = shallowRef<{ from: number; to: number } | null>(null);
const lensFrame = computed(() => {
  if (lensHeld.value) return lensHeld.value;
  if (!props.valid || !props.sorted.length) return null;
  const { lo, hi } = territory(props.sorted, props.value, props.max);
  if ((hi - lo + 1) / (props.max + 1) >= LENS_BELOW) return null;
  return lensWindow(props.sorted, props.value, props.max);
});
const lens = computed(() => {
  const frame = lensFrame.value;
  if (!frame) return null;
  const { from, to } = frame;
  const size = to - from + 1;
  /** A number's cell in the lens, as a share of its width: where it starts, or its middle. */
  const start = (n: number) => `${((Math.min(to + 1, Math.max(from, n)) - from) / size) * 100}%`;
  const middle = (n: number) => `${((Math.min(to, Math.max(from, n)) - from + 0.5) / size) * 100}%`;
  const zone = props.valid ? territory(props.sorted, props.value, props.max) : null;
  return {
    from,
    to,
    factor: Math.max(1, Math.round((props.max + 1) / size)),
    bracket: { left: at(from), width: `${(size / (props.max + 1)) * 100}%` },
    zone: zone && { left: start(zone.lo), width: `calc(${start(zone.hi + 1)} - ${start(zone.lo)})` },
    tickets: between(props.sorted, from, to, 400).map((n) => ({ n, left: middle(n), mine: mineSet.value.has(n) })),
    needle: middle(props.value),
  };
});

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

const lensTrack = useTemplateRef<HTMLElement>('lensTrack');
const lensDragging = ref(false);

function lensNumberAt(event: PointerEvent) {
  const { from, to } = lensFrame.value!;
  const box = lensTrack.value!.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
  return Math.min(to, from + Math.floor(x * (to - from + 1)));
}

function onLensDown(event: PointerEvent) {
  if (event.button !== 0 || !lensFrame.value) return;
  lensHeld.value = lensFrame.value;
  lensDragging.value = true;
  lensTrack.value?.setPointerCapture(event.pointerId);
  emit('pick', lensNumberAt(event));
}

function onLensMove(event: PointerEvent) {
  if (!lensDragging.value) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => emit('pick', lensNumberAt(event)));
}

function onLensUp() {
  if (!lensDragging.value) return;
  lensDragging.value = false;
  lensHeld.value = null;
  emit('done');
}

onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>

<template>
  <div class="number-line" dir="ltr">
    <div
      ref="track"
      class="track"
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
      <span v-if="lens" class="bracket" :style="lens.bracket" />
      <span v-for="(n, i) in pins" :key="i" class="pin" :style="{ left: at(n) }" />
      <span class="needle" :class="{ bad: !valid }" :style="{ left: at(value) }"><b /></span>
    </div>
    <div class="scale font-mono" aria-hidden="true">
      <span v-for="(n, i) in ticks" :key="i">{{ formatNumber(n) }}</span>
    </div>
    <Transition name="lens">
      <div v-if="lens" class="lens">
        <div
          ref="lensTrack"
          class="lens-track"
          :class="{ dragging: lensDragging }"
          aria-hidden="true"
          @pointerdown="onLensDown"
          @pointermove="onLensMove"
          @pointerup="onLensUp"
          @pointercancel="onLensUp"
        >
          <span v-if="lens.zone" class="zone" :style="lens.zone" />
          <span
            v-for="ticket in lens.tickets"
            :key="ticket.n"
            class="tick"
            :class="{ mine: ticket.mine }"
            :style="{ left: ticket.left }"
          />
          <span class="needle" :style="{ left: lens.needle }"><b /></span>
        </div>
        <div class="scale font-mono" aria-hidden="true">
          <span>{{ formatNumber(lens.from) }}</span>
          <span class="zoom">×{{ formatNumber(lens.factor) }}</span>
          <span>{{ formatNumber(lens.to) }}</span>
        </div>
      </div>
    </Transition>
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
  border-radius: 1rem;
  box-shadow: var(--neu-in);
  cursor: crosshair;
  /* Vertical swipes still scroll the page; sideways ones pick. */
  touch-action: pan-y;
  user-select: none;
}

.bars {
  position: absolute;
  inset: 0.55rem 0.5rem 0.4rem;
  display: flex;
  align-items: flex-end;
  gap: 1px;
}

.bars > i {
  flex: 1;
  height: calc(var(--h) * 100%);
  border-radius: 1px 1px 0 0;
  background: color-mix(in oklab, var(--ui-text-muted) 45%, transparent);
  transition: height 0.6s var(--ease-out-expo);
}

/* The stretch of the line the picked number would win on. */
.zone {
  position: absolute;
  inset-block: 0;
  min-width: 3px;
  background: color-mix(in oklab, var(--ui-secondary) 12%, transparent);
  box-shadow:
    inset 1px 0 0 color-mix(in oklab, var(--ui-secondary) 60%, transparent),
    inset -1px 0 0 color-mix(in oklab, var(--ui-secondary) 60%, transparent);
  transition:
    left 0.45s var(--ease-out-expo),
    width 0.45s var(--ease-out-expo);
}

/* The player's own tickets: pins along the top edge. */
.pin {
  position: absolute;
  top: 0.3rem;
  width: 0.4rem;
  height: 0.4rem;
  translate: -50% 0;
  border-radius: 9999px;
  background: var(--ui-primary);
  box-shadow: 0 0 6px var(--ui-primary);
}

/* The picked number: a needle with a knob, gliding when it changes. */
.needle {
  position: absolute;
  inset-block: 0;
  width: 2px;
  translate: -50% 0;
  background: var(--ui-secondary);
  transition: left 0.45s var(--ease-out-expo);
}

.needle > b {
  position: absolute;
  bottom: 0.3rem;
  left: 50%;
  width: 0.8rem;
  height: 0.8rem;
  translate: -50% 0;
  border-radius: 9999px;
  background: var(--ui-bg);
  box-shadow:
    var(--neu-xs),
    inset 0 0 0 2.5px var(--ui-secondary);
}

.needle.bad {
  background: var(--ui-error);
}

.needle.bad > b {
  box-shadow:
    var(--neu-xs),
    inset 0 0 0 2.5px var(--ui-error);
}

/* Where the lens below looks: a bracket around its stretch of the line. */
.bracket {
  position: absolute;
  inset-block: 0.2rem;
  min-width: 6px;
  translate: -1px 0;
  border: 1px solid color-mix(in oklab, var(--ui-text-highlighted) 55%, transparent);
  border-radius: 4px;
  pointer-events: none;
  transition:
    left 0.45s var(--ease-out-expo),
    width 0.45s var(--ease-out-expo);
}

.dragging .needle,
.dragging .zone,
.dragging .tick {
  transition: none;
}

/* The lens: the picked number's neighborhood, magnified, picked number by number. */
.lens {
  margin-top: 0.75rem;
}

.lens-track {
  position: relative;
  height: 2.75rem;
  overflow: hidden;
  border-radius: 0.9rem;
  box-shadow: var(--neu-in-sm);
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
}

.lens-track .needle,
.lens-track .zone {
  transition-duration: 0.3s;
}

/* A ticket in the lens: a bar standing on the floor; your own are lit. */
.tick {
  position: absolute;
  bottom: 0.4rem;
  width: 3px;
  height: 50%;
  translate: -50% 0;
  border-radius: 2px;
  background: color-mix(in oklab, var(--ui-text-muted) 60%, transparent);
  transition: left 0.3s var(--ease-out-expo);
}

.tick.mine {
  background: var(--ui-primary);
  box-shadow: 0 0 6px var(--ui-primary);
}

.tick.mine::before {
  content: '';
  position: absolute;
  top: -0.55rem;
  left: 50%;
  width: 0.4rem;
  height: 0.4rem;
  translate: -50% 0;
  border-radius: 9999px;
  background: var(--ui-primary);
}

.zoom {
  padding: 0 0.45rem;
  border-radius: 9999px;
  color: var(--ui-text-toned);
  box-shadow: var(--neu-in-sm);
}

.lens-enter-active,
.lens-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s var(--ease-out-expo);
}

.lens-enter-from,
.lens-leave-to {
  opacity: 0;
  transform: translateY(-0.4rem);
}

.scale {
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
  padding-inline: 0.2rem;
  font-size: 0.625rem;
  color: var(--ui-text-dimmed);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 1rem;
  margin-top: 0.4rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.key {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 2px;
}

.key-play {
  background: color-mix(in oklab, var(--ui-text-muted) 45%, transparent);
}

.key-mine {
  border-radius: 9999px;
  background: var(--ui-primary);
}

.key-pick {
  width: 0.2rem;
  height: 0.75rem;
  background: var(--ui-secondary);
}
</style>
