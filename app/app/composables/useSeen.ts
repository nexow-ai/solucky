/**
 * Turns true once `target` comes within `margin` of the viewport, and stays
 * true: for parts of the landing that load a game's data only when the
 * visitor scrolls near them. Always false on the server.
 */
export function useSeen(target: Readonly<Ref<HTMLElement | null | undefined>>, margin = '400px') {
  const seen = ref(false);
  let observer: IntersectionObserver | undefined;

  onMounted(() => {
    const el = target.value;
    if (!el || !('IntersectionObserver' in window)) {
      seen.value = true;
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        seen.value = true;
        observer?.disconnect();
      },
      { rootMargin: `${margin} 0px` },
    );
    observer.observe(el);
  });

  onBeforeUnmount(() => observer?.disconnect());
  return readonly(seen);
}
