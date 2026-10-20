<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <UMain class="flex-1">
      <slot />
    </UMain>
    <AppFooter />
  </div>
</template>
