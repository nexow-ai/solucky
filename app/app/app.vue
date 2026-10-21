<script setup lang="ts">
import { ar, de, en, es, fr, he, hi, id, it, ja, ko, nl, pt_br, ru, th, tr, uk, vi, zh_cn, zh_tw } from '@nuxt/ui/locale';

import type { Locale } from '~~/i18n/languages';

/** Nuxt UI's own words (close, search, theme…) and direction, for each of the site's languages. */
const UI_LOCALES: Record<Locale, typeof en> = {
  en,
  es,
  fr,
  de,
  it,
  pt: pt_br,
  nl,
  tr,
  ru,
  uk,
  ar,
  he,
  hi,
  th,
  vi,
  id,
  'zh-cn': zh_cn,
  'zh-tw': zh_tw,
  ja,
  ko,
};

const { siteUrl } = useRuntimeConfig().public;
const { t, locale } = useI18n();
const ui = computed(() => UI_LOCALES[locale.value as Locale] ?? en);

// <html lang dir>, the page in every other language (hreflang) and og:locale.
const localeHead = useLocaleHead();
useHead(() => ({
  htmlAttrs: { lang: localeHead.value.htmlAttrs.lang, dir: localeHead.value.htmlAttrs.dir },
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}));

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogImage: `${siteUrl.replace(/\/$/, '')}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('meta.ogImageAlt'),
});
</script>

<template>
  <UApp :locale="ui" :toaster="{ position: ui.dir === 'rtl' ? 'bottom-left' : 'bottom-right' }">
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <LazyAppLangSuggest />
    </ClientOnly>
  </UApp>
</template>
