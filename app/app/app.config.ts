export default defineAppConfig({
  ui: {
    colors: {
      primary: 'fuchsia',
      secondary: 'cyan',
      neutral: 'mauve',
    },
    // Panels float over the backdrop's grid with a faint neon edge.
    card: {
      variants: {
        variant: {
          outline: { root: 'bg-default/85 ring-primary/20 shadow-[0_0_48px_-28px_var(--ui-primary)]' },
        },
      },
    },
    pageHero: {
      slots: { title: 'font-display leading-[1.08]' },
    },
    pageSection: {
      slots: { title: 'font-display', headline: 'flex justify-center' },
    },
    pageCTA: {
      slots: { title: 'font-display' },
    },
  },
});
