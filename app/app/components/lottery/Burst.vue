<script setup lang="ts">
/**
 * The celebration when a ticket lands: a shockwave off the buy button, coins
 * and sparks flying out, confetti arcing up and falling, and a ticket that
 * flies from the button into the pot panel's list (`[data-ticket-well]`) when
 * that list is on screen. Call `fire()` through a template ref. Nothing
 * happens with reduced motion.
 */
interface Particle {
  id: number;
  kind: 'coin' | 'spark' | 'confetti';
  style: Record<string, string>;
}

const CONFETTI = ['var(--ui-primary)', 'var(--ui-secondary)', 'var(--color-pink-500)', 'var(--ui-warning)'];

const root = useTemplateRef<HTMLElement>('root');
const particles = ref<Particle[]>([]);
const waves = ref<number[]>([]);
let next = 0;

function burst(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 70 + Math.random() * 120;
    return {
      id: next++,
      kind: i % 3 === 0 ? 'coin' : 'spark',
      style: {
        '--x': `${Math.cos(angle) * distance}px`,
        '--y': `${Math.sin(angle) * distance - 40}px`,
        '--r': `${Math.random() * 540 - 270}deg`,
        '--s': `${0.7 + Math.random() * 0.8}`,
        '--delay': `${Math.random() * 90}ms`,
      },
    };
  });
}

/** Confetti: thrown up and out, then falling under gravity while it flutters. */
function confetti(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    id: next++,
    kind: 'confetti' as const,
    style: {
      '--x': `${(Math.random() - 0.5) * 360}px`,
      '--up': `${-90 - Math.random() * 110}px`,
      '--down': `${120 + Math.random() * 160}px`,
      '--spin': `${(Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720)}deg`,
      '--w': `${5 + Math.random() * 5}px`,
      '--h': `${8 + Math.random() * 8}px`,
      '--c': CONFETTI[Math.floor(Math.random() * CONFETTI.length)]!,
      '--delay': `${Math.random() * 140}ms`,
      '--t': `${1.5 + Math.random() * 0.7}s`,
    },
  }));
}

/** Flies a ticket from the button into the list of tickets in play, then rings the list. */
function flyTicket() {
  const from = root.value?.getBoundingClientRect();
  const well = document.querySelector<HTMLElement>('[data-ticket-well]');
  const to = well?.getBoundingClientRect();
  if (!from || !well || !to || !to.width || to.bottom < 0 || to.top > window.innerHeight) return;

  const ticket = document.createElement('div');
  ticket.setAttribute('aria-hidden', 'true');
  ticket.textContent = '◎';
  Object.assign(ticket.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    zIndex: '100',
    width: '3.4rem',
    height: '2.1rem',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '0.4rem',
    font: '800 1rem var(--font-mono)',
    color: 'white',
    background: 'linear-gradient(120deg, var(--color-purple-500), var(--color-pink-600))',
    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.35), 0 0 26px -2px var(--ui-primary)',
    // Notches on both sides, like a torn-off ticket.
    mask: 'radial-gradient(circle at 0 50%, transparent 0.32rem, #000 0.34rem) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 0.32rem, #000 0.34rem) right / 51% 100% no-repeat',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  });
  document.body.append(ticket);

  const x0 = from.left + from.width / 2 - 27;
  const y0 = from.top + from.height / 2 - 17;
  const x1 = to.left + to.width / 2 - 27;
  const y1 = to.top + 12;
  const peak = Math.min(y0, y1) - 90;
  const animation = ticket.animate(
    [
      { transform: `translate(${x0}px, ${y0}px) scale(0.4) rotate(-12deg)`, opacity: 0 },
      { offset: 0.14, transform: `translate(${x0}px, ${y0 - 34}px) scale(1.2) rotate(-8deg)`, opacity: 1 },
      {
        offset: 0.55,
        transform: `translate(${(x0 + x1) / 2}px, ${peak}px) scale(1) rotate(10deg)`,
        opacity: 1,
      },
      { transform: `translate(${x1}px, ${y1}px) scale(0.55) rotate(0deg)`, opacity: 0.3 },
    ],
    { duration: 1_150, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
  );
  animation.finished
    .then(() =>
      well.animate(
        [
          {
            outline: '2px solid var(--ui-secondary)',
            outlineOffset: '0px',
            boxShadow: '0 0 40px -8px var(--ui-secondary)',
          },
          { outline: '2px solid transparent', outlineOffset: '10px', boxShadow: '0 0 0 0 transparent' },
        ],
        { duration: 800, easing: 'ease-out' },
      ),
    )
    .catch(() => {})
    .finally(() => ticket.remove());
}

