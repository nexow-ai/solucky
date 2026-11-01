<!--
  The casino floor behind the play page's glass: a roulette halo turning
  slowly behind the table, neon orbs drifting under it, and a grid floor
  running to the horizon with streaks of light racing down it. It is what the
  glass refracts, so it carries color and motion: its layers shift with the
  pointer at different depths, and a shockwave rings out from the halo each
  time a ticket lands. With reduced motion it holds still.
-->
<script setup lang="ts">
const floor = useTemplateRef<HTMLElement>('floor');
useTilt(floor, { window: true });

const { tickets, loading } = useLottery();
const shocks = ref<number[]>([]);
let next = 0;
watch(
  () => tickets.value.length,
  (count, previous) => {
    if (loading.value || previous === undefined || count <= previous) return;
    const id = next++;
    shocks.value = [...shocks.value, id];
    setTimeout(() => (shocks.value = shocks.value.filter((s) => s !== id)), 2_200);
  },
);
</script>

<template>
  <div ref="floor" aria-hidden="true" class="floor pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
    <div class="orb orb-a" />
    <div class="orb orb-b" />
    <div class="orb orb-c" />
    <div class="wheel">
      <div class="wheel-ring" />
      <div class="wheel-ticks" />
    </div>
    <div class="wheel wheel-shocks">
      <span v-for="id in shocks" :key="id" class="shock" />
    </div>
    <div class="horizon" />
    <div class="grid-floor">
      <span class="lane lane-a"><i /></span>
      <span class="lane lane-b"><i /></span>
      <span class="lane lane-c"><i /></span>
    </div>
    <div class="scan" />
    <div class="vignette" />
  </div>
</template>

<style scoped>
.orb {
  --depth: 28px;
  position: absolute;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.55;
  will-change: transform;
  translate: calc(var(--tilt-x, 0) * var(--depth)) calc(var(--tilt-y, 0) * var(--depth));
  transition: translate 1.6s var(--ease-out-expo);
}

.orb-b {
  --depth: -36px;
}

.orb-c {
  --depth: 18px;
}

.orb-a {
  top: -8rem;
  left: -6rem;
  width: 38rem;
  height: 38rem;
  background: radial-gradient(circle, color-mix(in oklab, var(--ui-primary) 80%, transparent), transparent 65%);
  animation: orb-a 38s ease-in-out infinite alternate;
}

.orb-b {
  right: -10rem;
  top: 18%;
  width: 34rem;
  height: 34rem;
  background: radial-gradient(circle, color-mix(in oklab, var(--ui-secondary) 55%, transparent), transparent 65%);
  opacity: 0.35;
  animation: orb-b 46s ease-in-out infinite alternate;
}

.orb-c {
  left: 30%;
  bottom: -14rem;
  width: 44rem;
  height: 30rem;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-color-primary-800) 90%, transparent),
    transparent 65%
  );
  animation: orb-c 54s ease-in-out infinite alternate;
}

@keyframes orb-a {
  to {
    transform: translate3d(14vw, 12vh, 0) scale(1.15);
  }
}
@keyframes orb-b {
  to {
    transform: translate3d(-18vw, 22vh, 0) scale(0.9);
  }
}
@keyframes orb-c {
  to {
    transform: translate3d(-12vw, -10vh, 0) scale(1.2);
  }
}

/* A roulette wheel's halo, centred behind the table. */
.wheel {
  position: absolute;
  left: 50%;
  top: 46%;
  width: min(118vh, 96vw);
  aspect-ratio: 1;
  translate: calc(-50% + var(--tilt-x, 0) * -14px) calc(-50% + var(--tilt-y, 0) * -10px);
  transition: translate 1.4s var(--ease-out-expo);
  opacity: 0.32;
  filter: blur(1px);
}

/* Same place as the halo, at full strength. */
.wheel-shocks {
  opacity: 1;
  filter: none;
}

/* A ticket landed: a ring of light rolls out from the halo's centre. */
.shock {
  position: absolute;
  inset: 30%;
  border-radius: 9999px;
  box-shadow:
    0 0 0 2px var(--ui-secondary),
    0 0 40px 6px color-mix(in oklab, var(--ui-secondary) 55%, transparent),
    inset 0 0 40px 2px color-mix(in oklab, var(--ui-secondary) 35%, transparent);
  animation: shock 2.2s var(--ease-out-expo) forwards;
}

