<script setup lang="ts">
useSeoMeta({
  title: 'S☉Lucky: the daily lottery on Solana',
  ogTitle: 'S☉Lucky: the daily lottery on Solana',
  description:
    'Pick a number, buy a ticket, and win the whole pot at midnight UTC. Every ticket, pot and draw lives on Solana and can be checked by anyone.',
});

const config = useRuntimeConfig().public;
const { explorer, programAddress, clusterLabel } = useSolana();

const steps = [
  {
    title: 'Connect a wallet',
    description: 'Phantom, Solflare, Backpack or any wallet that speaks the Wallet Standard. No account, no email.',
    icon: 'i-lucide-wallet',
    when: 'Any time',
  },
  {
    title: 'Pick your number',
    description: 'Any number from 0 to 1 000 000 000. Each number can be held by one ticket per day, so be quick.',
    icon: 'i-lucide-hash',
    when: 'Until midnight UTC',
  },
  {
    title: 'Watch the pot grow',
    description:
      'Every ticket adds its price to the pot, held by the round’s own account on Solana. Nobody else can move it.',
    icon: 'i-lucide-trending-up',
    when: 'All day',
  },
  {
    title: 'Win at midnight UTC',
    description:
      'One ticket wins the whole pot, minus a small house fee. More tickets, better odds: every ticket counts once.',
    icon: 'i-lucide-trophy',
    when: 'Right after midnight UTC',
  },
];

const fairness = [
  {
    title: 'The pot is locked in the program',
    description:
      'Ticket money goes straight to the round’s account. The program only ever pays it to the winning ticket’s owner, and the fee to the treasury. The operator cannot withdraw it.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'A draw nobody can predict',
    description:
      'Every purchase is mixed into the round’s entropy. When the day ends, the round pins a slot a few seconds in the future; that slot’s hash, unknown to everyone until then, picks the winner.',
    icon: 'i-lucide-dices',
  },
  {
    title: 'Anyone can run it',
    description:
      'Closing, drawing and paying out are open to everyone. If the operator vanished tomorrow, any player could still finish every round.',
    icon: 'i-lucide-users',
  },
  {
    title: 'Checkable in your browser',
    description:
      'Each round page recomputes the draw from public data: the entropy, the slot hash and the winning index. Same inputs, same winner.',
    icon: 'i-lucide-search-check',
  },
  {
    title: 'Hard limits on the house',
    description:
      'The program caps the fee at 10%. Price and fee changes only apply to the next day’s round, and a buyer never pays more than the price they were shown.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Open source',
    description: 'The program, the app and the operator scripts are public, with tests for every rule.',
    icon: 'i-lucide-code',
  },
];

