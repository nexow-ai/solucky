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
const { explorer, programAddress, clusterLabel } = useSolana();
// The on-chain config decides the range. The server renders the env's copy of
// it; the browser switches to the config's once it loads.
const { maxNumber } = useLottery(GameKind.Daily);
const max = computed(() => formatNumber(maxNumber.value));

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

// The solar dial leans towards the pointer; the corona behind it drifts the other way.
const dial = useTemplateRef<HTMLElement>('dial');
useTilt(dial);

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
    <div class="scroll-meter" aria-hidden="true" />

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
          class="kicker rise inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary ring ring-primary/40"
          style="--rise: 0"
        >
          <span class="size-1.5 animate-blink rounded-full bg-primary" />
          {{ t('home.kicker') }}
        </span>
      </template>
      <template #title>
        <span class="rise inline-block" style="--rise: 1"
          ><span class="glow-primary inline-block"
            ><span class="led ignite inline-block font-mono text-[0.8em] font-extrabold tracking-normal">{{
              t('home.title')
            }}</span></span
          ></span
        ><br />
        <span class="rise lucky-flow inline-block" style="--rise: 2">{{ t('home.titleEnd') }}</span>
      </template>
      <template #description>
        <span class="rise block" style="--rise: 3">{{ t('home.lead') }}</span>
      </template>
      <template #footer>
        <div class="rise flex flex-wrap gap-x-4 gap-y-3" style="--rise: 4">
          <UButton
            :label="t('home.playNow')"
            :to="localePath('/play')"
            size="xl"
            icon="i-lucide-ticket"
            class="bg-lucky shadow-neon shine font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
          />
          <UButton
            :label="t('home.howItWorks')"
            to="#how-it-works"
            size="xl"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-down"
            :ui="{ trailingIcon: 'transition-transform group-hover:translate-y-0.5' }"
            class="group"
          />
        </div>
        <dl class="rise mt-10 grid max-w-md grid-cols-3 gap-4 border-s-2 border-secondary/70 ps-4" style="--rise: 5">
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
      <div class="dial-rise relative mx-auto w-full max-w-[34rem]">
        <div ref="dial" class="dial-stage relative">
          <div aria-hidden="true" class="corona-layer absolute inset-x-0 top-0 -z-10 aspect-square">
            <LandingCorona class="absolute -top-[45%] -left-[45%] size-[190%]" />
          </div>
          <div class="dial-tilt @container relative aspect-square">
            <LandingDialFace />
            <ClientOnly>
              <LazyLandingDialLive />
            </ClientOnly>
            <span class="dial-glare" aria-hidden="true" />
          </div>
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

    <UPageSection
      id="games"
      :title="t('games.title')"
      :description="t('games.description', { max })"
      :ui="{ title: 'reveal-blur' }"
    >
      <template #headline>
        <LandingSectionTag index="01" :label="t('games.tag')" />
      </template>
      <div class="reveal-stagger grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(slug, kind) in GAME_SLUGS" :key="slug" :style="{ '--i': kind }">
          <LandingGameCard :kind="kind" />
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="how-it-works"
      :title="t('home.how.title')"
      :description="t('home.how.description')"
      :ui="{ title: 'reveal-blur' }"
    >
      <template #headline>
        <LandingSectionTag index="02" :label="t('home.how.tag')" />
      </template>
      <div class="reveal">
        <!-- The day, from the round opening to the draw. A clock: it runs left to right in every language. -->
        <div class="relative mb-14 hidden h-px sm:block" dir="ltr" aria-hidden="true">
          <div class="reveal-draw absolute inset-0 bg-linear-to-r from-primary/20 via-primary to-secondary" />
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
          class="steps relative grid gap-px overflow-hidden rounded-(--ui-radius) border border-default bg-(--ui-border) sm:grid-cols-2 lg:grid-cols-4"
        >
          <!-- A current running through the four steps, round after round. -->
          <span aria-hidden="true" class="current" />
          <li
            v-for="(step, index) in steps"
            :key="step.id"
            class="group relative bg-default p-6 transition-colors duration-500 hover:bg-elevated/60 sm:p-8"
            :style="{ '--i': index }"
          >
            <span
              aria-hidden="true"
              class="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-lucky transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
            />
            <div class="flex items-start justify-between">
              <span
                class="step-number led font-mono text-6xl leading-none font-extrabold text-primary transition-[filter] duration-500 group-hover:drop-shadow-[0_0_14px_var(--ui-primary)]"
                >0{{ index + 1 }}</span
              >
              <UIcon
                :name="step.icon"
                class="size-5 text-secondary transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6"
              />
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

    <UPageSection
      id="fairness"
      :title="t('home.fairness.title')"
      :description="t('home.fairness.description')"
      :ui="{ title: 'reveal-blur' }"
    >
      <template #headline>
        <LandingSectionTag index="03" :label="t('home.fairness.tag')" />
      </template>
      <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <ol class="border-t border-default">
          <li
            v-for="(rule, index) in fairness"
            :key="rule.id"
            class="rule reveal-side group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-default py-6"
          >
            <span class="pt-0.5 font-mono text-xs font-semibold text-secondary">§{{ index + 1 }}</span>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-highlighted">
                <UIcon
                  :name="rule.icon"
                  class="size-4 shrink-0 text-primary transition-transform duration-500 group-hover:scale-125"
                />
                {{ t(`home.fairness.rules.${rule.id}.title`) }}
              </h3>
              <p class="mt-1.5 text-pretty text-muted">{{ t(`home.fairness.rules.${rule.id}.description`) }}</p>
            </div>
          </li>
        </ol>
        <!-- The receipt keeps one height in every state; this holds it while its chunk loads. -->
        <div class="min-h-[42.5rem] lg:sticky lg:top-24">
          <!-- The receipt prints out of a slot as it scrolls into view. -->
          <div class="printer-slot" aria-hidden="true" />
          <div class="reveal-print">
            <ClientOnly>
              <LazyLandingDrawReceipt />
              <template #fallback>
                <div class="mx-auto h-[41rem] w-full max-w-sm rotate-1 bg-elevated perforated" />
              </template>
            </ClientOnly>
          </div>
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
        title: 'reveal-blur',
      }"
    >
      <template #headline>
        <LandingSectionTag index="04" :label="t('home.faq.tag')" />
      </template>
      <UAccordion
        :items="faq"
        type="multiple"
        class="reveal border-t border-default"
        :ui="{
          trigger: 'py-5 text-base text-highlighted hover:text-primary',
          trailingIcon: 'text-secondary transition-transform duration-300',
          body: 'text-pretty text-muted',
        }"
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
            class:
              'bg-lucky shadow-neon shine font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:opacity-90',
          },
        ]"
      >
        <template #top>
          <!-- Midnight: the sun eclipsed, its corona turning around the disc and a bead of light running round its rim. -->
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div class="bg-dots absolute inset-0 mask-[radial-gradient(circle_at_center,black,transparent_70%)]" />
            <div class="absolute top-1/2 left-1/2 size-[30rem] -translate-1/2 sm:size-[38rem]">
              <div
                class="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(var(--ui-color-primary-400),transparent_18%,var(--ui-color-primary-700)_34%,transparent_50%,var(--ui-color-primary-500)_64%,var(--ui-secondary)_69%,transparent_76%,var(--ui-color-primary-400))] opacity-60 blur-2xl"
              />
              <div class="eclipse absolute inset-[11%] rounded-full bg-default" />
              <div class="absolute inset-[11%] rounded-full ring-1 ring-primary/70" />
              <div class="bead-orbit absolute inset-[11%]">
                <span class="bead" />
              </div>
            </div>
          </div>
        </template>
      </UPageCTA>
    </UPageSection>
  </div>
