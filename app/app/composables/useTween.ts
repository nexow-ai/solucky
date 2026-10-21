/**
 * A number that eases toward `source` whenever it changes, for counters that
 * count up instead of jumping. With reduced motion it jumps.
 */
export function useTween(source: () => number, duration = 1_200) {
  const value = ref(source());
  let frame = 0;

  watch(source, (to) => {
    cancelAnimationFrame(frame);
    if (!import.meta.client || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      value.value = to;
      return;
    }
    const from = value.value;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      value.value = from + (to - from) * (1 - (1 - t) ** 4);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  });

  onBeforeUnmount(() => cancelAnimationFrame(frame));
  return readonly(value);
}
