/**
 * Which in-page section is most in view. Used by the landing's section index on
 * the right; always undefined on the server.
 */
export function useSectionSpy(ids: readonly string[]) {
  const active = ref<string>();

  onMounted(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best: string | undefined;
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        active.value = bestRatio > 0 ? best : undefined;
      },
      {
        rootMargin: '-22% 0px -38% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    onBeforeUnmount(() => observer.disconnect());
  });

  return readonly(active);
}
