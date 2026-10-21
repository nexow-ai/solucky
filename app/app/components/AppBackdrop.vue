<template>
  <!-- Fixed behind every page: two drifting glows, a field of dots and film grain. -->
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div
      class="absolute -top-[30rem] -left-[20rem] size-[60rem] animate-drift rounded-full bg-[radial-gradient(circle,var(--ui-primary),transparent_68%)] opacity-15 will-change-transform"
    />
    <div
      class="absolute -right-[20rem] -bottom-[30rem] size-[56rem] animate-drift rounded-full bg-[radial-gradient(circle,var(--ui-color-primary-800),transparent_68%)] opacity-25 [animation-delay:-12s] will-change-transform"
    />
    <div class="bg-dots absolute inset-0 mask-[radial-gradient(ellipse_at_top,black,transparent_80%)]" />
    <div class="bg-noise absolute inset-0 opacity-[0.04]" />
  </div>
</template>
