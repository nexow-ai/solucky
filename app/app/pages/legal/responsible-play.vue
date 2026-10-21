<script setup lang="ts">
const { isMainnet, clusterLabel } = useSolana();

const sections = [
  { id: 'basics', label: 'Before you play' },
  { id: 'odds', label: 'Know the odds' },
  { id: 'final', label: 'Tickets are final' },
  { id: 'habits', label: 'Keep it fun' },
  { id: 'limits', label: 'Setting your own limits' },
  { id: 'help', label: 'Getting help' },
];

// Independent organisations, listed for information only.
const help = [
  {
    name: 'Gamblers Anonymous',
    url: 'https://www.gamblersanonymous.org',
    where: 'Worldwide: meetings and contacts by country.',
  },
  {
    name: 'National Council on Problem Gambling',
    url: 'https://www.ncpgambling.org',
    where: 'United States.',
  },
  { name: 'GamCare', url: 'https://www.gamcare.org.uk', where: 'United Kingdom.' },
  { name: 'BeGambleAware', url: 'https://www.begambleaware.org', where: 'United Kingdom.' },
];
</script>

<template>
  <LegalPage
    title="Responsible play"
    description="How the odds work, and where to get help if playing stops being fun."
    :sections="sections"
  >
    <h2 id="basics">Before you play</h2>
    <ul>
      <li>S☉Lucky is for people aged 18 and over, where lotteries are legal.</li>
      <li v-if="!isMainnet">
        This site runs on Solana {{ clusterLabel }}: tickets cost test SOL, which is free and has no value. It is a
        good way to see how the game works without spending anything.
      </li>
      <li v-else>This site runs on Solana Mainnet: tickets cost real SOL.</li>
      <li>Play for fun, never to make money or to win back money you lost.</li>
    </ul>

    <h2 id="odds">Know the odds</h2>
    <ul>
      <li>
        Every ticket has the same chance. Your chance of winning a round is your tickets divided by all the tickets
        sold in it.
      </li>
      <li>The number you pick is your label on the board. It does not change your chance.</li>
      <li>
        The winner receives the pot minus the house fee, which the program caps at 10%. So, taken over all players,
        tickets pay back the money spent on them minus that fee: on average, a ticket returns less than it costs.
      </li>
      <li>Nothing on the site changes these odds.</li>
    </ul>

    <h2 id="final">Tickets are final</h2>
    <p>
      A ticket cannot be cancelled or refunded once it is bought. The only thing you get back is its small rent
      deposit, by closing the ticket after its round is paid.
    </p>

    <h2 id="habits">Keep it fun</h2>
    <ul>
      <li>Decide in advance how much you are ready to lose, and stop when it is gone.</li>
      <li>Never chase losses, and never play with borrowed money or money you need.</li>
      <li>Do not play when you are upset, tired or have been drinking.</li>
      <li>Take breaks, and keep playing one part of your life among many.</li>
    </ul>

    <h2 id="limits">Setting your own limits</h2>
    <p>
      S☉Lucky has no accounts, so it cannot set limits or exclude you. You can set your own:
    </p>
    <ul>
      <li>Keep a separate wallet holding only what you are ready to spend.</li>
      <li>Use a website blocker or your device's parental controls to block the site.</li>
      <li>Tell someone you trust, and ask them to help you stick to your limits.</li>
    </ul>

    <h2 id="help">Getting help</h2>
    <p>
      If playing has stopped being fun, or someone close to you is worried about it, these independent organisations
      offer free and confidential help. We are not affiliated with them.
    </p>
    <ul>
      <li v-for="org in help" :key="org.url">
        <a :href="org.url" target="_blank" rel="noopener">{{ org.name }}</a
        >: {{ org.where }}
      </li>
    </ul>
    <p>If you or someone else is in immediate danger, call your local emergency number.</p>
  </LegalPage>
</template>
