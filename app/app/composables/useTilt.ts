/**
 * Tells an element's CSS where the pointer is, so it can lean towards it or
 * shift its layers: `--tilt-x` and `--tilt-y` run from -1 to 1 (0 is the
 * middle), `--glare-x` and `--glare-y` from 0% to 100%. With `window`, the
 * position is measured across the whole viewport (for backgrounds that drift
 * with the pointer); otherwise across the element, and it eases back to the
 * middle when the pointer leaves. Mouse and pen only, one update per frame,
 * and nothing at all with reduced motion.
 */
export function useTilt(target: Readonly<Ref<HTMLElement | null | undefined>>, options: { window?: boolean } = {}) {
  let frame = 0;
  let stop = () => {};

  onMounted(() => {
    const el = target.value;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const set = (x: number, y: number) => {
      el.style.setProperty('--tilt-x', x.toFixed(3));
      el.style.setProperty('--tilt-y', y.toFixed(3));
      el.style.setProperty('--glare-x', `${((x + 1) * 50).toFixed(1)}%`);
      el.style.setProperty('--glare-y', `${((y + 1) * 50).toFixed(1)}%`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = options.window
          ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
          : el.getBoundingClientRect();
        const x = ((event.clientX - box.left) / box.width) * 2 - 1;
        const y = ((event.clientY - box.top) / box.height) * 2 - 1;
        set(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
        el.dataset.tilting = '';
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      set(0, 0);
      delete el.dataset.tilting;
    };

    const source: HTMLElement | Window = options.window ? window : el;
    source.addEventListener('pointermove', onMove as EventListener, { passive: true });
    if (!options.window) el.addEventListener('pointerleave', onLeave);
    stop = () => {
      cancelAnimationFrame(frame);
      source.removeEventListener('pointermove', onMove as EventListener);
      el.removeEventListener('pointerleave', onLeave);
    };
  });

  onBeforeUnmount(() => stop());
}
