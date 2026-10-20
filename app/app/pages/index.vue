<script setup lang="ts">
useSeoMeta({
  title: 'S☉Lucky: the daily lottery on Solana',
  ogTitle: 'S☉Lucky: the daily lottery on Solana',
  description:
    'Pick a number, buy a ticket, and win the whole pot at midnight UTC. Every ticket, pot and draw lives on Solana and can be checked by anyone.',
});

const config = useRuntimeConfig().public;

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
      headline="Daily lottery on Solana"
      :links="[
        {
          label: 'Play now',
          to: '/play',
          size: 'xl',
          icon: 'i-lucide-ticket',
          class: 'bg-lucky text-white hover:opacity-90',
        },
        {
          label: 'How it works',
          to: '#how-it-works',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle',
          trailingIcon: 'i-lucide-arrow-down',
        },
      ]"
    >
      <template #title>
        Pick a number.<br />
        <span class="text-lucky">Win the pot at midnight.</span>
      </template>
      <template #description>
        One draw a day, one winner, the whole pot. Every ticket, every lamport and every draw lives on Solana, where
        anyone can check it.
      </template>
      <ClientOnly>
        <LotteryLiveCard />
        <template #fallback>
          <USkeleton class="mx-auto h-96 w-full max-w-sm" />
        </template>
      </ClientOnly>
    </UPageHero>

    <UPageSection
      id="how-it-works"
      headline="How it works"
      title="Four steps, one draw a day"
      description="Rounds follow the UTC calendar: a new one opens at 00:00 UTC and is drawn right after the next midnight."
      :features="steps"
      :ui="{ features: 'lg:grid-cols-4' }"
    />

    <UPageSection
      id="fairness"
      headline="Fairness"
      title="Don’t trust us. Check."
      description="S☉Lucky is a Solana program, not a server holding your money. These rules are enforced by its code."
      :features="fairness"
    />

    <UPageSection id="faq" headline="FAQ" title="Questions">
      <UAccordion :items="faq" type="multiple" class="mx-auto w-full max-w-3xl" />
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Today’s pot is waiting"
        description="Pick a number nobody has taken yet. Good luck!"
        variant="subtle"
        :links="[
          {
            label: 'Play now',
            to: '/play',
            size: 'xl',
            icon: 'i-lucide-ticket',
            class: 'bg-lucky text-white hover:opacity-90',
          },
          {
            label: 'Read the code',
            to: config.githubUrl,
            target: '_blank',
            size: 'xl',
            color: 'neutral',
            variant: 'subtle',
            icon: 'i-simple-icons-github',
          },
        ]"
      />
    </UPageSection>
  </div>
</template>