</template>

<style scoped>
/* The dial arrives after the headline, growing out of its own glow. */
@media (prefers-reduced-motion: no-preference) {
  .dial-rise {
    animation: dial-in 1.4s var(--ease-out-expo) 0.25s both;
  }
}

@keyframes dial-in {
  from {
    opacity: 0;
    scale: 0.86;
    rotate: -8deg;
    filter: blur(10px);
  }
}

.dial-tilt {
  transform: perspective(1400px) rotateX(calc(var(--tilt-y, 0) * -7deg)) rotateY(calc(var(--tilt-x, 0) * 7deg));
  transition: transform 1s var(--ease-out-expo);
}

.dial-stage[data-tilting] .dial-tilt {
  transition-duration: 0.35s;
}

.corona-layer {
  translate: calc(var(--tilt-x, 0) * -16px) calc(var(--tilt-y, 0) * -16px);
  transition: translate 1.2s var(--ease-out-expo);
}

/* A sheen on the dial's glass, where the light would catch it. */
.dial-glare {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: radial-gradient(
    circle at var(--glare-x, 30%) var(--glare-y, 20%),
    color-mix(in oklab, white 8%, transparent),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.dial-stage[data-tilting] .dial-glare {
  opacity: 1;
}

/* The steps' current: a short bright pulse running along their top edge. */
.current {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 18%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--ui-secondary), var(--color-pink-500), transparent);
  box-shadow: 0 0 12px var(--ui-secondary);
  animation: current 7s ease-in-out infinite;
  pointer-events: none;
}

