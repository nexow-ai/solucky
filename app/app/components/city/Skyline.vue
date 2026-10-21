<script setup lang="ts">
/**
 * The neon city at the foot of every page: a synthwave sun setting behind two
 * layers of towers, a grid floor running into the footer, and a night that
 * moves. Stars twinkle, searchlights sweep, flying cars stream between the
 * towers, planes cross with their lights blinking (one tows a banner), and
 * UFOs drop by: one hovers over the rooftops with its tractor beam on.
 *
 * Everything moves with CSS transforms, paused while the city is off screen
 * and still with reduced motion. The layers drift apart with the mouse. The
 * towers' own lights blink inside their SVGs, which repeat across the width.
 */
const root = useTemplateRef<HTMLElement>('root');

// Cut-outs in the lower half of the sun, one every 14 units and thicker
// towards the bottom. Each slides into the next one's place and size, so the
// loop has no seam.
const STRIPES = Array.from({ length: 9 }, (_, i) => {
  const height = 2 + i;
  return { y: 94 + i * 14 - height / 2, height, grow: (height + 1) / height };
});

// A seeded random source, so the server and the browser place everything alike.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const fixed = (value: number) => Math.round(value * 100) / 100;

const random = seeded(2022);
const stars = Array.from({ length: 56 }, (_, i) => ({
  key: i,
  style: {
    left: `${fixed(random() * 100)}%`,
    top: `${fixed(2 + random() * 46)}%`,
    '--size': `${random() < 0.15 ? 2 : 1}px`,
    animationDuration: `${fixed(2 + random() * 4)}s`,
    animationDelay: `${fixed(-random() * 6)}s`,
  },
}));

// Flying cars in two lanes: the far one runs behind the near towers, so they cut it off.
function lane(count: number, top: number, spread: number, speed: [number, number]) {
  return Array.from({ length: count }, (_, i) => {
    const forward = random() < 0.5;
    const duration = speed[0] + random() * (speed[1] - speed[0]);
    return {
      key: i,
      forward,
      style: {
        top: `${fixed(top + (random() - 0.5) * spread)}%`,
        animationDuration: `${fixed(duration)}s`,
        animationDelay: `${fixed(-random() * duration)}s`,
      },
    };
  });
}
const farTraffic = lane(9, 52, 10, [16, 28]);
const nearTraffic = lane(5, 68, 6, [8, 14]);

const planes = [
  { key: 'high', top: '8%', scale: 0.7, forward: true, duration: 78, delay: -12, banner: false },
  { key: 'low', top: '30%', scale: 1.1, forward: false, duration: 54, delay: -36, banner: false },
  { key: 'banner', top: '17%', scale: 0.95, forward: true, duration: 66, delay: -48, banner: true },
];

let frame = 0;
let visible = false;

function onPointer(event: PointerEvent) {
  if (!visible || event.pointerType !== 'mouse') return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    root.value?.style.setProperty('--px', (event.clientX / window.innerWidth - 0.5).toFixed(3));
    root.value?.style.setProperty('--py', (event.clientY / window.innerHeight - 0.5).toFixed(3));
  });
}

let observer: IntersectionObserver | undefined;
onMounted(() => {
  if (!root.value) return;
  // The night only runs while it is on screen.
  observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    root.value?.toggleAttribute('data-running', visible);
  });
  observer.observe(root.value);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  window.removeEventListener('pointermove', onPointer);
});
</script>

