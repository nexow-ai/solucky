<script setup lang="ts">
/**
 * The landing's 80% band: the winner's share of every pot as one giant
 * figure, and how the program splits a pot, with the daily lottery's fee as
 * set on-chain and today's pot as an example once they load.
 */
const { t } = useI18n();
const intl = useIntlLocale();
// The winner's share of a pot (`prizeFor`), and the rest the fee and the carry-over share.
const percent = computed(() => new Intl.NumberFormat(intl.value, { style: 'percent' }));
const figure = computed(() => percent.value.format(0.8));
const rest = computed(() => percent.value.format(0.2));
</script>

<template>
  <div class="relative isolate overflow-hidden border-y border-primary/25 bg-default/70 backdrop-blur-sm">
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_20%_50%,color-mix(in_oklab,var(--ui-primary)_22%,transparent),transparent_70%)]"
    />
    <UContainer class="grid items-center gap-8 py-16 sm:py-24 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
      <p class="reveal glow-primary text-center lg:text-start" aria-hidden="true">
        <span
          class="led lucky-flow inline-block font-mono text-[clamp(6rem,22vw,15rem)] leading-[0.85] font-extrabold tracking-tighter [--led-pitch:0.075em]"
          >{{ figure }}</span
        >
      </p>
      <div class="reveal space-y-6">
        <h2 class="text-3xl font-bold tracking-tighter text-balance text-highlighted sm:text-5xl">
          <span class="sr-only">{{ figure }}</span> {{ t('home.split.title') }}
        </h2>
        <p class="max-w-2xl text-pretty text-muted lg:text-lg">{{ t('home.split.lead', { rest }) }}</p>
        <ClientOnly>
          <LandingSplitLive />
          <template #fallback>
            <div class="h-24" />
          </template>
        </ClientOnly>
      </div>
    </UContainer>
  </div>
</template>
