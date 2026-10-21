<script setup lang="ts">
const config = useRuntimeConfig().public;
const { clusterLabel } = useSolana();
const { t } = useI18n();
const localePath = useLocalePath();

// Only the host: a provider's URL can carry an API key in its path or query.
const rpcHost = computed(() => {
  try {
    return config.rpcUrl ? new URL(config.rpcUrl).host : null;
  } catch {
    return null;
  }
});

const sections = computed(() =>
  legalSections(t, 'privacy', [
    'summary',
    'onChain',
    'servers',
    'thirdParties',
    'browser',
    'purposes',
    'rights',
    'children',
    'changes',
  ]),
);
</script>

<template>
  <LegalPage page="privacy" :sections="sections">
    <h2 id="summary">{{ t('legal.privacy.summary.title') }}</h2>
    <ul>
      <li>{{ t('legal.privacy.summary.account') }}</li>
      <li>{{ t('legal.privacy.summary.cookies') }}</li>
      <li>{{ t('legal.privacy.summary.database') }}</li>
      <li>{{ t('legal.privacy.summary.public') }}</li>
    </ul>
    <p>{{ t('legal.privacy.summary.controller', { operator: OPERATOR.name }) }}</p>

    <h2 id="on-chain">{{ t('legal.privacy.onChain.title') }}</h2>
    <p>{{ t('legal.privacy.onChain.intro') }}</p>
    <ul>
      <li>{{ t('legal.privacy.onChain.address') }}</li>
      <li>{{ t('legal.privacy.onChain.number') }}</li>
      <li>{{ t('legal.privacy.onChain.flag') }}</li>
    </ul>
    <p>{{ t('legal.privacy.onChain.ledger') }}</p>
    <p>{{ t('legal.privacy.onChain.link') }}</p>

    <h2 id="servers">{{ t('legal.privacy.servers.title') }}</h2>
    <h3>{{ t('legal.privacy.servers.visit') }}</h3>
    <i18n-t keypath="legal.privacy.servers.visitBody" tag="p" scope="global">
      <template #policy>
        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">{{
          t('legal.privacy.servers.policy')
        }}</a>
      </template>
    </i18n-t>
    <h3>{{ t('legal.privacy.servers.country') }}</h3>
    <p>{{ t('legal.privacy.servers.countryBody') }}</p>
    <h3>{{ t('legal.privacy.servers.live') }}</h3>
    <p>{{ t('legal.privacy.servers.liveBody') }}</p>
    <h3>{{ t('legal.privacy.servers.price') }}</h3>
    <p>{{ t('legal.privacy.servers.priceBody') }}</p>

    <h2 id="third-parties">{{ t('legal.privacy.thirdParties.title') }}</h2>
    <ul>
      <i18n-t keypath="legal.privacy.thirdParties.rpc" tag="li" scope="global">
        <template #name>
          <strong>{{ t('legal.privacy.thirdParties.rpcName') }}</strong>
        </template>
        <template #endpoint>
          <i18n-t v-if="rpcHost" keypath="legal.privacy.thirdParties.rpcHost" scope="global">
            <template #host>
              <code>{{ rpcHost }}</code>
            </template>
          </i18n-t>
          <template v-else>{{ t('legal.privacy.thirdParties.rpcPublic', { cluster: clusterLabel }) }}</template>
        </template>
      </i18n-t>
      <i18n-t keypath="legal.privacy.thirdParties.wallet" tag="li" scope="global">
        <template #name>
          <strong>{{ t('legal.privacy.thirdParties.walletName') }}</strong>
        </template>
      </i18n-t>
      <i18n-t keypath="legal.privacy.thirdParties.links" tag="li" scope="global">
        <template #name>
          <strong>{{ t('legal.privacy.thirdParties.linksName') }}</strong>
        </template>
      </i18n-t>
    </ul>
    <p>{{ t('legal.privacy.thirdParties.own') }}</p>

    <h2 id="browser">{{ t('legal.privacy.browser.title') }}</h2>
    <i18n-t keypath="legal.privacy.browser.body" tag="p" scope="global">
      <template #cookies>
        <NuxtLink :to="localePath('/legal/cookies')">{{ t('legal.pages.cookies.label') }}</NuxtLink>
      </template>
    </i18n-t>

    <h2 id="purposes">{{ t('legal.privacy.purposes.title') }}</h2>
    <p>{{ t('legal.privacy.purposes.body') }}</p>

    <h2 id="rights">{{ t('legal.privacy.rights.title') }}</h2>
    <ul>
      <li>{{ t('legal.privacy.rights.flag') }}</li>
      <li>{{ t('legal.privacy.rights.clear') }}</li>
      <i18n-t keypath="legal.privacy.rights.law" tag="li" scope="global">
        <template #email>
          <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a>
        </template>
      </i18n-t>
    </ul>

    <h2 id="children">{{ t('legal.privacy.children.title') }}</h2>
    <p>{{ t('legal.privacy.children.body') }}</p>

    <h2 id="changes">{{ t('legal.privacy.changes.title') }}</h2>
    <i18n-t keypath="legal.privacy.changes.body" tag="p" scope="global">
      <template #email>
        <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a>
      </template>
    </i18n-t>
  </LegalPage>
</template>
