import type { RouterConfig } from '@nuxt/schema';

// In-page links (#how-it-works, #faq) glide to their section instead of
// jumping, unless the visitor asked for less motion.
export default {
  scrollBehaviorType:
    import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
} satisfies RouterConfig;
