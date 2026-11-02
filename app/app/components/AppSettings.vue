<script setup lang="ts">
import { LOCALES } from '~~/i18n/languages';

/**
 * The settings in the header: one round button, its dot the network's color,
 * opening the network, the light or dark theme, sound effects and the
 * language. The languages are a second view of the same popover, each a link
 * to this page in it, so no menu ever opens over another.
 */
const { t, locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const colorMode = useColorMode();
const sound = useSound();
const { isMainnet } = useSolana();

const open = ref(false);
const view = ref<'settings' | 'languages'>('settings');
const language = computed(() => LOCALES.find((l) => l.code === locale.value) ?? LOCALES[0]);
const themes = computed(() => [
  { value: 'light', label: t('settings.light'), icon: 'i-lucide-sun' },
  { value: 'dark', label: t('settings.dark'), icon: 'i-lucide-moon' },
]);

const ids = { theme: useId(), sound: useId() };
const languagesButton = useTemplateRef('languagesButton');
const backButton = useTemplateRef('backButton');

// Each opening starts on the settings, not on the languages left open last time.
watch(open, (value) => {
  if (value) view.value = 'settings';
});

/** Switches views and moves the focus along, so the keyboard is not left on a button that is gone. */
async function show(next: typeof view.value) {
  view.value = next;
  await nextTick();
  (next === 'languages' ? backButton : languagesButton).value?.focus();
}

function choose(code: string) {
  rememberLanguage(code);
  open.value = false;
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ align: 'end', sideOffset: 8 }"
    :ui="{ content: 'w-[min(100vw-2rem,22rem)] p-2' }"
  >
    <UButton
      icon="i-lucide-settings-2"
      color="neutral"
      variant="outline"
      square
      :aria-label="t('settings.label')"
      class="relative rounded-full aria-expanded:shadow-(--neu-in-sm)"
    >
      <span class="network-dot" :class="isMainnet ? 'bg-success' : 'bg-warning'" aria-hidden="true" />
    </UButton>

    <template #content>
      <div v-if="view === 'settings'">
        <p class="kicker px-2.5 pt-1 pb-2">{{ t('network.label') }}</p>
        <AppNetwork />

        <div class="mt-2 grid grid-cols-1 gap-0.5">
          <!-- A long translation sends the two sides to a line of their own. -->
          <div class="row flex-wrap">
            <UIcon name="i-lucide-sun-moon" class="icon" />
            <span :id="ids.theme" class="flex-1">{{ t('settings.theme') }}</span>
            <div
              role="group"
              :aria-labelledby="ids.theme"
              class="ms-auto flex gap-1 rounded-full p-1 shadow-(--neu-in-sm)"
            >
              <button
                v-for="theme in themes"
                :key="theme.value"
                type="button"
                class="segment"
                :aria-pressed="colorMode.value === theme.value"
                @click="colorMode.preference = theme.value"
              >
                <UIcon :name="theme.icon" class="size-3.5" />
                {{ theme.label }}
              </button>
            </div>
          </div>

          <div class="row">
            <UIcon :name="sound.enabled.value ? 'i-lucide-volume-2' : 'i-lucide-volume-x'" class="icon" />
            <label :for="ids.sound" class="flex-1">{{ t('settings.sound') }}</label>
            <USwitch :id="ids.sound" :model-value="sound.enabled.value" @update:model-value="sound.toggle()" />
          </div>

          <button ref="languagesButton" type="button" class="row link" @click="show('languages')">
            <UIcon name="i-lucide-globe" class="icon" />
            <span class="flex-1 text-start">{{ t('lang.label') }}</span>
            <span :lang="language.language" class="text-muted">{{ language.name }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-4 text-dimmed rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center gap-1 pb-1">
          <button
            ref="backButton"
            type="button"
            class="back"
            :aria-label="t('settings.back')"
            @click="show('settings')"
          >
            <UIcon name="i-lucide-chevron-left" class="size-4 rtl:-scale-x-100" />
          </button>
          <p class="kicker">{{ t('lang.label') }}</p>
        </div>
        <ul class="grid grid-cols-2 gap-0.5">
          <li v-for="l in LOCALES" :key="l.code">
            <NuxtLink
              :to="switchLocalePath(l.code)"
              :hreflang="l.language"
              :lang="l.language"
              :aria-current="l.code === locale ? 'true' : undefined"
              class="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-toned transition-colors hover:bg-elevated hover:text-highlighted aria-[current]:text-primary"
              @click="choose(l.code)"
            >
              <span>{{ l.name }}</span>
              <UIcon v-if="l.code === locale" name="i-lucide-check" class="size-4 shrink-0" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>
/* The network at a glance, on the button's edge: cut out of it by a rim of the page. */
.network-dot {
  position: absolute;
  inset-inline-end: 0.15rem;
  top: 0.15rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  box-shadow: 0 0 0 2px var(--ui-bg);
}

.row {
  display: flex;
  width: 100%;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.6rem;
  border-radius: var(--ui-radius);
  padding: 0.375rem 0.625rem;
  font-size: var(--text-sm);
  color: var(--ui-text-toned);
}

.row.link {
  outline: none;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.row.link:hover,
.row.link:focus-visible {
  background: var(--ui-bg-elevated);
  color: var(--ui-text-highlighted);
}

.row.link:focus-visible {
  box-shadow: 0 0 0 2px var(--ui-primary);
}

.icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: var(--ui-text-muted);
}

/* The theme's two sides: the one in use stands out of the track, the other lies in it. */
.segment {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 9999px;
  padding: 0.25rem 0.65rem;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--ui-text-muted);
  outline: none;
  transition:
    color 0.2s,
    box-shadow 0.2s;
}

@media (hover: hover) {
  .segment:hover {
    color: var(--ui-text-highlighted);
  }
}

.segment[aria-pressed='true'] {
  color: var(--ui-text-highlighted);
  box-shadow: var(--neu-xs);
}

.segment:focus-visible {
  box-shadow: 0 0 0 2px var(--ui-primary);
}

.back {
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 9999px;
  color: var(--ui-text-muted);
  outline: none;
  transition:
    color 0.2s,
    box-shadow 0.2s;
}

.back:hover {
  color: var(--ui-text-highlighted);
  box-shadow: var(--neu-xs);
}

.back:focus-visible {
  box-shadow: 0 0 0 2px var(--ui-primary);
}
</style>