<template>
  <div ref="root" aria-hidden="true" class="skyline dark pointer-events-none relative overflow-hidden">
    <div class="sky" />
    <div class="stars">
      <span v-for="star in stars" :key="star.key" class="star" :style="star.style" />
    </div>
    <CityDigitRain class="rain absolute inset-x-0 top-0" />

    <!-- Searchlights, sweeping from behind the far towers. -->
    <div class="searchlight [--from:-26deg] [--to:18deg] left-[28%]" />
    <div class="searchlight [--delay:-7s] [--duration:17s] [--from:24deg] [--to:-14deg] left-[82%]" />

    <!-- Planes high up; one tows a banner. -->
    <div
      v-for="plane in planes"
      :key="plane.key"
      class="flight"
      :class="plane.forward ? 'forward' : 'backward'"
      :style="{ top: plane.top, animationDuration: `${plane.duration}s`, animationDelay: `${plane.delay}s` }"
    >
      <div class="plane" :style="{ scale: plane.scale }">
        <div v-if="plane.banner" class="banner"><span>S☉LUCKY ◎ 00:00 UTC</span></div>
        <svg viewBox="0 0 48 16" class="airliner">
          <path d="M20 8 28 1.5h3L27 8Z" class="wing-far" />
          <path d="M2 8.5C2 7 4 6.5 8 6.5h30c5 0 8 1 9 2-1 1-4 1.5-9 1.5H8c-4 0-6-.2-6-1.5Z" class="body" />
          <path d="M2.4 8 1 2h3l5 5Z" class="body" />
          <path d="m20 9.5 10 6h3l-6-6Z" class="body" />
          <line x1="11" y1="8.2" x2="37" y2="8.2" class="windows" />
          <circle cx="29.6" cy="1.8" r="1" class="nav-red" />
          <circle cx="31.6" cy="15.2" r="1" class="nav-green" />
          <circle cx="1.6" cy="2.2" r="1" class="strobe" />
        </svg>
      </div>
    </div>

    <!-- A UFO darting across the far sky. -->
    <div class="ufo-dart">
      <svg viewBox="0 0 60 28" class="saucer w-7">
        <use href="#skyline-saucer" />
      </svg>
    </div>

    <div class="sun-wrap">
      <div class="parallax [--depth:10px]">
        <div class="sun-glow" />
        <svg viewBox="0 0 200 200" class="relative w-full">
          <defs>
            <linearGradient id="skyline-sun-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style="stop-color: var(--ui-color-warning-200)" />
              <stop offset="0.42" style="stop-color: var(--ui-color-primary-400)" />
              <stop offset="1" style="stop-color: var(--ui-color-primary-700)" />
            </linearGradient>
            <clipPath id="skyline-sun-lower">
              <rect y="96" width="200" height="104" />
            </clipPath>
            <mask id="skyline-sun-cuts">
              <rect width="200" height="200" fill="white" />
              <g clip-path="url(#skyline-sun-lower)">
                <rect
                  v-for="stripe in STRIPES"
                  :key="stripe.y"
                  class="stripe"
                  fill="black"
                  x="0"
                  :y="stripe.y"
                  width="200"
                  :height="stripe.height"
                  :style="{ '--grow': stripe.grow }"
                />
              </g>
            </mask>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#skyline-sun-fill)" mask="url(#skyline-sun-cuts)" />
        </svg>
      </div>
    </div>

    <!-- The towers repeat sideways at the band's height, so every spire shows in full. -->
    <div class="city-far">
      <div class="layer parallax [--depth:22px]" />
    </div>

    <div class="traffic">
      <span
        v-for="car in farTraffic"
        :key="car.key"
        class="car far"
        :class="car.forward ? 'forward' : 'backward'"
        :style="car.style"
      />
    </div>

    <!-- The S☉Lucky tower, its sign buzzing on and off. -->
    <div class="landmark">
      <div class="spire" />
      <div class="tower">
        <span class="sign">
          <span v-for="(letter, index) in 'S☉LUCKY'" :key="index">{{ letter }}</span>
        </span>
      </div>
    </div>

    <div class="city-near">
      <div class="layer parallax [--depth:44px]" />
    </div>

    <div class="traffic">
      <span
        v-for="car in nearTraffic"
        :key="car.key"
        class="car near"
        :class="car.forward ? 'forward' : 'backward'"
        :style="car.style"
      />
    </div>

    <!-- A UFO that comes down to look at the city, beam on, then leaves in a hurry. -->
    <div class="ufo-visit">
      <div class="beam" />
      <svg viewBox="0 0 60 28" class="saucer w-14 sm:w-16">
        <defs>
          <linearGradient id="skyline-saucer-hull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style="stop-color: var(--ui-color-neutral-300)" />
            <stop offset="1" style="stop-color: var(--ui-color-neutral-700)" />
          </linearGradient>
          <linearGradient id="skyline-saucer-dome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style="stop-color: var(--ui-color-secondary-200); stop-opacity: 0.9" />
            <stop offset="1" style="stop-color: var(--ui-color-secondary-500); stop-opacity: 0.25" />
          </linearGradient>
          <g id="skyline-saucer">
            <ellipse cx="30" cy="20" rx="13" ry="3" class="engine" />
            <path d="M18 13a12 10 0 0 1 24 0Z" fill="url(#skyline-saucer-dome)" class="dome" />
            <ellipse cx="30" cy="15" rx="29" ry="6" fill="url(#skyline-saucer-hull)" />
            <circle
              v-for="(x, index) in [8, 19, 30, 41, 52]"
              :key="x"
              :cx="x"
              cy="15.5"
              r="1.7"
              class="rim-light"
              :style="{ animationDelay: `${index * -0.24}s` }"
            />
          </g>
        </defs>
        <use href="#skyline-saucer" />
      </svg>
    </div>

    <div class="horizon" />
    <div class="floor">
      <div><div /></div>
      <div class="reflection" />
    </div>
  </div>
