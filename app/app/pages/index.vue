<script setup lang="ts">
import { GAME_SLUGS } from '@solucky/client';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('meta.title'),
  ogTitle: () => t('meta.title'),
  description: () => t('meta.description'),
});

const config = useRuntimeConfig().public;
const { explorer, programAddress, clusterLabel } = useSolana();
// The on-chain config decides the range; the page renders on the server with the env's copy of it.
const max = formatNumber(Number(config.maxNumber));

// The words are under games.daily, games.hourly and games.guess.
const GAME_ICONS = ['i-lucide-sun', 'i-lucide-clock', 'i-lucide-search'] as const;

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
  (['real', 'price', 'odds', 'draw', 'country', 'validator'] as const).map((id) => ({
    label: t(`home.faq.items.${id}.q`),
    content: t(`home.faq.items.${id}.a`),
  })),
);
</script>

<template>
  <div>
    <UPageHero
      orientation="horizontal"
      class="dark"
      :ui="{
        root: 'overflow-hidden',
        container: 'py-14 sm:py-20 lg:py-24',
        title: 'text-5xl sm:text-7xl',
      }"
    >
      <template #top>
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 bg-default">
          <div class="bg-dots absolute inset-0 mask-[radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
          <div
            class="absolute inset-0 bg-[radial-gradient(45%_55%_at_75%_45%,color-mix(in_oklab,var(--ui-primary)_20%,transparent),transparent_70%)]"
          />
          <div class="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </template>

      <template #headline>
        <span
          class="kicker inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary ring ring-primary/40"
        >
          <span class="size-1.5 animate-blink rounded-full bg-primary" />
          {{ t('home.kicker') }}
        </span>
      </template>
      <template #title>
        <span class="glow-primary inline-block"
          ><span class="led inline-block font-mono text-[0.8em] font-extrabold tracking-normal">{{
            t('home.title')
          }}</span></span
        ><br />
        <span class="text-lucky">{{ t('home.titleEnd') }}</span>
      </template>
      <template #description>
        {{ t('home.lead') }}
      </template>
      <template #footer>
        <div class="flex flex-wrap gap-x-4 gap-y-3">
          <UButton
            :label="t('home.playNow')"
            :to="localePath('/play')"
            size="xl"
            icon="i-lucide-ticket"
            class="bg-lucky shadow-neon shine font-semibold tracking-wide text-white hover:opacity-90"
          />
          <UButton
            :label="t('home.howItWorks')"
            to="#how-it-works"
            size="xl"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-down"
          />
        </div>
        <dl class="mt-10 grid max-w-md grid-cols-3 gap-4 border-s-2 border-secondary/70 ps-4">
          <div>
            <dt class="kicker text-[0.65rem]">{{ t('home.program') }}</dt>
            <dd class="mt-1 font-mono text-xs" dir="ltr">
              <ULink :to="explorer('address', programAddress)" target="_blank" class="text-toned hover:text-primary">
                {{ shortAddress(programAddress) }}
              </ULink>
            </dd>
          </div>
          <div>
            <dt class="kicker text-[0.65rem]">{{ t('home.cluster') }}</dt>
            <dd class="mt-1 font-mono text-xs text-toned">{{ clusterLabel }}</dd>
          </div>
          <div>
            <dt class="kicker text-[0.65rem]">{{ t('home.draw') }}</dt>
            <dd class="mt-1 font-mono text-xs text-toned" dir="ltr">00:00 UTC</dd>
          </div>
        </dl>
      </template>

      <!-- The solar dial: today as a 24-hour ring, with the corona behind it. -->
      <div class="relative mx-auto w-full max-w-[34rem]">
        <div aria-hidden="true" class="absolute inset-x-0 top-0 -z-10 aspect-square">
          <LandingCorona class="absolute -top-[45%] -left-[45%] size-[190%]" />
        </div>
        <div class="@container relative aspect-square">
          <LandingDialFace />
          <ClientOnly>
            <LazyLandingDialLive />
          </ClientOnly>
        </div>
        <!-- Holds the readouts' height while their chunk loads. -->
        <div class="mt-6 min-h-[8.625rem] sm:min-h-[4.625rem]">
          <ClientOnly>
            <LazyLandingDialStats />
          </ClientOnly>
        </div>
        <p
          class="mx-auto mt-3 w-fit rounded-(--ui-radius) bg-default/85 px-3 py-1.5 text-center text-xs text-pretty text-muted"
        >
          {{ t('home.dialCaption') }}
        </p>
      </div>
    </UPageHero>

    <div class="dark relative z-10 min-h-[2.625rem]">
      <ClientOnly>
        <LazyLandingLiveTicker />
        <template #fallback>
          <LandingTicker />
        </template>
      </ClientOnly>
    </div>

    <UPageSection id="games" :title="t('games.title')" :description="t('games.description', { max })">
      <template #headline>
        <LandingSectionTag index="01" :label="t('games.tag')" />
      </template>
      <UPageGrid class="reveal lg:grid-cols-3">
        <UPageCard
          v-for="(slug, kind) in GAME_SLUGS"
          :key="slug"
          :icon="GAME_ICONS[kind]"
          :title="t(`games.${slug}.name`)"
          :description="t(`games.${slug}.description`)"
          :to="localePath(`/play/${slug}`)"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection id="how-it-works" :title="t('home.how.title')" :description="t('home.how.description')">
      <template #headline>
        <LandingSectionTag index="02" :label="t('home.how.tag')" />
      </template>
      <div class="reveal">
        <!-- The day, from the round opening to the draw. A clock: it runs left to right in every language. -->
        <div
          class="relative mb-14 hidden h-px bg-linear-to-r from-primary/20 via-primary to-secondary sm:block"
          dir="ltr"
          aria-hidden="true"
        >
          <span class="absolute -top-6 left-0 font-mono text-[0.65rem] tracking-widest text-muted uppercase">
            00:00 UTC · {{ t('home.how.opens') }}
          </span>
          <span class="absolute -top-6 right-0 font-mono text-[0.65rem] tracking-widest text-secondary uppercase">
            24:00 UTC · {{ t('home.how.draw') }}
          </span>
          <ClientOnly>
            <LazyLandingDayNow />
          </ClientOnly>
        </div>
        <ol
          class="grid gap-px overflow-hidden rounded-(--ui-radius) border border-default bg-(--ui-border) sm:grid-cols-2 lg:grid-cols-4"
        >
          <li v-for="(step, index) in steps" :key="step.id" class="group relative bg-default p-6 sm:p-8">
            <span
              aria-hidden="true"
              class="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-lucky transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
            />
            <div class="flex items-start justify-between">
              <span class="led font-mono text-6xl leading-none font-extrabold text-primary">0{{ index + 1 }}</span>
              <UIcon :name="step.icon" class="size-5 text-secondary" />
            </div>
            <h3 class="mt-8 text-lg font-semibold text-highlighted">{{ t(`home.how.steps.${step.id}.title`) }}</h3>
            <p class="mt-2 text-sm text-pretty text-muted">
              {{ t(`home.how.steps.${step.id}.description`, { max }) }}
            </p>
            <p class="mt-6 font-mono text-[0.65rem] tracking-widest text-dimmed uppercase">
              {{ t(`home.how.steps.${step.id}.when`) }}
            </p>
          </li>
        </ol>
      </div>
    </UPageSection>

    <UPageSection id="fairness" :title="t('home.fairness.title')" :description="t('home.fairness.description')">
      <template #headline>
        <LandingSectionTag index="03" :label="t('home.fairness.tag')" />
      </template>
      <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <ol class="border-t border-default">
          <li
            v-for="(rule, index) in fairness"
            :key="rule.id"
            class="reveal grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-default py-6"
          >
            <span class="pt-0.5 font-mono text-xs font-semibold text-secondary">§{{ index + 1 }}</span>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-highlighted">
                <UIcon :name="rule.icon" class="size-4 shrink-0 text-primary" />
                {{ t(`home.fairness.rules.${rule.id}.title`) }}
              </h3>
              <p class="mt-1.5 text-pretty text-muted">{{ t(`home.fairness.rules.${rule.id}.description`) }}</p>
            </div>
          </li>
        </ol>
        <!-- The receipt keeps one height in every state; this holds it while its chunk loads. -->
        <div class="min-h-[41rem] lg:sticky lg:top-24">
          <ClientOnly>
            <LazyLandingDrawReceipt />
            <template #fallback>
              <div class="mx-auto h-[41rem] w-full max-w-sm rotate-1 bg-elevated perforated" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="faq"
      orientation="horizontal"
      :title="t('home.faq.title')"
      :description="t('home.faq.description')"
      :links="[
        {
          label: t('home.faq.readCode'),
          to: config.githubUrl,
          target: '_blank',
          color: 'neutral',
          variant: 'outline',
          icon: 'i-simple-icons-github',
        },
      ]"
      :ui="{
        container: 'lg:grid-cols-[1fr_2fr] lg:items-start',
        wrapper: 'lg:sticky lg:top-24',
        headline: 'justify-start',
      }"
    >
      <template #headline>
        <LandingSectionTag index="04" :label="t('home.faq.tag')" />
      </template>
      <UAccordion
        :items="faq"
        type="multiple"
        class="reveal border-t border-default"
        :ui="{ trigger: 'py-5 text-base text-highlighted hover:text-primary', trailingIcon: 'text-secondary' }"
      />
    </UPageSection>

    <UPageSection :ui="{ container: 'py-12 sm:py-16 lg:py-20' }">
      <UPageCTA
        :title="t('home.cta.title')"
        :description="t('home.cta.description')"
        variant="naked"
        class="dark reveal bg-default"
        :ui="{ container: 'py-32 sm:py-40 lg:py-40' }"
        :links="[
          {
            label: t('home.playNow'),
            to: localePath('/play'),
            size: 'xl',
            icon: 'i-lucide-ticket',
            class: 'bg-lucky shadow-neon shine font-semibold tracking-wide text-white hover:opacity-90',
          },
        ]"
      >
        <template #top>
          <!-- Midnight: the sun eclipsed, its corona turning around the disc. -->
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div class="bg-dots absolute inset-0 mask-[radial-gradient(circle_at_center,black,transparent_70%)]" />
            <div class="absolute top-1/2 left-1/2 size-[30rem] -translate-1/2 sm:size-[38rem]">
              <div
                class="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(var(--ui-color-primary-400),transparent_18%,var(--ui-color-primary-700)_34%,transparent_50%,var(--ui-color-primary-500)_64%,var(--ui-secondary)_69%,transparent_76%,var(--ui-color-primary-400))] opacity-60 blur-2xl"
              />
              <div class="absolute inset-[11%] rounded-full bg-default shadow-[0_0_70px_6px_var(--ui-primary)]" />
              <div class="absolute inset-[11%] rounded-full ring-1 ring-primary/70" />
            </div>
          </div>
        </template>
      </UPageCTA>
    </UPageSection>
  </div>
</template>
