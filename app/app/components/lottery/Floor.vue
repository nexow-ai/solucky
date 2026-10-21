<!--
  The casino floor behind the play page's glass: a roulette halo turning
  slowly behind the table, neon orbs drifting under it, and a grid floor
  running to the horizon. It is what the glass refracts, so it carries color
  and motion; with reduced motion it holds still.
-->
<template>
  <div aria-hidden="true" class="floor pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
    <div class="orb orb-a" />
    <div class="orb orb-b" />
    <div class="orb orb-c" />
    <div class="wheel">
      <div class="wheel-ring" />
      <div class="wheel-ticks" />
    </div>
    <div class="horizon" />
    <div class="grid-floor" />
    <div class="scan" />
    <div class="vignette" />
  </div>
</template>

<style scoped>
.orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.55;
  will-change: transform;
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
  translate: -50% -50%;
  opacity: 0.5;
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
  mask: radial-gradient(circle, transparent 58%, #000 59%, #000 66%, transparent 67%);
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

:global(:root:not(.dark)) .floor {
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
