/**
 * Soft UI for Nuxt UI's components (main.css has the surfaces): buttons and
 * cards stand out of the page, fields and tracks are pressed into it, and a
 * pressed button sinks. Rings give way to shadows; focus rings stay.
 */
const COLORS = ['primary', 'secondary', 'success', 'info', 'warning', 'error'] as const;

// A raised control that sinks when pressed, and goes flat when disabled.
const raised =
  'ring-0 bg-default shadow-(--neu-sm) hover:bg-default active:bg-default active:shadow-(--neu-in-sm) disabled:bg-default aria-disabled:bg-default disabled:shadow-none aria-disabled:shadow-none';
// A field pressed into the page.
const sunken = 'bg-default ring-0 shadow-(--neu-in-sm) hover:bg-default disabled:bg-default';
// What floats over the page: menus, popovers, toasts, dialogs.
const floating = 'bg-default ring-0 shadow-(--neu-lg) rounded-2xl';

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'violet',
      // Readouts and live signals.
      secondary: 'cyan',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'rounded-xl transition-[box-shadow,background-color,color,opacity] duration-200',
      },
      compoundVariants: [
        {
          color: 'neutral',
          variant: ['outline', 'soft', 'subtle'],
          class: `${raised} text-default hover:text-highlighted`,
        },
        { color: [...COLORS], variant: ['outline', 'soft', 'subtle'], class: raised },
        {
          color: [...COLORS],
          variant: 'solid',
          class: 'shadow-(--neu-sm) active:shadow-(--neu-in-sm) disabled:shadow-none aria-disabled:shadow-none',
        },
      ],
    },
    card: {
      slots: { root: 'rounded-3xl' },
      variants: {
        variant: {
          outline: { root: 'bg-default ring-0 shadow-(--neu) divide-y divide-default' },
        },
      },
    },
    input: { slots: { base: 'rounded-xl' }, variants: { variant: { outline: sunken } } },
    inputNumber: { slots: { base: 'rounded-xl' }, variants: { variant: { outline: sunken } } },
    select: {
      slots: { base: 'rounded-xl', content: floating },
      variants: { variant: { outline: sunken } },
    },
    selectMenu: {
      slots: { base: 'rounded-xl', content: floating },
      variants: { variant: { outline: sunken } },
    },
    tabs: {
      variants: {
        variant: {
          pill: {
            list: 'bg-default rounded-2xl shadow-(--neu-in-sm) p-1.5',
            trigger: 'rounded-xl',
            indicator: 'rounded-xl shadow-(--neu-sm)',
          },
        },
      },
      compoundVariants: [
        {
          color: 'neutral',
          variant: 'pill',
          class: { indicator: 'bg-default', trigger: 'data-[state=active]:text-highlighted' },
        },
      ],
    },
    accordion: {
      slots: { item: 'border-default/60' },
    },
    // A switch's track is pressed into the page; its thumb stands out of it.
    switch: {
      slots: { base: 'shadow-(--neu-in-sm) data-[state=unchecked]:bg-default', thumb: 'shadow-(--neu-xs)' },
    },
    badge: { slots: { base: 'rounded-full' } },
    alert: { slots: { root: 'rounded-2xl' } },
    popover: { slots: { content: floating } },
    dropdownMenu: { slots: { content: floating } },
    tooltip: { slots: { content: 'bg-default ring-0 shadow-(--neu-sm) rounded-lg' } },
    toast: { slots: { root: floating } },
    modal: {
      slots: { overlay: 'backdrop-blur-sm' },
      variants: { fullscreen: { false: { content: floating } } },
    },
    slideover: { slots: { content: 'sm:ring-0 sm:shadow-(--neu-lg)' } },
    // An empty state is a well pressed into the page; its icon stands out of it.
    empty: {
      slots: { root: 'rounded-3xl', avatar: 'bg-default shadow-(--neu-xs)' },
      variants: { variant: { outline: { root: 'ring-0 shadow-(--neu-in-sm)' } } },
    },
    header: {
      slots: { root: 'bg-default/80 backdrop-blur-xl border-b-0' },
    },
    pageSection: {
      slots: { container: 'py-16 sm:py-20 lg:py-24', title: 'tracking-tight' },
    },
  },
});