</template>

<style scoped>
.skyline {
  --floor: 4.5rem;
  container-type: size;
  height: 17rem;
}

@media (min-width: 640px) {
  .skyline {
    --floor: 5.5rem;
    height: 22rem;
  }
}

@media (min-width: 1024px) {
  .skyline {
    --floor: 6rem;
    height: 27rem;
  }
}

/* Off screen, or before the page is live, the night holds still. */
.skyline:not([data-running]) *,
.skyline:not([data-running]) *::before,
.skyline:not([data-running]) *::after {
  animation-play-state: paused !important;
}

/* Night falls from the page into the city: clear on top, magenta at the horizon. */
.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(110% 70% at 60% 100%, color-mix(in oklab, var(--ui-primary) 42%, transparent), transparent 72%),
    radial-gradient(60% 50% at 12% 30%, color-mix(in oklab, var(--ui-secondary) 10%, transparent), transparent 70%),
    linear-gradient(to bottom, transparent, var(--ui-bg) 40%);
  mask-image: linear-gradient(to bottom, transparent, #000 30%);
}

.stars {
  position: absolute;
  inset: 0;
  mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 40%, transparent 60%);
}

.star {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 9999px;
  background: var(--ui-text-highlighted);
  animation: twinkle ease-in-out infinite alternate;
}

@keyframes twinkle {
  from {
    opacity: 0.15;
  }
  to {
    opacity: 0.9;
  }
}

