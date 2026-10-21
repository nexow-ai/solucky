<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

/** Layout of the legal pages: the documents on the left, the page's sections on the right. */
const props = defineProps<{
  title: string;
  description: string;
  /** The page's sections, for the index on the right: each one is an `<h2>` with this id. */
  sections?: { id: string; label: string }[];
}>();

useSeoMeta({
  title: `${props.title} · S☉Lucky`,
  ogTitle: `${props.title} · S☉Lucky`,
  description: props.description,
});

const route = useRoute();
const documents = computed<NavigationMenuItem[]>(() =>
  LEGAL_PAGES.map((page) => ({ label: page.label, to: page.to, icon: page.icon, active: route.path === page.to })),
);
const others = computed(() => LEGAL_PAGES.filter((page) => page.to !== route.path));
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <p class="kicker mb-3">Legal</p>
          <UNavigationMenu :items="documents" orientation="vertical" class="-mx-2.5" />
        </UPageAside>
      </template>

      <UPageHeader :title="title" :description="description">
        <template #headline>
          <LandingSectionTag index="§" label="Legal" />
        </template>
      </UPageHeader>
      <p class="mt-4 font-mono text-xs text-dimmed">Last updated {{ LEGAL_UPDATED }}</p>

      <UPageBody>
        <div class="prose-legal">
          <slot />
        </div>

        <nav aria-label="Other legal documents" class="grid gap-4 border-t border-default pt-10 sm:grid-cols-2">
          <UPageCard
            v-for="page in others"
            :key="page.to"
            :to="page.to"
            :title="page.label"
            :description="page.description"
            :icon="page.icon"
            variant="subtle"
            spotlight
          />
        </nav>
      </UPageBody>

      <template v-if="sections?.length" #right>
        <UPageAside>
          <p class="kicker mb-3">On this page</p>
          <ol class="space-y-2 border-l border-default text-sm">
            <li v-for="section in sections" :key="section.id">
              <a
                :href="`#${section.id}`"
                class="-ml-px block border-l border-transparent ps-3 text-muted transition-colors hover:border-primary hover:text-highlighted"
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
