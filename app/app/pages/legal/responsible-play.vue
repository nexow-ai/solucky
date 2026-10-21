<script setup lang="ts">
const { isMainnet, clusterLabel } = useSolana();
const { t } = useI18n();

const sections = computed(() => legalSections(t, 'play', ['basics', 'odds', 'final', 'habits', 'limits', 'help']));

// Independent organisations, listed for information only; `where` is under legal.play.help.
const help = [
  { name: 'Gamblers Anonymous', url: 'https://www.gamblersanonymous.org', where: 'worldwide' },
  { name: 'National Council on Problem Gambling', url: 'https://www.ncpgambling.org', where: 'us' },
  { name: 'GamCare', url: 'https://www.gamcare.org.uk', where: 'uk' },
  { name: 'GambleAware', url: 'https://www.gambleaware.org', where: 'uk' },
] as const;
</script>

<template>
  <LegalPage page="play" :sections="sections">
    <h2 id="basics">{{ t('legal.play.basics.title') }}</h2>
    <ul>
      <li>{{ t('legal.play.basics.age') }}</li>
      <li v-if="!isMainnet">{{ t('legal.play.basics.test', { cluster: clusterLabel }) }}</li>
      <li v-else>{{ t('legal.play.basics.real') }}</li>
      <li>{{ t('legal.play.basics.fun') }}</li>
    </ul>

    <h2 id="odds">{{ t('legal.play.odds.title') }}</h2>
    <ul>
      <li>{{ t('legal.play.odds.same') }}</li>
      <li>{{ t('legal.play.odds.label') }}</li>
      <li>{{ t('legal.play.odds.fee') }}</li>
      <li>{{ t('legal.play.odds.nothing') }}</li>
    </ul>

    <h2 id="final">{{ t('legal.play.final.title') }}</h2>
    <p>{{ t('legal.play.final.body') }}</p>

    <h2 id="habits">{{ t('legal.play.habits.title') }}</h2>
    <ul>
      <li>{{ t('legal.play.habits.budget') }}</li>
      <li>{{ t('legal.play.habits.chase') }}</li>
      <li>{{ t('legal.play.habits.mood') }}</li>
      <li>{{ t('legal.play.habits.breaks') }}</li>
    </ul>

    <h2 id="limits">{{ t('legal.play.limits.title') }}</h2>
    <p>{{ t('legal.play.limits.intro') }}</p>
    <ul>
      <li>{{ t('legal.play.limits.wallet') }}</li>
      <li>{{ t('legal.play.limits.block') }}</li>
      <li>{{ t('legal.play.limits.trust') }}</li>
    </ul>

    <h2 id="help">{{ t('legal.play.help.title') }}</h2>
    <p>{{ t('legal.play.help.intro') }}</p>
    <ul>
      <li v-for="org in help" :key="org.url">
        <a :href="org.url" target="_blank" rel="noopener">{{ org.name }}</a
        >: {{ t(`legal.play.help.${org.where}`) }}
      </li>
    </ul>
    <p>{{ t('legal.play.help.emergency') }}</p>
  </LegalPage>
</template>
