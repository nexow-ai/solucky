<script setup lang="ts">
const { t } = useI18n();

/**
 * The skip link moves focus into the page without touching the address: the
 * router would take `#main` for a navigation. Before the app loads, the
 * plain link does the same.
 */
function skip(event: MouseEvent) {
  const main = document.getElementById('main');
  if (!main) return;
  event.preventDefault();
  main.focus();
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <!-- The keyboard's first stop on every page, shown only when focused. -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-default focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-highlighted focus:shadow-lg focus:ring-2 focus:ring-primary"
      @click="skip"
    >
      {{ t('nav.skip') }}
    </a>
    <AppBackdrop />
    <AppHeader />
    <UMain id="main" tabindex="-1" class="flex-1 outline-none">
      <slot />
    </UMain>
    <AppFooter />
  </div>
</template>
