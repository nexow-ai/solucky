<script setup lang="ts">
/**
 * A panel of the play page in soft relief: the page itself, raised out of it
 * (or, `sunken`, pressed into it). The `hero` panel stands a little higher,
 * so the eye lands on it first.
 */
const props = withDefaults(
  defineProps<{
    as?: string;
    /** A higher panel, for the one the eye should land on. */
    hero?: boolean;
    /** Pressed into the page instead of raised out of it. */
    sunken?: boolean;
    /** Radius class; panels are rounded, bars are pills. */
    rounded?: string;
  }>(),
  { as: 'section', hero: false, sunken: false, rounded: 'rounded-[2rem]' },
);
</script>

<template>
  <component
    :is="props.as"
    class="relative bg-default"
    :class="[props.rounded, props.sunken ? 'shadow-(--neu-in)' : props.hero ? 'shadow-(--neu-lg)' : 'shadow-(--neu)']"
  >
    <slot />
  </component>
</template>
