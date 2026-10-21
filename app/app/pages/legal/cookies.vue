<script setup lang="ts">
const { t } = useI18n();

// The first section keeps its original anchor, #cookies.
const sections = computed(() =>
  legalSections(t, 'cookies', ['none', 'storage', 'clear', 'banner']).map((section) =>
    section.id === 'none' ? { ...section, id: 'cookies' } : section,
  ),
);

// Every key the app writes to local storage; what each holds is under legal.cookies.keys.
const keys = [
  { key: 'nuxt-color-mode', id: 'theme' },
  { key: 'solucky:wallet', id: 'wallet' },
  { key: 'solucky:country', id: 'country' },
  { key: 'solucky:sound', id: 'sound' },
  { key: 'solucky:lang', id: 'lang' },
] as const;
</script>

<template>
  <LegalPage page="cookies" :sections="sections">
    <h2 id="cookies">{{ t('legal.cookies.none.title') }}</h2>
    <p>{{ t('legal.cookies.none.p1') }}</p>
    <i18n-t keypath="legal.cookies.none.p2" tag="p" scope="global">
      <template #cookie>
        <code>__cf_bm</code>
      </template>
      <template #list>
        <a
          href="https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/"
          target="_blank"
          rel="noopener"
          >{{ t('legal.cookies.none.list') }}</a
        >
      </template>
    </i18n-t>

    <h2 id="storage">{{ t('legal.cookies.storage.title') }}</h2>
    <p>{{ t('legal.cookies.storage.intro') }}</p>
    <table>
      <thead>
        <tr>
          <th>{{ t('legal.cookies.storage.key') }}</th>
          <th>{{ t('legal.cookies.storage.holds') }}</th>
          <th>{{ t('legal.cookies.storage.saved') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in keys" :key="row.key">
          <td>
            <code>{{ row.key }}</code>
          </td>
          <td>{{ t(`legal.cookies.keys.${row.id}.holds`) }}</td>
          <td>{{ t(`legal.cookies.keys.${row.id}.when`) }}</td>
        </tr>
      </tbody>
    </table>
    <p>{{ t('legal.cookies.storage.wallet') }}</p>
    <p>{{ t('legal.cookies.storage.cache') }}</p>

    <h2 id="clear">{{ t('legal.cookies.clear.title') }}</h2>
    <ul>
      <i18n-t keypath="legal.cookies.clear.disconnect" tag="li" scope="global">
        <template #key>
          <code>solucky:wallet</code>
        </template>
      </i18n-t>
      <li>{{ t('legal.cookies.clear.site') }}</li>
      <li>{{ t('legal.cookies.clear.private') }}</li>
    </ul>
    <p>{{ t('legal.cookies.clear.reset') }}</p>

    <h2 id="banner">{{ t('legal.cookies.banner.title') }}</h2>
    <p>{{ t('legal.cookies.banner.body') }}</p>
  </LegalPage>
</template>
