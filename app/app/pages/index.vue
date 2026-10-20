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
  },
  {
    title: 'Pick your number',
    description: 'Any number from 0 to 1 000 000 000. Each number can be held by one ticket per day, so be quick.',
    icon: 'i-lucide-hash',
  },
  {
    title: 'Watch the pot grow',
    description:
      'Every ticket adds its price to the pot, held by the round’s own account on Solana. Nobody else can move it.',
    icon: 'i-lucide-trending-up',
  },
  {
    title: 'Win at midnight UTC',
    description:
      'One ticket wins the whole pot, minus a small house fee. More tickets, better odds: every ticket counts once.',
    icon: 'i-lucide-trophy',
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
        container: 'pt-14 pb-52 sm:pt-20 sm:pb-80 lg:pt-24 lg:pb-72',
        title: 'text-4xl sm:text-6xl',
      }"
    >
      <template #top>
        <LandingHeroScene />
      </template>

      <template #headline>
        <span
          class="kicker inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary ring ring-primary/40 backdrop-blur-sm"
        >
          <span class="size-1.5 animate-blink rounded-full bg-primary" />
          Daily lottery on Solana
        </span>
      </template>
      <template #title>
        Pick a number.<br />
        <span class="glitch text-lucky glow-primary" data-text="Win the pot at midnight.">Win the pot at midnight.</span>
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
            class="bg-lucky shadow-neon font-semibold tracking-wide text-white hover:opacity-90"
          />
          <UButton
            label="How it works"
            to="#how-it-works"
            size="xl"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-down"
            class="bg-default/40 backdrop-blur-sm"
          />
        </div>
        <dl class="mt-10 grid max-w-md grid-cols-3 gap-4 border-l-2 border-primary/60 ps-4">
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

      <ClientOnly>
        <LazyLotteryLiveCard />
        <template #fallback>
          <USkeleton class="mx-auto h-[30rem] w-full max-w-sm" />
        </template>
      </ClientOnly>
    </UPageHero>

    <div class="dark relative z-10">
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
      :ui="{ features: 'gap-4 lg:grid-cols-4' }"
    >
      <template #headline>
        <LandingSectionTag index="01" label="How it works" />
      </template>
      <template #features>
        <UPageCard
          v-for="(step, index) in steps"
          :key="step.title"
          as="li"
          :title="step.title"
          :description="step.description"
          variant="subtle"
          spotlight
          spotlight-color="primary"
          class="reveal"
          :ui="{ spotlight: 'hud-corners bg-default/85', leading: 'mb-6 flex w-full items-center justify-between' }"
        >
          <template #leading>
            <span class="text-lucky glow-primary font-display text-4xl font-black">0{{ index + 1 }}</span>
            <UIcon :name="step.icon" class="size-6 text-secondary" />
          </template>
        </UPageCard>
      </template>
    </UPageSection>

    <UPageSection
      id="fairness"
      title="Don’t trust us. Check."
      description="S☉Lucky is a Solana program, not a server holding your money. These rules are enforced by its code."
      :ui="{ features: 'gap-4' }"
    >
      <template #top>
        <img
          src="/images/circuit.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          class="pointer-events-none absolute inset-0 -z-10 size-full object-cover opacity-60 mask-[radial-gradient(ellipse_at_center,black_15%,transparent_72%)]"
        />
      </template>
      <template #headline>
        <LandingSectionTag index="02" label="Fairness" />
      </template>
      <template #features>
        <UPageCard
          v-for="rule in fairness"
          :key="rule.title"
          as="li"
          :title="rule.title"
          :description="rule.description"
          :icon="rule.icon"
          variant="subtle"
          spotlight
          spotlight-color="secondary"
          class="reveal"
          :ui="{
            spotlight: 'hud-corners bg-default/85 [--hud-color:var(--ui-secondary)]',
            leadingIcon: 'size-6 text-secondary glow-secondary',
          }"
        />
      </template>
    </UPageSection>

    <UPageSection id="faq" title="Questions">
      <template #headline>
        <LandingSectionTag index="03" label="FAQ" />
      </template>
      <div
        class="hud-corners reveal mx-auto w-full max-w-3xl rounded-(--ui-radius) bg-default/85 px-4 py-2 ring ring-default sm:px-6"
      >
        <UAccordion
          :items="faq"
          type="multiple"
          :ui="{ trigger: 'text-base text-highlighted hover:text-primary', trailingIcon: 'text-primary' }"
        />
      </div>
    </UPageSection>

    <UPageSection>
      <div class="reveal relative">
        <div aria-hidden="true" class="mask-ring absolute -inset-px overflow-hidden rounded-xl [--ring-width:1.5px]">
          <div
            class="absolute inset-[-60%] animate-spin-slow bg-[conic-gradient(var(--ui-primary),transparent_25%,transparent_50%,var(--ui-secondary),transparent_75%,transparent)]"
          />
        </div>
        <UPageCTA
          title="Today’s pot is waiting"
          description="Pick a number nobody has taken yet. Good luck!"
          variant="naked"
          class="dark bg-default"
          :ui="{ container: 'pt-16 pb-56 sm:pt-20 sm:pb-72 lg:pt-20 lg:pb-72' }"
          :links="[
            {
              label: 'Play now',
              to: '/play',
              size: 'xl',
              icon: 'i-lucide-ticket',
              class: 'bg-lucky shadow-neon font-semibold tracking-wide text-white hover:opacity-90',
            },
            {
              label: 'Read the code',
              to: config.githubUrl,
              target: '_blank',
              size: 'xl',
              color: 'neutral',
              variant: 'outline',
              icon: 'i-simple-icons-github',
              class: 'bg-default/40 backdrop-blur-sm',
            },
          ]"
        >
          <template #top>
            <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
              <div
                class="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_100%,color-mix(in_oklab,var(--ui-primary)_40%,transparent),transparent_70%)]"
              />
              <img
                src="/images/city-far.svg"
                alt=""
                loading="lazy"
                class="absolute inset-x-0 bottom-16 h-40 w-full object-cover object-bottom opacity-80 sm:h-56"
                width="1600"
                height="420"
              />
              <img
                src="/images/city-near.svg"
                alt=""
                loading="lazy"
                class="absolute inset-x-0 bottom-16 h-24 w-full object-cover object-bottom sm:h-36"
                width="1600"
                height="300"
              />
              <div class="absolute inset-x-0 bottom-16 h-px bg-primary shadow-[0_0_18px_3px_var(--ui-primary)]" />
              <div class="grid-floor absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-primary/15 to-default">
                <div><div /></div>
              </div>
              <div class="bg-scanlines absolute inset-0 opacity-50" />
            </div>
          </template>
        </UPageCTA>
      </div>
    </UPageSection>
  </div>
</template>
