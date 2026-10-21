<script setup lang="ts">
const config = useRuntimeConfig().public;
const { clusterLabel } = useSolana();

// Only the host: a provider's URL can carry an API key in its path or query.
const rpcHost = computed(() => {
  try {
    return config.rpcUrl ? new URL(config.rpcUrl).host : null;
  } catch {
    return null;
  }
});

const sections = [
  { id: 'summary', label: 'In short' },
  { id: 'on-chain', label: 'What is public on Solana' },
  { id: 'servers', label: 'What our servers see' },
  { id: 'third-parties', label: 'Services your browser uses' },
  { id: 'browser', label: 'What stays in your browser' },
  { id: 'purposes', label: 'Why, and what we never do' },
  { id: 'rights', label: 'Your choices and rights' },
  { id: 'children', label: 'Children' },
  { id: 'changes', label: 'Changes and contact' },
];
</script>

<template>
  <LegalPage
    title="Privacy Policy"
    description="What is public on Solana, what our servers see, and what we never collect."
    :sections="sections"
  >
    <h2 id="summary">In short</h2>
    <ul>
      <li>There is no account, email or sign-up. You play with a wallet.</li>
      <li>The site sets no cookies and loads no analytics, ads or trackers.</li>
      <li>We do not keep a database of players, and we do not sell or share data about you.</li>
      <li>Your tickets are public on Solana, by design: that is what lets anyone check the game.</li>
    </ul>
    <p>{{ OPERATOR.name }} runs the site and is responsible for the data it handles.</p>

    <h2 id="on-chain">What is public on Solana</h2>
    <p>When you buy a ticket, the transaction and the ticket's account record, publicly:</p>
    <ul>
      <li>your wallet address, and the transactions it signs;</li>
      <li>the number you picked, the round and the time of purchase;</li>
      <li>the country flag you chose for the ticket, or none if you keep it private.</li>
    </ul>
    <p>
      When a round is drawn, its account also records the winner's address, the winning number and its flag, and the
      payout. Solana is a public ledger: anyone can read this data, many people keep copies of it, and it stays there
      for good. Closing a ticket deletes its account and returns its rent, but the transactions that created and closed
      it remain in the ledger. Neither we nor anyone else can change or delete it.
    </p>
    <p>
      A wallet address is not your name, but it can be linked to you, for example through an exchange you used. Use a
      separate wallet if you want to keep your play apart from the rest of your activity.
    </p>

    <h2 id="servers">What our servers see</h2>
    <h3>Every visit</h3>
    <p>
      The site is hosted on Cloudflare. Like any website, it receives your IP address, your browser's user agent and the
      pages you request, to deliver them and protect the site from abuse. Cloudflare keeps operational logs for a
      limited time under its
      <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">own privacy policy</a>. We use
      them only to run and fix the site.
    </p>
    <h3>Your country</h3>
    <p>
      Cloudflare tells our server which country each request comes from. The app asks for it once, to suggest the flag
      for your tickets; you can change it or keep it private before buying. The server reads only the country, not your
      IP address, and does not keep it.
    </p>
    <h3>The live table on the Play page</h3>
    <p>
      While the Play page is open, your browser keeps a connection to our server so players can see who else is there.
      It shares three things with the other people on the page: a random id for that connection only, the flag your
      tickets show (none if you keep your country private), and whether you are entering a number, never the number
      itself. No wallet address or IP address goes into it, and nothing about the connection is stored or kept after it
      closes.
    </p>
    <h3>The SOL price</h3>
    <p>
      To show pots in dollars, our server fetches the SOL price from Coinbase, or from CoinGecko if Coinbase does not
      answer, and caches it for a minute. These requests come from our server and carry nothing about you.
    </p>

    <h2 id="third-parties">Services your browser uses</h2>
    <ul>
      <li>
        <strong>A Solana RPC endpoint</strong>, which the app reads the game from and sends your transactions through:
        <template v-if="rpcHost"><code>{{ rpcHost }}</code> on this site</template
        ><template v-else>Solana's public endpoint for {{ clusterLabel }}</template>. It receives your IP address and
        the accounts the app looks up, including your wallet's once you connect it, under its operator's policy.
      </li>
      <li>
        <strong>Your wallet</strong>, such as Phantom, Solflare or Backpack, which is software from its own maker, with
        its own policy. The site only asks it to connect and to sign the transactions you approve.
      </li>
      <li>
        <strong>Links you open</strong>: Solana Explorer, the Solana faucet, GitHub and our social accounts are other
        sites, with their own policies.
      </li>
    </ul>
    <p>Fonts, sounds and images come from our own domain, so loading the site does not contact anyone else.</p>

    <h2 id="browser">What stays in your browser</h2>
    <p>
      The app keeps four settings in your browser's local storage: your theme, your last wallet, your country choice and
      the sound setting. The <NuxtLink to="/legal/cookies">Cookies &amp; storage</NuxtLink> page lists them.
    </p>

    <h2 id="purposes">Why, and what we never do</h2>
    <p>
      We handle the data above only to show the site, run the game you ask to play, keep the site secure and fix
      problems. We do not build profiles, show ads, sell data or share it with advertisers.
    </p>

    <h2 id="rights">Your choices and rights</h2>
    <ul>
      <li>You can play without a country flag: choose to keep it private before buying.</li>
      <li>You can clear the settings in your browser at any time, and use a new wallet whenever you like.</li>
      <li>
        Depending on where you live, you may have the right to access, correct or delete personal data about you, or to
        object to how it is used. Email <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a> and we will
        answer. We hold almost nothing about you, and we cannot change or delete what is on Solana.
      </li>
    </ul>

    <h2 id="children">Children</h2>
    <p>S☉Lucky is for people aged 18 and over. We do not knowingly handle data about anyone younger.</p>

    <h2 id="changes">Changes and contact</h2>
    <p>
      We will update this page when the site changes how it handles data; the date at the top shows the last change.
      Questions: <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a
      >.
    </p>
  </LegalPage>
</template>
