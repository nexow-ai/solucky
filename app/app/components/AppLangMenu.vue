<script setup lang="ts">
import { LOCALES } from '~~/i18n/languages';

/** The globe in the header: every language in its own name, each a link to this page in it. */
const { t, locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const open = ref(false);
const current = computed(() => LOCALES.find((l) => l.code === locale.value) ?? LOCALES[0]);

function choose(code: string) {
  rememberLanguage(code);
  open.value = false;
}
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'end', sideOffset: 8 }" :ui="{ content: 'w-[min(100vw-2rem,24rem)] p-2' }">
    <UButton
      icon="i-lucide-globe"
      color="neutral"
      variant="ghost"
      :aria-label="t('lang.choose', { name: current.name })"
      class="font-mono text-xs tracking-wider uppercase"
    >
      <span aria-hidden="true" class="hidden lg:inline">{{ current.code }}</span>
    </UButton>

    <template #content>
      <p class="kicker px-2.5 pt-1 pb-2">{{ t('lang.label') }}</p>
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
    </template>
  </UPopover>
</template>
