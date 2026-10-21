<script setup lang="ts">
const config = useRuntimeConfig().public;
const { explorer, programAddress, clusterLabel } = useSolana();
const { t } = useI18n();
const localePath = useLocalePath();

const sections = computed(() =>
  legalSections(t, 'notice', ['operator', 'software', 'documents', 'security', 'license']),
);

const documents = LEGAL_PAGES.filter((page) => page.key !== 'notice');
</script>

<template>
  <LegalPage page="notice" :sections="sections">
    <h2 id="operator">{{ t('legal.notice.operator.title') }}</h2>
    <i18n-t keypath="legal.notice.operator.body" tag="p" scope="global">
      <template #operator>
        <strong>{{ OPERATOR.name }}</strong>
      </template>
      <template #email>
        <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a>
      </template>
      <template #site>
        <a :href="OPERATOR.site" target="_blank" rel="noopener">nexow.studio</a>
      </template>
    </i18n-t>

    <h2 id="software">{{ t('legal.notice.software.title') }}</h2>
    <p>{{ t('legal.notice.software.intro') }}</p>
    <ul>
      <i18n-t keypath="legal.notice.software.program" tag="li" scope="global">
        <template #name>
          <strong>{{ t('legal.notice.software.programName') }}</strong>
        </template>
        <template #address>
          <a :href="explorer('address', programAddress)" target="_blank" rel="noopener"
            ><code>{{ programAddress }}</code></a
          >
        </template>
        <template #cluster>{{ clusterLabel }}</template>
      </i18n-t>
      <i18n-t keypath="legal.notice.software.site" tag="li" scope="global">
        <template #name>
          <strong>{{ t('legal.notice.software.siteName') }}</strong>
        </template>
      </i18n-t>
    </ul>

    <h2 id="documents">{{ t('legal.notice.documents.title') }}</h2>
    <p>{{ t('legal.notice.documents.intro') }}</p>
    <ul>
      <li v-for="page in documents" :key="page.to">
        <NuxtLink :to="localePath(page.to)">{{ t(`legal.pages.${page.key}.label`) }}</NuxtLink
        >: {{ t(`legal.pages.${page.key}.description`) }}
      </li>
    </ul>

    <h2 id="security">{{ t('legal.notice.security.title') }}</h2>
    <i18n-t keypath="legal.notice.security.body" tag="p" scope="global">
      <template #email>
        <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a>
      </template>
      <template #subject>
        <code>Security report: solucky</code>
      </template>
      <template #file>
        <code>SECURITY.md</code>
      </template>
      <template #repository>
        <a :href="config.githubUrl" target="_blank" rel="noopener">{{ t('legal.repository') }}</a>
      </template>
    </i18n-t>

    <h2 id="license">{{ t('legal.notice.license.title') }}</h2>
    <i18n-t keypath="legal.notice.license.body" tag="p" scope="global">
      <template #file>
        <code>LICENSE</code>
      </template>
      <template #repository>
        <a :href="config.githubUrl" target="_blank" rel="noopener">{{ t('legal.repository') }}</a>
      </template>
      <template #years
        ><span dir="ltr">2022–{{ new Date().getFullYear() }}</span></template
      >
      <template #operator>{{ OPERATOR.name }}</template>
      <template #terms>
        <NuxtLink :to="localePath('/legal/terms')">{{ t('legal.pages.terms.label') }}</NuxtLink>
      </template>
    </i18n-t>
  </LegalPage>
</template>
