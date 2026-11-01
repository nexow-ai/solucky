<script setup lang="ts">
import { GAME_SLUGS, GameKind } from '@solucky/client';

const { t, localeProperties } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('meta.title'),
  ogTitle: () => t('meta.title'),
  description: () => t('meta.description'),
  ogDescription: () => t('meta.description'),
});

const config = useRuntimeConfig().public;
// The on-chain config decides the range. The server renders the env's copy of
// it; the browser switches to the config's once it loads.
const { maxNumber } = useLottery(GameKind.Daily);
const max = computed(() => formatNumber(maxNumber.value));

// The winner's share of a pot (`prizeFor`), and the rest: the fee and the carry-over.
const intl = useIntlLocale();
const percent = computed(() => new Intl.NumberFormat(intl.value, { style: 'percent' }));
const share = computed(() => percent.value.format(0.8));
const rest = computed(() => percent.value.format(0.2));

// The words are under home.how.steps, home.fairness.rules and home.faq.items.
const steps = [
  { id: 'wallet', icon: 'i-lucide-wallet' },
  { id: 'number', icon: 'i-lucide-hash' },
  { id: 'pot', icon: 'i-lucide-trending-up' },
  { id: 'win', icon: 'i-lucide-trophy' },
] as const;

const fairness = [
  { id: 'locked', icon: 'i-lucide-lock' },
  { id: 'draw', icon: 'i-lucide-dices' },
  { id: 'anyone', icon: 'i-lucide-users' },
  { id: 'browser', icon: 'i-lucide-search-check' },
  { id: 'limits', icon: 'i-lucide-shield-check' },
  { id: 'open', icon: 'i-lucide-code' },
] as const;

const faq = computed(() =>
  (['what', 'real', 'price', 'odds', 'guess', 'draw', 'country', 'validator'] as const).map((id) => ({
    label: t(`home.faq.items.${id}.q`),
    content: t(`home.faq.items.${id}.a`, { max: max.value }),
  })),
);

// The bento of games, in the order of their kinds.
const games = [GameKind.Daily, GameKind.Hourly, GameKind.Guess];

// Structured data, in the page's language: what S☉Lucky is, its games, how to play, the questions.
const origin = (config.siteUrl || config.i18n?.baseUrl || useRequestURL().origin).replace(/\/$/, '');
const absolute = (path: string) => `${origin}${path === '/' ? '/' : path}`;
useHead(() => ({
  script: [
    {
      key: 'ld-home',
      type: 'application/ld+json',
      innerHTML: jsonLd(
        homeGraph({
          origin,
          url: absolute(localePath('/')),
          language: localeProperties.value.language ?? 'en',
          title: t('meta.title'),
          description: t('meta.description'),
          lead: t('home.lead'),
          imageAlt: t('meta.ogImageAlt'),
          operator: OPERATOR,
          profiles: [config.githubUrl, config.twitterUrl, config.discordUrl].filter(Boolean),
          repository: config.githubUrl,
          gamesTitle: t('games.title'),
          games: GAME_SLUGS.map((slug) => ({
            name: t(`games.${slug}.name`),
            description: t(`games.${slug}.description`),
            url: absolute(localePath(playPath(slug))),
          })),
          howTitle: t('home.how.title'),
          howDescription: t('home.how.description'),
          steps: steps.map((step) => ({
            name: t(`home.how.steps.${step.id}.title`),
            text: t(`home.how.steps.${step.id}.description`, { max: max.value }),
          })),
          faq: faq.value.map((item) => ({ question: item.label, answer: item.content })),
          playUrl: absolute(localePath('/play')),
        }),
      ),
    },
  ],
}));
</script>