.current:dir(rtl) {
  animation-direction: reverse;
}

@keyframes current {
  0% {
    translate: -100% 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  55% {
    opacity: 1;
  }
  70%,
  100% {
    translate: 560% 0;
    opacity: 0;
  }
}

/* Each step's number switches on like a neon sign as it scrolls in, one after the other. */
@media screen and (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .step-number {
      animation: ignite linear both;
      animation-timeline: view();
      animation-range: entry calc(35% + var(--i) * 12%) cover calc(38% + var(--i) * 6%);
    }
  }
}

.rule {
  transition: background-color 0.4s ease;
}

.rule:hover {
  background: linear-gradient(90deg, color-mix(in oklab, var(--ui-primary) 6%, transparent), transparent 70%);
}

.rule:hover:dir(rtl) {
  background: linear-gradient(270deg, color-mix(in oklab, var(--ui-primary) 6%, transparent), transparent 70%);
}

/* The ticket machine's slot the draw receipt comes out of. */
.printer-slot {
  position: relative;
  z-index: 1;
  margin: 0 auto 0.85rem;
  max-width: 26rem;
  height: 0.65rem;
  border-radius: 9999px;
  background: color-mix(in oklab, black 70%, var(--ui-bg));
  box-shadow:
    inset 0 2px 4px black,
    0 1px 0 color-mix(in oklab, white 8%, transparent),
    0 0 22px -6px var(--ui-secondary);
}

.printer-slot::after {
  content: '';
  position: absolute;
  inset-inline: 12%;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--ui-secondary), transparent);
  opacity: 0.7;
  animation: slot-glow 2.4s ease-in-out infinite;
}

@keyframes slot-glow {
  50% {
    opacity: 0.3;
  }
}

.eclipse {
  box-shadow: 0 0 70px 6px var(--ui-primary);
  animation: eclipse 6s ease-in-out infinite;
}

@keyframes eclipse {
  50% {
    box-shadow: 0 0 110px 14px var(--ui-primary);
  }
}

/* Baily's bead: one point of sunlight left at the rim, running round it. */
.bead-orbit {
  animation: orbit 16s linear infinite;
}

@keyframes orbit {
  to {
    rotate: 360deg;
  }
}

.bead {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 9999px;
  translate: -50% -50%;
  background: white;
  box-shadow:
    0 0 10px 3px white,
    0 0 28px 8px var(--ui-color-primary-300),
    0 0 70px 18px color-mix(in oklab, var(--ui-primary) 60%, transparent);
}
</style>
