<script setup lang="ts">
const config = useRuntimeConfig().public;
const { isMainnet, clusterLabel } = useSolana();
const { t } = useI18n();
const localePath = useLocalePath();

const sections = computed(() =>
  legalSections(t, 'terms', [
    'agreement',
    'eligibility',
    'money',
    'rounds',
    'wallet',
    'operator',
    'risks',
    'use',
    'liability',
    'openSource',
    'changes',
    'contact',
  ]),
);
</script>

<template>
  <LegalPage page="terms" :sections="sections">
    <h2 id="agreement">{{ t('legal.terms.agreement.title') }}</h2>
    <i18n-t keypath="legal.terms.agreement.p1" tag="p" scope="global">
      <template #operator>{{ OPERATOR.name }}</template>
      <template #privacy>
        <NuxtLink :to="localePath('/legal/privacy')">{{ t('legal.pages.privacy.label') }}</NuxtLink>
      </template>
      <template #cookies>
        <NuxtLink :to="localePath('/legal/cookies')">{{ t('legal.pages.cookies.label') }}</NuxtLink>
      </template>
    </i18n-t>
    <p>{{ t('legal.terms.agreement.p2') }}</p>

    <h2 id="eligibility">{{ t('legal.terms.eligibility.title') }}</h2>
    <ul>
      <li>{{ t('legal.terms.eligibility.age') }}</li>
      <li>{{ t('legal.terms.eligibility.legal') }}</li>
      <li>{{ t('legal.terms.eligibility.own') }}</li>
    </ul>

    <h2 id="money">{{ t('legal.terms.money.title') }}</h2>
    <i18n-t :keypath="isMainnet ? 'legal.terms.money.real' : 'legal.terms.money.test'" tag="p" scope="global">
      <template #cluster>
        <strong>Solana {{ isMainnet ? 'Mainnet' : clusterLabel }}</strong>
      </template>
    </i18n-t>

    <h2 id="rounds">{{ t('legal.terms.rounds.title') }}</h2>
    <p>{{ t('legal.terms.rounds.intro') }}</p>
    <ul>
      <li>{{ t('legal.terms.rounds.day') }}</li>
      <li>{{ t('legal.terms.rounds.number') }}</li>
      <li>{{ t('legal.terms.rounds.price') }}</li>
      <li>{{ t('legal.terms.rounds.pot') }}</li>
      <li>{{ t('legal.terms.rounds.draw') }}</li>
      <li>{{ t('legal.terms.rounds.rent') }}</li>
    </ul>

    <h2 id="wallet">{{ t('legal.terms.wallet.title') }}</h2>
    <ul>
      <li>{{ t('legal.terms.wallet.own') }}</li>
      <li>{{ t('legal.terms.wallet.sign') }}</li>
      <i18n-t keypath="legal.terms.wallet.public" tag="li" scope="global">
        <template #privacy>
          <NuxtLink :to="localePath('/legal/privacy')">{{ t('legal.pages.privacy.label') }}</NuxtLink>
        </template>
      </i18n-t>
      <li>{{ t('legal.terms.wallet.keys') }}</li>
    </ul>

    <h2 id="operator">{{ t('legal.terms.operator.title') }}</h2>
    <p>{{ t('legal.terms.operator.intro') }}</p>
    <ul>
      <li>{{ t('legal.terms.operator.price') }}</li>
      <li>{{ t('legal.terms.operator.pause') }}</li>
      <li>{{ t('legal.terms.operator.other') }}</li>
    </ul>
    <p>{{ t('legal.terms.operator.cannot') }}</p>
    <p>{{ t('legal.terms.operator.upgrade') }}</p>

    <h2 id="risks">{{ t('legal.terms.risks.title') }}</h2>
    <p>{{ t('legal.terms.risks.intro') }}</p>
    <ul>
      <li>{{ t('legal.terms.risks.bugs') }}</li>
      <li>{{ t('legal.terms.risks.network') }}</li>
      <li>{{ t('legal.terms.risks.draw') }}</li>
      <li>{{ t('legal.terms.risks.site') }}</li>
      <li>{{ t('legal.terms.risks.law') }}</li>
    </ul>

    <h2 id="use">{{ t('legal.terms.use.title') }}</h2>
    <p>{{ t('legal.terms.use.body') }}</p>

    <h2 id="liability">{{ t('legal.terms.liability.title') }}</h2>
    <p>{{ t('legal.terms.liability.body') }}</p>

    <h2 id="open-source">{{ t('legal.terms.openSource.title') }}</h2>
    <i18n-t keypath="legal.terms.openSource.body" tag="p" scope="global">
      <template #repository>
        <a :href="config.githubUrl" target="_blank" rel="noopener">{{ t('legal.repository') }}</a>
      </template>
    </i18n-t>

    <h2 id="changes">{{ t('legal.terms.changes.title') }}</h2>
    <p>{{ t('legal.terms.changes.body') }}</p>

    <h2 id="contact">{{ t('legal.terms.contact.title') }}</h2>
    <i18n-t keypath="legal.terms.contact.body" tag="p" scope="global">
      <template #email>
        <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a>
      </template>
    </i18n-t>
  </LegalPage>
</template>