.rain {
  height: 78%;
  opacity: 0.22;
  mask-image: linear-gradient(to bottom, transparent, #000 30%, #000 55%, transparent);
}

.parallax {
  transform: translate3d(
    calc(var(--px, 0) * var(--depth, 12px) * -1),
    calc(var(--py, 0) * var(--depth, 12px) * -0.4),
    0
  );
  transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.searchlight {
  position: absolute;
  bottom: var(--floor);
  width: 9cqw;
  height: 95cqh;
  translate: -50% 0;
  transform-origin: 50% 100%;
  clip-path: polygon(47% 100%, 53% 100%, 100% 0, 0 0);
  background: linear-gradient(
    to top,
    color-mix(in oklab, var(--ui-color-primary-300) 45%, transparent),
    transparent 85%
  );
  animation: sweep var(--duration, 13s) ease-in-out var(--delay, 0s) infinite alternate;
}

@keyframes sweep {
  from {
    transform: rotate(var(--from));
  }
  to {
    transform: rotate(var(--to));
  }
}

/* Anything that crosses the city flies from one side to the other. */
.flight,
.car {
  position: absolute;
  left: 0;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.flight.forward,
.car.forward {
  animation-name: cross-forward;
}

.flight.backward,
.car.backward {
  animation-name: cross-backward;
}

@keyframes cross-forward {
  from {
    transform: translateX(-20cqw);
  }
  to {
    transform: translateX(120cqw);
  }
}

@keyframes cross-backward {
  from {
    transform: translateX(120cqw) scaleX(-1);
  }
  to {
    transform: translateX(-20cqw) scaleX(-1);
  }
}

.plane {
  position: relative;
  transform-origin: left center;
  animation: bob 7s ease-in-out infinite alternate;
}

@keyframes bob {
  to {
    translate: 0 6px;
  }
}

.airliner {
  width: 3.5rem;
}

.airliner .body {
  fill: var(--ui-color-neutral-700);
}

.airliner .wing-far {
  fill: var(--ui-color-neutral-800);
}

.airliner .windows {
  stroke: var(--ui-color-warning-200);
  stroke-width: 0.9;
  stroke-dasharray: 1 1.6;
  opacity: 0.8;
}

.nav-red {
  fill: var(--ui-color-error-400);
  animation: blink 1.6s steps(1) infinite;
}

.nav-green {
  fill: var(--ui-color-success-400);
  animation: blink 1.6s steps(1) infinite;
}

.strobe {
  fill: white;
  opacity: 0;
  animation: strobe 1.4s linear infinite;
}

@keyframes blink {
  50% {
    opacity: 0.2;
  }
}

@keyframes strobe {
  0%,
  6%,
  14%,
  20% {
    opacity: 1;
  }
  3%,
  10%,
  17%,
  100% {
    opacity: 0;
  }
}

/* The towed banner trails behind the plane on a line, flapping a little. */
.banner {
  position: absolute;
  top: 50%;
  right: calc(100% + 1.25rem);
  translate: 0 -50%;
  padding: 0.15rem 0.6rem;
  border: 1px solid color-mix(in oklab, var(--ui-primary) 70%, transparent);
  border-radius: 2px;
  background: color-mix(in oklab, var(--ui-bg) 70%, transparent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  white-space: nowrap;
  color: var(--ui-primary);
  text-shadow: 0 0 8px color-mix(in oklab, var(--ui-primary) 70%, transparent);
  transform-origin: right center;
  animation: flap 1.8s ease-in-out infinite alternate;
}

.banner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  width: 1.25rem;
  border-top: 1px solid color-mix(in oklab, var(--ui-text-muted) 60%, transparent);
}

/* Flying backwards mirrors the plane; mirror the banner back so it reads. */
.backward .banner span {
  display: inline-block;
  scale: -1 1;
}

@keyframes flap {
  from {
    transform: skewY(-2deg);
  }
  to {
    transform: skewY(2deg) scaleY(0.94);
  }
}

/* Flying cars: a bright head and a light trail behind it. */
.traffic {
  position: absolute;
  inset: 0;
}

.car {
  height: 2px;
  border-radius: 9999px;
}

.car.far {
  width: 1.6rem;
  height: 1.5px;
  opacity: 0.75;
}

.car.near {
  width: 3.5rem;
  height: 2.5px;
}

.car.forward {
  background: linear-gradient(to right, transparent, var(--ui-color-warning-100));
  box-shadow: 10px 0 10px -2px var(--ui-color-warning-200);
}

.car.backward {
  background: linear-gradient(to right, transparent, var(--ui-color-error-400));
  box-shadow: 10px 0 10px -2px var(--ui-color-error-500);
}

/* The S☉Lucky tower, standing in front of the far city. */
.landmark {
  position: absolute;
  bottom: var(--floor);
  left: 13%;
  width: 2.25rem;
  height: 60%;
}

.tower {
  position: absolute;
  inset: 8% 0 0;
  clip-path: polygon(20% 0, 80% 0, 80% 6%, 100% 6%, 100% 100%, 0 100%, 0 6%, 20% 6%);
  background: linear-gradient(to bottom, var(--ui-color-neutral-800), var(--ui-bg));
}

.spire {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 9%;
  translate: -50% 0;
  background: var(--ui-color-neutral-700);
}

.spire::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 50%;
  width: 5px;
  height: 5px;
  translate: -50% 0;
  border-radius: 9999px;
  background: var(--ui-color-error-400);
  box-shadow: 0 0 8px 2px var(--ui-color-error-500);
  animation: blink 2.2s steps(1) infinite;
}

.sign {
  position: absolute;
  top: 12%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  translate: -50% 0;
  padding: 0.35rem 0.2rem;
  border: 1px solid color-mix(in oklab, var(--ui-primary) 70%, transparent);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--ui-color-primary-300);
  text-shadow:
    0 0 6px var(--ui-primary),
    0 0 14px var(--ui-primary);
  box-shadow: 0 0 14px -2px var(--ui-primary);
  animation: buzz 9s linear infinite;
}

/* A neon tube losing contact now and then. */
@keyframes buzz {
  0%,
  100% {
    opacity: 1;
  }
  71% {
    opacity: 1;
  }
  72% {
    opacity: 0.25;
  }
  73% {
    opacity: 1;
  }
  75% {
    opacity: 0.4;
  }
  77% {
    opacity: 1;
  }
}

@media (max-width: 639px) {
  .landmark {
    left: 6%;
    width: 1.6rem;
    height: 62%;
  }
  .sign {
    font-size: 0.6rem;
  }
}

/* Sized so the whole disc fits the band above the floor at every width. */
.sun-wrap {
  position: absolute;
  bottom: calc(var(--floor) + 0.5rem);
  left: 50%;
  width: min(9.5rem, 44vw);
  translate: -50% 0;
}

@media (min-width: 640px) {
  .sun-wrap {
    width: 13rem;
  }
}

@media (min-width: 1024px) {
  .sun-wrap {
    left: 64%;
    width: 15rem;
  }
}

.sun-glow {
  position: absolute;
  inset: -25%;
  border-radius: 9999px;
  background: radial-gradient(circle, color-mix(in oklab, var(--ui-primary) 50%, transparent), transparent 62%);
  animation: glow 3.2s ease-in-out infinite;
}

@keyframes glow {
  50% {
    opacity: 0.55;
  }
}

/* The sun's cut-outs slide down, like a sunset on an old monitor. */
.stripe {
  transform-box: fill-box;
  transform-origin: center;
  animation: stripes 2.8s linear infinite;
}

@keyframes stripes {
  to {
    transform: translateY(14px) scaleY(var(--grow, 1));
  }
}

.city-far,
.city-near {
  position: absolute;
}

.city-far {
  inset-inline: -3%;
  bottom: var(--floor);
  height: 56%;
}

.city-near {
  inset-inline: -4%;
  bottom: calc(var(--floor) - 1px);
  height: 36%;
}

.layer {
  width: 100%;
  height: 100%;
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: auto 100%;
}

.city-far .layer {
  background-image: url('/images/city/far.svg');
  opacity: 0.9;
}

.city-near .layer {
  background-image: url('/images/city/near.svg');
  background-position: 37% bottom;
}

/* Saucers: a hull with a ring of lights running round it, and a glowing dome. */
.saucer .engine {
  fill: var(--ui-secondary);
  opacity: 0.55;
}

.saucer .dome {
  stroke: color-mix(in oklab, var(--ui-secondary) 60%, transparent);
  stroke-width: 0.6;
}

.rim-light {
  fill: var(--ui-color-warning-200);
  animation: rim 1.2s steps(1) infinite;
}

@keyframes rim {
  0% {
    fill: var(--ui-color-warning-200);
  }
  33% {
    fill: var(--ui-color-primary-300);
  }
  66% {
    fill: var(--ui-color-secondary-300);
  }
}

.ufo-dart {
  position: absolute;
  left: 0;
  top: 0;
  filter: drop-shadow(0 0 6px color-mix(in oklab, var(--ui-secondary) 60%, transparent));
  animation: dart 31s ease-in-out infinite;
  animation-delay: -6s;
}

/* Darts in, stops dead, jumps, stops again, and is gone. */
@keyframes dart {
  0%,
  100% {
    transform: translate(-10cqw, 30cqh);
  }
  8% {
    transform: translate(18cqw, 14cqh);
  }
  14% {
    transform: translate(19cqw, 15cqh);
  }
  16% {
    transform: translate(44cqw, 8cqh);
  }
  24% {
    transform: translate(45cqw, 9cqh);
  }
  26% {
    transform: translate(70cqw, 20cqh);
  }
  30% {
    transform: translate(71cqw, 19cqh);
  }
  34% {
    transform: translate(112cqw, 2cqh);
  }
  99.9% {
    transform: translate(112cqw, 2cqh);
  }
}

.ufo-visit {
  position: absolute;
  left: 0;
  top: 0;
  filter: drop-shadow(0 0 10px color-mix(in oklab, var(--ui-secondary) 55%, transparent));
  animation: visit 38s ease-in-out infinite;
  animation-delay: -4s;
}

.ufo-visit .saucer {
  position: relative;
  animation: wobble 1.6s ease-in-out infinite alternate;
}

@keyframes wobble {
  from {
    transform: rotate(-5deg) translateY(-2px);
  }
  to {
    transform: rotate(5deg) translateY(2px);
  }
}

/* Swoops in, hovers over the rooftops with its beam on, hops, and shoots off. */
@keyframes visit {
  0%,
  100% {
    transform: translate(115cqw, 4cqh);
  }
  10% {
    transform: translate(74cqw, 30cqh);
  }
  12%,
  34% {
    transform: translate(72cqw, 33cqh);
  }
  38% {
    transform: translate(34cqw, 28cqh);
  }
  40%,
  52% {
    transform: translate(33cqw, 31cqh);
  }
  58% {
    transform: translate(-20cqw, -25cqh);
  }
  99.9% {
    transform: translate(-20cqw, -25cqh);
  }
}

.beam {
  position: absolute;
  top: 55%;
  left: 50%;
  width: 7rem;
  height: 46cqh;
  translate: -50% 0;
  clip-path: polygon(40% 0, 60% 0, 100% 100%, 0 100%);
  background: linear-gradient(to bottom, color-mix(in oklab, var(--ui-secondary) 55%, transparent), transparent 92%);
  opacity: 0;
  animation: beam 38s ease-in-out infinite;
  animation-delay: -4s;
}

/* On while it hovers over each spot, off while it moves. */
@keyframes beam {
  0%,
  13%,
  33%,
  41%,
  51%,
  100% {
    opacity: 0;
  }
  15%,
  31%,
  43%,
  49% {
    opacity: 0.8;
  }
}

.horizon {
  position: absolute;
  inset-inline: 0;
  bottom: var(--floor);
  height: 1px;
  background: var(--ui-primary);
  box-shadow: 0 0 18px 3px var(--ui-primary);
}

/* A neon grid floor, running towards the viewer and into the footer. */
.floor {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: var(--floor);
  perspective: 16rem;
  perspective-origin: 50% 0%;
  overflow: hidden;
  background: linear-gradient(to bottom, color-mix(in oklab, var(--ui-primary) 18%, var(--ui-bg)), var(--ui-bg));
}

.floor > div:first-child {
  position: absolute;
  inset: 0 -60% -200%;
  transform-origin: top center;
  transform: rotateX(64deg);
}

.floor > div:first-child > div {
  --size: 56px;
  position: absolute;
  inset: calc(-1 * var(--size)) 0 0;
  background-image:
    linear-gradient(color-mix(in oklab, var(--ui-primary) 70%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--ui-primary) 55%, transparent) 1px, transparent 1px);
  background-size: var(--size) var(--size);
  animation: run 2.4s linear infinite;
}

/* The sun's reflection on the wet floor. */
.reflection {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(9.5rem, 44vw);
  height: 100%;
  translate: -50% 0;
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, var(--ui-color-primary-300) 45%, transparent),
    transparent
  );
  mask-image: repeating-linear-gradient(to bottom, #000 0 3px, transparent 3px 7px);
  filter: blur(1px);
}

@media (min-width: 640px) {
  .reflection {
    width: 13rem;
  }
}

@media (min-width: 1024px) {
  .reflection {
    left: 64%;
    width: 15rem;
  }
}

@keyframes run {
  to {
    transform: translateY(var(--size));
  }
}
</style>
