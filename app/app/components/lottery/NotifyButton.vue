<script setup lang="ts">
import { GAME_SLUGS } from '@solucky/client';

/**
 * Draw notifications for the page's game, on or off. The browser subscribes
 * once with the site's VAPID key; our server keeps that subscription with the
 * games it follows and the page's language (server/api/push), and the crank's
 * draws reach it through the service worker (public/sw.js). Hidden where the
 * browser has no Web Push (iOS outside an installed app) or none is set up.
 */
const { t, locale } = useI18n();
const toast = useToast();
const game = useGame();
const { vapidKey } = useRuntimeConfig().public;
const supported =
  !import.meta.dev && !!vapidKey && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const games = ref<number[]>([]);
const busy = ref(false);
const on = computed(() => games.value.includes(game.value));
const gameName = computed(() => t(`games.${GAME_SLUGS[game.value]}.name`));

async function subscription(create: boolean) {
  const { pushManager } = await navigator.serviceWorker.ready;
  const current = await pushManager.getSubscription();
  if (current || !create) return current;
  const key = Uint8Array.from(atob(vapidKey.replaceAll('-', '+').replaceAll('_', '/')), (c) => c.charCodeAt(0));
  return pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
}

onMounted(async () => {
  if (!supported) return;
  const current = await subscription(false);
  if (current) games.value = (await $fetch('/api/push', { query: { endpoint: current.endpoint } })).games;
});

async function toggle() {
  busy.value = true;
  try {
    const wanted = on.value ? games.value.filter((g) => g !== game.value) : [...games.value, game.value];
    // The first one asks for the browser's permission.
    const current = await subscription(wanted.length > 0);
    if (!current) return;
    const saved = await $fetch('/api/push', {
      method: 'PUT',
      body: { subscription: current.toJSON(), games: wanted, locale: locale.value },
    });
    games.value = saved.games;
    if (!wanted.length) await current.unsubscribe();
    toast.add(
      on.value
        ? {
            title: t('push.enabled'),
            description: t('push.enabledHint', { game: gameName.value }),
            icon: 'i-lucide-bell-ring',
          }
        : { title: t('push.disabled'), icon: 'i-lucide-bell-off' },
    );
  } catch {
    const blocked = Notification.permission === 'denied';
    toast.add({ title: blocked ? t('push.blocked') : t('push.failed'), color: 'error', icon: 'i-lucide-bell-off' });
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <UTooltip v-if="supported" :text="on ? t('push.off') : t('push.on')">
    <UButton
      :icon="on ? 'i-lucide-bell-ring' : 'i-lucide-bell'"
      :aria-label="on ? t('push.off') : t('push.on')"
      :aria-pressed="on"
      :color="on ? 'primary' : 'neutral'"
      variant="ghost"
      size="lg"
      :loading="busy"
      @click="toggle"
    />
  </UTooltip>
</template>