const faq = [
  {
    label: 'Is this real money?',
    content:
      'The public app runs on Solana devnet, where SOL is free test money from faucet.solana.com. The program works the same on mainnet, but running a real-money lottery needs the right licences where you operate.',
  },
  {
    label: 'How much does a ticket cost?',
    content:
      'The price is set on-chain and shown on the Play page. Besides the price, a ticket account holds a small rent deposit that you get back by closing the ticket once the round is paid. The first ticket of the day also pays the rent of the round’s account, which stays on-chain as its public record.',
  },
  {
    label: 'How are my odds calculated?',
    content:
      'Every ticket has the same chance: your tickets divided by all tickets sold that day. The number you pick is your label on the board; it does not change your odds.',
  },
  {
    label: 'What if nobody draws the round?',
    content:
      'A small bot (the crank) closes, draws and pays every round within seconds of midnight, and anyone can do the same from the History panel. If the pinned slot ever becomes too old to read (about three minutes), the round can be closed again to pin a fresh one; the program only allows that once the old slot is provably out of reach.',
  },
  {
    label: 'Why do you show my country?',
    content:
      'S☉Lucky has always shown a flag next to each ticket. We suggest your country from your host connection, without any third-party lookup, and you can change it or keep it private before buying. It is stored on-chain with your ticket.',
  },
  {
    label: 'Can a validator cheat the draw?',
    content:
      'Players cannot: the winning hash does not exist when sales close. The validator that produces the pinned slot could bias it, by choosing what goes in that block or by skipping it. That is acceptable for a test-money game; for real-money pots, the draw should use a verifiable randomness oracle, and the README explains where to plug one in.',
  },
];
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
          Daily lottery on Solana
        </span>
      </template>
      <template #title>
        <span class="glow-primary inline-block"
          ><span class="led inline-block font-mono text-[0.8em] font-extrabold tracking-normal"
            >Pick a number.</span
          ></span
        ><br />
        <span class="text-lucky">Win the pot at midnight.</span>
      </template>
      <template #description>
        One draw a day, one winner, the whole pot. Every ticket, every lamport and every draw lives on Solana, where
        anyone can check it.
      </template>
      <template #footer>
        <div class="flex flex-wrap gap-x-4 gap-y-3">
          <UButton
            label="Play now"
            to="/play"
            size="xl"
            icon="i-lucide-ticket"
            class="bg-lucky shadow-neon shine font-semibold tracking-wide text-white hover:opacity-90"
          />
          <UButton
            label="How it works"
            to="#how-it-works"
            size="xl"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-down"
          />
        </div>
        <dl class="mt-10 grid max-w-md grid-cols-3 gap-4 border-l-2 border-secondary/70 ps-4">
          <div>
            <dt class="kicker text-[0.65rem]">Program</dt>
            <dd class="mt-1 font-mono text-xs">
              <ULink :to="explorer('address', programAddress)" target="_blank" class="text-toned hover:text-primary">
                {{ shortAddress(programAddress) }}
              </ULink>
            </dd>
          </div>
          <div>
            <dt class="kicker text-[0.65rem]">Cluster</dt>
            <dd class="mt-1 font-mono text-xs text-toned">{{ clusterLabel }}</dd>
          </div>
          <div>
            <dt class="kicker text-[0.65rem]">Draw</dt>
            <dd class="mt-1 font-mono text-xs text-toned">00:00 UTC</dd>
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
          Each dot is one of today’s tickets: around the dial by the time it was bought, outwards by its number.
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
      id="how-it-works"
      title="Four steps, one draw a day"
      description="Rounds follow the UTC calendar: a new one opens at 00:00 UTC and is drawn right after the next midnight."
    >
      <template #headline>
        <LandingSectionTag index="01" label="How it works" />
      </template>
      <div class="reveal">
        <!-- The day, from the round opening to the draw. -->
        <div
          class="relative mb-14 hidden h-px bg-linear-to-r from-primary/20 via-primary to-secondary sm:block"
          aria-hidden="true"
        >
          <span class="absolute -top-6 left-0 font-mono text-[0.65rem] tracking-widest text-muted">
            00:00 UTC · ROUND OPENS
          </span>
          <span class="absolute -top-6 right-0 font-mono text-[0.65rem] tracking-widest text-secondary">
            24:00 UTC · DRAW
          </span>
          <ClientOnly>
            <LazyLandingDayNow />
          </ClientOnly>
        </div>
        <ol
          class="grid gap-px overflow-hidden rounded-(--ui-radius) border border-default bg-(--ui-border) sm:grid-cols-2 lg:grid-cols-4"
        >
          <li v-for="(step, index) in steps" :key="step.title" class="group relative bg-default p-6 sm:p-8">
            <span
              aria-hidden="true"
              class="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-lucky transition-transform duration-500 group-hover:scale-x-100"
            />
            <div class="flex items-start justify-between">
              <span class="led font-mono text-6xl leading-none font-extrabold text-primary">0{{ index + 1 }}</span>
              <UIcon :name="step.icon" class="size-5 text-secondary" />
            </div>
            <h3 class="mt-8 text-lg font-semibold text-highlighted">{{ step.title }}</h3>
            <p class="mt-2 text-sm text-pretty text-muted">{{ step.description }}</p>
            <p class="mt-6 font-mono text-[0.65rem] tracking-widest text-dimmed uppercase">{{ step.when }}</p>
          </li>
        </ol>
      </div>
    </UPageSection>

    <UPageSection
      id="fairness"
      title="Don’t trust us. Check."
      description="S☉Lucky is a Solana program, not a server holding your money. These rules are enforced by its code."
    >
      <template #headline>
        <LandingSectionTag index="02" label="Fairness" />
      </template>
      <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <ol class="border-t border-default">
          <li
            v-for="(rule, index) in fairness"
            :key="rule.title"
            class="reveal grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-default py-6"
          >
            <span class="pt-0.5 font-mono text-xs font-semibold text-secondary">§{{ index + 1 }}</span>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-highlighted">
                <UIcon :name="rule.icon" class="size-4 shrink-0 text-primary" />
                {{ rule.title }}
              </h3>
              <p class="mt-1.5 text-pretty text-muted">{{ rule.description }}</p>
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
      title="Questions"
      description="Still unsure? The program, the app and the operator scripts are open source."
      :links="[
        {
          label: 'Read the code',
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
        <LandingSectionTag index="03" label="FAQ" />
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
        title="Today’s pot is waiting"
        description="Pick a number nobody has taken yet. Good luck!"
        variant="naked"
        class="dark reveal bg-default"
        :ui="{ container: 'py-32 sm:py-40 lg:py-40' }"
        :links="[
          {
            label: 'Play now',
            to: '/play',
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
