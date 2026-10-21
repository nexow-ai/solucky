export default defineAppConfig({
  ui: {
    colors: {
      primary: 'fuchsia',
      // Phosphor green, for the dial's readouts and the draw.
      secondary: 'lime',
      neutral: 'mauve',
    },
    // Panels sit over the backdrop with a faint glowing edge.
    card: {
      variants: {
        variant: {
          outline: { root: 'bg-default/85 ring-primary/20 shadow-[0_0_48px_-28px_var(--ui-primary)]' },
        },
      },
    },
    pageHero: {
      slots: { title: 'tracking-tighter leading-[0.95]' },
    },
    pageSection: {
      slots: { container: 'py-16 sm:py-20 lg:py-24', title: 'tracking-tighter', headline: 'flex justify-center' },
    },
    pageCTA: {
      slots: { title: 'tracking-tighter' },
    },
  },
});
