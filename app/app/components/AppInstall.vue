<script setup lang="ts">
/**
 * Installs the app: Chromium's own prompt where the browser offers one, and
 * how to do it by hand on iPhone and iPad, where only the Share menu can.
 * Hidden once the app runs installed.
 */
const { t } = useI18n();
const toast = useToast();
const prompt = useInstallPrompt();
const ios = ref(false);

onMounted(() => {
  const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  ios.value = apple && !matchMedia('(display-mode: standalone)').matches;
});

async function install() {
  if (!prompt.value) {
    toast.add({ title: t('install.label'), description: t('install.ios'), icon: 'i-lucide-share' });
    return;
  }
  // The browser shows its prompt only once per offer.
  const offer = prompt.value;
  prompt.value = null;
  await offer.prompt();
}
</script>

<template>
  <UTooltip v-if="prompt || ios" :text="t('install.label')">
    <UButton icon="i-lucide-download" color="neutral" variant="ghost" :aria-label="t('install.label')" @click="install" />
  </UTooltip>
</template>