@keyframes shock {
  from {
    opacity: 1;
    scale: 0.2;
  }
  to {
    opacity: 0;
    scale: 2.2;
  }
}

.wheel-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: repeating-conic-gradient(
    from 0deg,
    color-mix(in oklab, var(--ui-primary) 55%, transparent) 0deg 4.86deg,
    transparent 4.86deg 9.73deg
  );
  mask: radial-gradient(circle, transparent 61.5%, #000 62%, #000 64.5%, transparent 65%);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ui-primary) 30%, transparent);
  animation: spin 120s linear infinite;
}

.wheel-ticks {
  position: absolute;
  inset: 6%;
  border-radius: 9999px;
  background:
    repeating-conic-gradient(
      from 2deg,
      color-mix(in oklab, var(--ui-secondary) 70%, transparent) 0deg 0.6deg,
      transparent 0.6deg 9.73deg
    ),
    radial-gradient(
      circle,
      transparent 62%,
      color-mix(in oklab, var(--ui-primary) 22%, transparent) 63%,
      transparent 64%
    );
  mask: radial-gradient(circle, transparent 66%, #000 67%, #000 72%, transparent 73%);
  animation: spin 200s linear infinite reverse;
}

@keyframes spin {
  to {
    rotate: 360deg;
  }
}

/* Where the floor meets the night. */
.horizon {
  position: absolute;
  inset-inline: 0;
  bottom: 34%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--ui-primary) 30%,
    var(--ui-secondary) 50%,
    var(--ui-primary) 70%,
    transparent
  );
  box-shadow:
    0 0 24px 2px color-mix(in oklab, var(--ui-primary) 60%, transparent),
    0 0 120px 30px color-mix(in oklab, var(--ui-primary) 18%, transparent);
  opacity: 0.6;
}

/* A neon grid floor, running to the horizon. */
.grid-floor {
  position: absolute;
  inset-inline: -50%;
  bottom: -10%;
  height: 46%;
  transform: perspective(520px) rotateX(64deg);
  transform-origin: 50% 100%;
  background-image:
    linear-gradient(color-mix(in oklab, var(--ui-primary) 45%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--ui-primary) 35%, transparent) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to top, #000 10%, transparent 90%);
  animation: run 6s linear infinite;
  opacity: 0.55;
}

/* Streaks of light racing down the floor's grid lines, towards the viewer. */
.lane {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  overflow: hidden;
}

.lane-a {
  left: calc(round(50%, 64px) - 192px);
}

.lane-b {
  left: calc(round(50%, 64px) + 128px);
}

.lane-c {
  left: calc(round(50%, 64px) - 448px);
}

.lane > i {
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 14%;
  background: linear-gradient(to bottom, transparent, var(--ui-secondary));
  box-shadow: 0 0 10px var(--ui-secondary);
  translate: 0 -100%;
  animation: streak 4.2s cubic-bezier(0.5, 0, 0.9, 0.6) infinite;
}

.lane-b > i {
  background: linear-gradient(to bottom, transparent, var(--ui-color-primary-300));
  box-shadow: 0 0 10px var(--ui-primary);
  animation-duration: 5.6s;
  animation-delay: -2.1s;
}

.lane-c > i {
  animation-duration: 7s;
  animation-delay: -4.4s;
}

@keyframes streak {
  0% {
    translate: 0 -100%;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    translate: 0 720%;
    opacity: 0.2;
  }
}

@keyframes run {
  to {
    background-position:
      0 64px,
      0 0;
  }
}

.scan {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(to bottom, transparent 0 2px, rgb(0 0 0 / 0.16) 2px 3px);
  mix-blend-mode: multiply;
  opacity: 0.6;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 40%,
    transparent 45%,
    color-mix(in oklab, var(--ui-bg) 85%, transparent) 100%
  );
}

:root:not(.dark) .floor {
  opacity: 0.45;
}

@media (max-width: 640px) {
  .orb {
    filter: blur(40px);
  }
  .grid-floor {
    animation-duration: 9s;
  }
}
</style>