function fire(count = 26) {
  if (!import.meta.client || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const batch = [...burst(count), ...confetti(Math.round(count * 1.2))];
  particles.value = [...particles.value, ...batch];
  const ids = new Set(batch.map((p) => p.id));
  setTimeout(() => (particles.value = particles.value.filter((p) => !ids.has(p.id))), 2_600);

  const wave = next++;
  waves.value = [...waves.value, wave];
  setTimeout(() => (waves.value = waves.value.filter((w) => w !== wave)), 900);

  flyTicket();
}

defineExpose({ fire });
</script>

<template>
  <div ref="root" class="burst" aria-hidden="true">
    <span v-for="w in waves" :key="w" class="wave" />
    <template v-for="p in particles" :key="p.id">
      <span v-if="p.kind === 'confetti'" class="confetti" :style="p.style"><i /></span>
      <span v-else class="particle" :class="p.kind" :style="p.style">{{ p.kind === 'coin' ? '◎' : '' }}</span>
    </template>
  </div>
</template>

<style scoped>
.burst {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  overflow: visible;
  z-index: 5;
}

.burst > * {
  grid-area: 1 / 1;
}

/* The shockwave: a ring of light thrown off the button. */
.wave {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  box-shadow:
    0 0 0 2px var(--ui-secondary),
    0 0 30px 4px color-mix(in oklab, var(--ui-secondary) 60%, transparent);
  animation: wave 0.85s var(--ease-out-expo) forwards;
}

@keyframes wave {
  from {
    opacity: 1;
    scale: 1;
  }
  to {
    opacity: 0;
    scale: 1.35 2.4;
  }
}

.particle {
  animation: fly 1.2s cubic-bezier(0.15, 0.7, 0.3, 1) var(--delay) both;
}

.coin {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--ui-secondary);
  text-shadow: 0 0 10px var(--ui-secondary);
}

.spark {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--ui-primary);
  box-shadow: 0 0 12px 2px var(--ui-primary);
}

@keyframes fly {
  0% {
    transform: translate(0, 0) scale(0.2) rotate(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), calc(var(--y) + 60px)) scale(var(--s)) rotate(var(--r));
    opacity: 0;
  }
}

/* Confetti: the outer piece drifts sideways at a steady pace, the inner one rises then falls, and flutters. */
.confetti {
  animation: drift-x var(--t) linear var(--delay) both;
}

.confetti > i {
  display: block;
  width: var(--w);
  height: var(--h);
  border-radius: 1px;
  background: var(--c);
  box-shadow: 0 0 6px color-mix(in oklab, var(--c) 60%, transparent);
  animation:
    arc var(--t) var(--delay) both,
    flutter var(--t) linear var(--delay) both;
}

@keyframes drift-x {
  to {
    translate: var(--x) 0;
  }
}

@keyframes arc {
  0% {
    transform: translateY(0);
    opacity: 1;
    animation-timing-function: cubic-bezier(0.2, 0.7, 0.4, 1);
  }
  32% {
    transform: translateY(var(--up));
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.5);
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translateY(var(--down));
    opacity: 0;
  }
}

@keyframes flutter {
  to {
    rotate: var(--spin);
    scale: 1 0.35;
  }
}
</style>
