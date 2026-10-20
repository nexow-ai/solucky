<template>
  <div class="flex min-h-dvh flex-col">
    <AppBackdrop />
    <AppHeader />
    <UMain class="flex-1">
      <slot />
    </UMain>
    <AppFooter />
  </div>
</template>