<template>
  <div>
    <!-- Hero: the headline and the day's dial (scripts/og.ts lays it out as the share card by its data-hero marks). -->
    <section class="overflow-hidden" data-hero>
      <UContainer
        class="grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:py-24"
      >
        <div data-hero-text>
          <span
            class="kicker rise inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 shadow-(--neu-in-sm)"
            style="--rise: 0"
          >
            <span class="led-dot animate-breathe text-secondary" aria-hidden="true" />
            {{ t('home.kicker') }}
          </span>
          <h1 class="mt-7 text-5xl leading-[1.02] font-light tracking-tight text-highlighted sm:text-7xl">
            <span class="rise inline-block" style="--rise: 1">{{ t('home.title') }}</span
            ><br />
            <span class="rise text-lucky inline-block pb-1 font-normal" style="--rise: 2">{{
              t('home.titleEnd')
            }}</span>
          </h1>
          <p class="rise mt-7 max-w-xl text-lg text-pretty text-muted" style="--rise: 3" data-hero-more>
            {{ t('home.lead') }}
          </p>
          <div class="rise mt-10 flex flex-wrap gap-4" style="--rise: 4" data-hero-more>
            <UButton
              :label="t('home.playNow')"
              :to="localePath('/play')"
              size="xl"
              icon="i-lucide-ticket"
              class="bg-lucky rounded-2xl px-6 font-medium text-white shadow-(--neu-accent) hover:opacity-95 active:shadow-(--neu-in-sm)"
            />
            <UButton
              :label="t('home.howItWorks')"
              to="#how-it-works"
              size="xl"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-arrow-down"
              :ui="{ trailingIcon: 'transition-transform group-hover:translate-y-0.5' }"
              class="group rounded-2xl px-6"
            />
          </div>
        </div>

        <div class="dial-in" data-hero-dial>
          <LandingHeroDial>
            <ClientOnly>
              <LazyLandingHeroDialLive />
            </ClientOnly>
          </LandingHeroDial>
          <!-- The day's counters; the tray keeps its height while they load. -->
          <div
            class="mx-auto mt-10 grid min-h-[4.75rem] max-w-[30rem] grid-cols-3 rounded-3xl py-3.5 shadow-(--neu-in-sm)"
            data-hero-more
          >
            <ClientOnly>
              <LazyLandingHeroStats />
            </ClientOnly>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- The games. -->
    <section id="games" class="py-16 sm:py-24">
      <UContainer>
        <LandingSectionHead
          :tag="t('games.tag')"
          :title="t('games.title')"
          :description="t('games.description', { max })"
        />
        <div class="reveal-stagger grid gap-8 md:grid-cols-3">
          <div v-for="(kind, i) in games" :key="kind" :style="{ '--i': i }">
            <LandingGameCard :kind="kind" />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- How it works: four steps, and the winner's share. -->
    <section id="how-it-works" class="py-16 sm:py-24">
      <UContainer>
        <LandingSectionHead
          :tag="t('home.how.tag')"
          :title="t('home.how.title')"
          :description="t('home.how.description')"
        />
        <ol class="reveal-stagger grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex flex-col rounded-[2rem] bg-default p-6 shadow-(--neu)"
            :style="{ '--i': index }"
          >
            <div class="flex items-center justify-between">
              <span class="grid size-12 place-items-center rounded-full text-primary shadow-(--neu-in-sm)">
                <UIcon :name="step.icon" class="size-5" />
              </span>
              <span class="font-mono text-sm text-dimmed" dir="ltr">0{{ index + 1 }}</span>
            </div>
            <h3 class="mt-6 text-lg font-medium text-highlighted">{{ t(`home.how.steps.${step.id}.title`) }}</h3>
            <p class="mt-2 text-sm text-pretty text-muted">
              {{ t(`home.how.steps.${step.id}.description`, { max }) }}
            </p>
            <p class="kicker mt-auto pt-6 text-[0.6rem]">{{ t(`home.how.steps.${step.id}.when`) }}</p>
          </li>
        </ol>

        <!-- The winner's share of every pot. -->
        <div
          class="reveal mt-16 grid items-center gap-8 rounded-[2.5rem] bg-default p-8 shadow-(--neu) sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14"
        >
          <p class="readout text-7xl leading-none sm:text-8xl" aria-hidden="true">{{ share }}</p>
          <div>
            <h3 class="text-xl font-medium text-highlighted">
              <span class="sr-only">{{ share }}</span> {{ t('home.split.title') }}
            </h3>
            <p class="mt-2 text-sm text-pretty text-muted">{{ t('home.split.lead', { rest }) }}</p>
            <div class="gauge mt-6 h-3" style="--p: 0.8" aria-hidden="true"><i /></div>
            <p class="kicker mt-3 flex justify-between gap-4 text-[0.6rem]">
              <span>{{ t('home.split.winner') }}</span>
              <span>{{ t('home.split.fee') }} · {{ t('home.split.carry') }}</span>
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Winners, straight from the program's accounts. -->
    <section id="winners" class="py-16 sm:py-24">
      <UContainer>
        <LandingSectionHead
          :tag="t('home.winners.tag')"
          :title="t('home.winners.title')"
          :description="t('home.winners.description')"
        />
        <LandingWinners />
      </UContainer>
    </section>

    <!-- Fairness: the rules the program enforces. -->
    <section id="fairness" class="py-16 sm:py-24">
      <UContainer>
        <LandingSectionHead
          :tag="t('home.fairness.tag')"
          :title="t('home.fairness.title')"
          :description="t('home.fairness.description')"
        />
        <ol class="reveal-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(rule, index) in fairness"
            :key="rule.id"
            class="rounded-[2rem] p-6 shadow-(--neu-in-sm)"
            :style="{ '--i': index % 3 }"
          >
            <span class="grid size-11 place-items-center rounded-full bg-default text-primary shadow-(--neu-sm)">
              <UIcon :name="rule.icon" class="size-5" />
            </span>
            <h3 class="mt-5 font-medium text-highlighted">{{ t(`home.fairness.rules.${rule.id}.title`) }}</h3>
            <p class="mt-2 text-sm text-pretty text-muted">{{ t(`home.fairness.rules.${rule.id}.description`) }}</p>
          </li>
        </ol>
      </UContainer>
    </section>

    <!-- Questions. -->
    <section id="faq" class="py-16 sm:py-24">
      <UContainer class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:items-start">
        <div class="lg:sticky lg:top-28">
          <LandingSectionHead
            :tag="t('home.faq.tag')"
            :title="t('home.faq.title')"
            :description="t('home.faq.description')"
            stacked
          >
            <UButton
              v-if="config.githubUrl"
              :label="t('home.faq.readCode')"
              :to="config.githubUrl"
              target="_blank"
              color="neutral"
              variant="outline"
              icon="i-simple-icons-github"
            />
          </LandingSectionHead>
        </div>
        <UAccordion
          :items="faq"
          type="multiple"
          class="reveal rounded-[2rem] bg-default px-6 shadow-(--neu) sm:px-8"
          :ui="{
            trigger: 'py-5 text-base font-medium text-highlighted hover:text-primary',
            trailingIcon: 'text-primary transition-transform duration-300',
            body: 'text-pretty text-muted',
          }"
        />
      </UContainer>
    </section>

    <!-- The call to play. -->
    <section class="py-16 sm:py-24">
      <UContainer>
        <div class="reveal rounded-[2.5rem] bg-default px-6 py-16 text-center shadow-(--neu-lg) sm:py-20">
          <p class="kicker inline-flex items-center gap-2.5">
            <span class="led-dot animate-breathe text-secondary" aria-hidden="true" />
            <span dir="ltr">00:00 UTC</span> · {{ t('home.how.draw') }}
          </p>
          <h2
            class="mx-auto mt-5 max-w-xl text-4xl font-light tracking-tight text-balance text-highlighted sm:text-5xl"
          >
            {{ t('home.cta.title') }}
          </h2>
          <p class="mx-auto mt-4 max-w-md text-lg text-pretty text-muted">{{ t('home.cta.description') }}</p>
          <UButton
            :label="t('home.playNow')"
            :to="localePath('/play')"
            size="xl"
            icon="i-lucide-ticket"
            class="bg-lucky mt-10 rounded-2xl px-7 font-medium text-white shadow-(--neu-accent) hover:opacity-95 active:shadow-(--neu-in-sm)"
          />
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
/* The dial settles in after the headline. */
@media (prefers-reduced-motion: no-preference) {
  .dial-in {
    animation: dial-in 1.2s var(--ease-out-expo) 0.2s both;
  }
}

@keyframes dial-in {
  from {
    opacity: 0;
    scale: 0.94;
  }
}
</style>
