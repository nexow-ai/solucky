<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public;

useSeoMeta({
  ogImage: `${siteUrl.replace(/\/$/, '')}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'S☉Lucky, the daily lottery on Solana',
});
</script>

<template>
  <UApp :toaster="{ position: 'bottom-right' }">
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
