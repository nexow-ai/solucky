import type { InstallPrompt } from '~/composables/useInstallPrompt';

/**
 * The installable app: public/manifest.webmanifest and the service worker
 * (public/sw.js), which the browser replaces after each deploy on its own.
 * A page left open hears of a new deploy from Nuxt's build check
 * (`checkOutdatedBuildInterval` in nuxt.config.ts): Nuxt then loads the new
 * version on the next page change, and this toast offers it right away.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) {
    // Dev files keep their names while their code changes: drop any worker a production run left here.
    void navigator.serviceWorker?.getRegistrations().then((all) => all.forEach((sw) => sw.unregister()));
    return;
  }

  onNuxtReady(() => navigator.serviceWorker?.register('/sw.js').catch(() => {}));

  // Chromium offers installing through this event; the header's install button
  // (components/AppInstall.vue) shows it instead of the browser's own banner.
  const install = useInstallPrompt();
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    install.value = markRaw(event as InstallPrompt);
  });
  window.addEventListener('appinstalled', () => (install.value = null));

  const toast = useToast();
  nuxtApp.hook('app:manifest:update', () => {
    const { t } = nuxtApp.$i18n;
    toast.add({
      title: t('update.title'),
      description: t('update.hint'),
      icon: 'i-lucide-refresh-cw',
      duration: 0,
      actions: [{ label: t('update.reload'), onClick: () => reloadNuxtApp({ force: true }) }],
    });
  });
});
