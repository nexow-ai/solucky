<script setup lang="ts">
/**
 * Coins and sparks flying out of the buy button when a ticket lands.
 * Call `fire()` through a template ref. Nothing happens with reduced motion.
 */
interface Particle {
  id: number;
  coin: boolean;
  style: Record<string, string>;
}

const particles = ref<Particle[]>([]);
let next = 0;

function fire(count = 26) {
  if (!import.meta.client || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const batch: Particle[] = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 70 + Math.random() * 120;
    const coin = i % 3 === 0;
    return {
      id: next++,
      coin,
      style: {
        '--x': `${Math.cos(angle) * distance}px`,
        '--y': `${Math.sin(angle) * distance - 40}px`,
        '--r': `${Math.random() * 540 - 270}deg`,
        '--s': `${0.7 + Math.random() * 0.8}`,
        '--delay': `${Math.random() * 90}ms`,
      },
    };
  });
  particles.value = [...particles.value, ...batch];
  const ids = new Set(batch.map((p) => p.id));
  setTimeout(() => (particles.value = particles.value.filter((p) => !ids.has(p.id))), 1500);
}

defineExpose({ fire });
</script>

<template>
  <div class="burst" aria-hidden="true">
    <span v-for="p in particles" :key="p.id" class="particle" :class="p.coin ? 'coin' : 'spark'" :style="p.style">{{
      p.coin ? '◎' : ''
    }}</span>
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

.particle {
  grid-area: 1 / 1;
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
</style>
