<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

/** Layout of the legal pages: the documents on the left, the page's sections on the right. */
const props = defineProps<{
  /** Which document this is, from LEGAL_PAGES: its title and summary come from the dictionaries. */
  page: (typeof LEGAL_PAGES)[number]['key'];
  /** The page's sections, for the index on the right: each one is an `<h2>` with this id. */
  sections?: { id: string; label: string }[];
}>();

const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const intl = useIntlLocale();

const title = computed(() => t(`legal.pages.${props.page}.label`));
const description = computed(() => t(`legal.${props.page}.description`));

useSeoMeta({
  title: () => `${title.value} · S☉Lucky`,
  ogTitle: () => `${title.value} · S☉Lucky`,
  description: () => description.value,
});

const documents = computed<NavigationMenuItem[]>(() =>
  LEGAL_PAGES.map((page) => ({
    label: t(`legal.pages.${page.key}.label`),
    to: localePath(page.to),
    icon: page.icon,
    active: page.key === props.page,
  })),
);
const others = computed(() => LEGAL_PAGES.filter((page) => page.key !== props.page));
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <p class="kicker mb-3">{{ t('legal.kicker') }}</p>
          <UNavigationMenu :items="documents" orientation="vertical" class="-mx-2.5" />
        </UPageAside>
      </template>

      <UPageHeader :title="title" :description="description">
        <template #headline>
          <LandingSectionTag index="§" :label="t('legal.kicker')" />
        </template>
      </UPageHeader>
      <p class="mt-4 font-mono text-xs text-dimmed">{{ t('legal.updated', { date: formatDate(LEGAL_UPDATED, intl) }) }}</p>
      <!-- The English text is the one that applies; translations say so and link to it. -->
      <p v-if="locale !== 'en'" class="mt-2 text-sm text-muted">
        {{ t('legal.translated') }}
        <ULink :to="switchLocalePath('en')" hreflang="en" class="text-primary hover:underline">{{
          t('legal.readEnglish')
        }}</ULink>
      </p>

      <UPageBody>
        <div class="prose-legal">
          <slot />
        </div>

        <nav :aria-label="t('legal.others')" class="grid gap-4 border-t border-default pt-10 sm:grid-cols-2">
          <UPageCard
            v-for="other in others"
            :key="other.to"
            :to="localePath(other.to)"
            :title="t(`legal.pages.${other.key}.label`)"
            :description="t(`legal.pages.${other.key}.description`)"
            :icon="other.icon"
            variant="subtle"
            spotlight
          />
        </nav>
      </UPageBody>

      <template v-if="sections?.length" #right>
        <UPageAside>
          <p class="kicker mb-3">{{ t('legal.onThisPage') }}</p>
          <ol class="space-y-2 border-s border-default text-sm">
            <li v-for="section in sections" :key="section.id">
              <a
                :href="`#${section.id}`"
                class="-ms-px block border-s border-transparent ps-3 text-muted transition-colors hover:border-primary hover:text-highlighted"
              >
                {{ section.label }}
              </a>
            </li>
          </ol>
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
