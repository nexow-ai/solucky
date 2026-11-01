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

// The 3D orrery, once it runs, takes over the 2D dial's sun, tickets and corona, and the finale's eclipse.
const orrery = ref(false);

// The bento of games: the daily lottery is the big ticket.
const machines = [GameKind.Daily, GameKind.Hourly, GameKind.Guess];

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
  <div class="landing" :data-orrery="orrery ? '' : undefined">
    <div class="scroll-meter" aria-hidden="true" />
    <ClientOnly>
      <LazyLandingOrrery @active="orrery = $event" />
    </ClientOnly>

    <!-- Hero: the headline, the pots right now and the solar dial. -->
    <!-- Not isolated: the orrery's canvas sits between this background and the content. -->
    <section data-beat="hero" class="dark relative overflow-hidden">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 bg-default">
        <div class="bg-dots absolute inset-0 mask-[radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
        <div
          class="absolute inset-0 bg-[radial-gradient(45%_55%_at_75%_45%,color-mix(in_oklab,var(--ui-primary)_20%,transparent),transparent_70%)]"
        />
        <div class="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      </div>
      <UContainer class="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:py-20">
        <div>
          <span
            class="kicker rise inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary ring ring-primary/40"
            style="--rise: 0"
          >
            <span class="size-1.5 animate-blink rounded-full bg-primary" />
            {{ t('home.kicker') }}
          </span>
          <h1 class="mt-6 text-5xl leading-[0.95] font-bold tracking-tighter text-highlighted sm:text-7xl">
            <span class="rise inline-block" style="--rise: 1"
              ><span class="glow-primary inline-block"
                ><span class="led ignite inline-block font-mono text-[0.8em] font-extrabold tracking-normal">{{
                  t('home.title')
                }}</span></span
              ></span
            ><br />
            <span class="rise lucky-flow inline-block" style="--rise: 2">{{ t('home.titleEnd') }}</span>
          </h1>
          <p class="rise mt-6 max-w-xl text-lg text-pretty text-muted" style="--rise: 3">{{ t('home.lead') }}</p>
          <div class="rise mt-8 flex flex-wrap gap-x-4 gap-y-3" style="--rise: 4">
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
          <!-- The board keeps its height while the pots load. -->
          <div class="rise mt-10 max-w-md min-h-[13.25rem]" style="--rise: 5">
            <ClientOnly>
              <LazyLandingJackpots />
            </ClientOnly>
          </div>
        </div>

        <!-- The solar dial: today as a 24-hour ring, with the corona behind it. -->
        <div class="dial-rise relative mx-auto w-full max-w-[34rem]">
          <div ref="dial" class="dial-stage relative" data-dial>
            <div aria-hidden="true" class="corona-layer absolute inset-x-0 top-0 -z-10 aspect-square">
              <LandingCorona v-if="!orrery" class="absolute -top-[45%] -left-[45%] size-[190%]" />
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
      </UContainer>
    </section>

    <div class="dark relative z-10 min-h-[2.625rem]">
      <ClientOnly>
        <LazyLandingLiveTicker />
        <template #fallback>
          <LandingTicker />
        </template>
      </ClientOnly>
    </div>

    <!-- 01 · The games, as live tickets. -->
    <section id="games" data-beat="games" class="py-20 sm:py-28">
      <UContainer>
        <LandingSectionHead
          index="01"
          :tag="t('games.tag')"
          :title="t('games.title')"
          :description="t('games.description', { max })"
        />
        <div class="reveal-stagger grid gap-6 lg:grid-cols-2">
          <div v-for="(kind, i) in machines" :key="kind" :class="i === 0 ? 'lg:col-span-2' : ''" :style="{ '--i': i }">
            <LandingMachine :kind="kind" :big="i === 0" />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- 02 · How it works: the day, the four steps, and a practice draw. -->
    <section id="how-it-works" class="py-20 sm:py-28">
      <UContainer>
        <LandingSectionHead
          index="02"
          :tag="t('home.how.tag')"
          :title="t('home.how.title')"
          :description="t('home.how.description')"
        />
        <div class="reveal">
          <!-- The day, from the round opening to the draw. A clock: it runs left to right in every language. -->
          <div class="relative mb-12 hidden h-px sm:block" dir="ltr" aria-hidden="true">
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
          <ol class="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <li v-for="(step, index) in steps" :key="step.id" class="group relative" :style="{ '--i': index }">
              <div class="flex items-center gap-4">
                <span
                  class="step-number led font-mono text-5xl leading-none font-extrabold text-primary transition-[filter] duration-500 group-hover:drop-shadow-[0_0_14px_var(--ui-primary)]"
                  dir="ltr"
                  >0{{ index + 1 }}</span
                >
                <span
                  class="grid size-9 place-items-center rounded-full bg-secondary/10 text-secondary ring ring-secondary/30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                >
                  <UIcon :name="step.icon" class="size-4" />
                </span>
              </div>
              <h3 class="mt-5 text-lg font-semibold text-highlighted">{{ t(`home.how.steps.${step.id}.title`) }}</h3>
              <p class="mt-2 text-sm text-pretty text-muted">
                {{ t(`home.how.steps.${step.id}.description`, { max }) }}
              </p>
              <p class="mt-4 font-mono text-[0.65rem] tracking-widest text-dimmed uppercase">
                {{ t(`home.how.steps.${step.id}.when`) }}
              </p>
            </li>
          </ol>
        </div>
        <!-- The practice draw keeps one height while its chunk and today's tickets load. -->
        <div data-beat="practice" class="reveal mt-16 min-h-[38rem] sm:min-h-[33rem] lg:min-h-[29rem]">
          <ClientOnly>
            <LazyLandingPractice />
          </ClientOnly>
        </div>
      </UContainer>
    </section>

    <!-- The winner's 80%. -->
    <section data-beat="split">
      <LandingSplit />
    </section>

    <!-- 03 · Winners, straight from the program's accounts. -->
    <section id="winners" data-beat="winners" class="py-20 sm:py-28">
      <UContainer>
        <LandingSectionHead
          index="03"
          :tag="t('home.winners.tag')"
          :title="t('home.winners.title')"
          :description="t('home.winners.description')"
        />
        <LandingWinners />
      </UContainer>
    </section>

    <!-- 04 · Fairness: the rules the program enforces, and the last draw's receipt. -->
    <section id="fairness" data-beat="fairness" class="py-20 sm:py-28">
      <UContainer>
        <LandingSectionHead
          index="04"
          :tag="t('home.fairness.tag')"
          :title="t('home.fairness.title')"
          :description="t('home.fairness.description')"
        />
        <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
          <ol class="reveal-stagger grid gap-4 sm:grid-cols-2">
            <li
              v-for="(rule, index) in fairness"
              :key="rule.id"
              class="rule group relative rounded-(--ui-radius) bg-default/80 p-5 ring ring-default backdrop-blur-md transition hover:ring-primary/40"
              :style="{ '--i': index % 2 }"
            >
              <div class="flex items-center justify-between">
                <span
                  class="grid size-10 place-items-center rounded-full bg-primary/10 text-primary ring ring-primary/30 transition-transform duration-500 group-hover:scale-110"
                >
                  <UIcon :name="rule.icon" class="size-5" />
                </span>
                <span class="font-mono text-xs font-semibold text-secondary">§{{ index + 1 }}</span>
              </div>
              <h3 class="mt-4 font-semibold text-highlighted">{{ t(`home.fairness.rules.${rule.id}.title`) }}</h3>
              <p class="mt-1.5 text-sm text-pretty text-muted">{{ t(`home.fairness.rules.${rule.id}.description`) }}</p>
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
      </UContainer>
    </section>

    <!-- 05 · Questions. -->
    <section id="faq" data-beat="faq" class="py-20 sm:py-28">
      <UContainer class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
        <div class="lg:sticky lg:top-24">
          <LandingSectionHead
            index="05"
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
          class="reveal rounded-(--ui-radius) bg-default/80 px-5 ring ring-default backdrop-blur-md sm:px-6"
          :ui="{
            trigger: 'py-5 text-base text-highlighted hover:text-primary',
            trailingIcon: 'text-secondary transition-transform duration-300',
            body: 'text-pretty text-muted',
          }"
        />
      </UContainer>
    </section>

    <!-- Midnight: the sun eclipsed, its corona turning around the disc and a bead of light running round its rim. -->
    <section data-beat="finale" class="finale dark relative overflow-hidden">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 bg-default">
        <div class="bg-dots absolute inset-0 mask-[radial-gradient(circle_at_center,black,transparent_70%)]" />
        <div class="eclipse-wrap absolute top-1/2 left-1/2 size-[26rem] -translate-1/2 sm:size-[40rem]">
          <div
            class="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(var(--ui-color-primary-400),transparent_18%,var(--ui-color-primary-700)_34%,transparent_50%,var(--ui-color-primary-500)_64%,var(--ui-secondary)_69%,transparent_76%,var(--ui-color-primary-400))] opacity-60 blur-2xl"
          />
          <div class="eclipse absolute inset-[11%] rounded-full bg-default" data-eclipse />
          <div class="absolute inset-[11%] rounded-full ring-1 ring-primary/70" />
          <div class="bead-orbit absolute inset-[11%]">
            <span class="bead" />
          </div>
        </div>
      </div>
      <UContainer class="reveal relative py-36 text-center sm:py-48">
        <p class="kicker text-secondary">00:00 UTC · {{ t('home.how.draw') }}</p>
        <h2 class="mx-auto mt-4 max-w-xl text-4xl font-bold tracking-tighter text-balance text-highlighted sm:text-6xl">
          {{ t('home.cta.title') }}
        </h2>
        <p class="mx-auto mt-4 max-w-md text-lg text-pretty text-muted">{{ t('home.cta.description') }}</p>
        <div class="mt-10 min-h-24">
          <ClientOnly>
            <LazyLandingFinaleLive />
          </ClientOnly>
        </div>
        <UButton
          :label="t('home.playNow')"
          :to="localePath('/play')"
          size="xl"
          icon="i-lucide-ticket"
          class="bg-lucky shadow-neon shine mt-10 font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:opacity-90"
        />
      </UContainer>
      <!-- The night sky running down into the city at the foot of the page. -->
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-(--ui-bg)" />
    </section>
  </div>
</template>

<style scoped>
/*
 * While the 3D orrery runs, it draws the sun, the day's arc, the tickets and
 * the eclipse. The dial's face and words stay on the page, fading as the
 * orrery leaves the hero; the 2D layers it replaces go.
 */
.landing[data-orrery] :deep(.orrery-2d),
.landing[data-orrery] .eclipse-wrap {
  opacity: 0;
}

.landing[data-orrery] .dial-tilt {
  opacity: var(--orrery-face, 1);
}

.landing[data-orrery] :deep(.orrery-veil) {
  fill: color-mix(in oklab, var(--ui-bg) 20%, transparent);
}

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
