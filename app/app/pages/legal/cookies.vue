<script setup lang="ts">
const sections = [
  { id: 'cookies', label: 'No cookies' },
  { id: 'storage', label: 'What the app keeps in your browser' },
  { id: 'clear', label: 'Removing it' },
  { id: 'banner', label: 'Why there is no cookie banner' },
];

// Every key the app writes to local storage, and why.
const keys = [
  {
    key: 'nuxt-color-mode',
    holds: 'Your light or dark theme.',
    when: 'When you switch the theme.',
  },
  {
    key: 'solucky:wallet',
    holds: 'The name of the wallet you last connected and its address, so the app can reconnect it.',
    when: 'When you connect a wallet; removed when you disconnect it.',
  },
  {
    key: 'solucky:country',
    holds: 'The country flag you picked for your tickets, or that you keep it private.',
    when: 'When you pick a flag.',
  },
  {
    key: 'solucky:sound',
    holds: 'Whether sounds are on or off.',
    when: 'When you mute or unmute.',
  },
];
</script>

<template>
  <LegalPage
    title="Cookies & storage"
    description="No cookies, no trackers: the four settings the app keeps in your browser, and how to remove them."
    :sections="sections"
  >
    <h2 id="cookies">No cookies</h2>
    <p>
      S☉Lucky sets no cookies, and it loads no analytics, advertising or tracking scripts. The site's security policy
      only allows scripts from its own domain.
    </p>
    <p>
      Our host, Cloudflare, can set strictly necessary security cookies, such as <code>__cf_bm</code>, when its bot
      protection is on. Cloudflare uses them to tell people from bots, as its
      <a href="https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/" target="_blank" rel="noopener">cookie list</a>
      explains.
    </p>

    <h2 id="storage">What the app keeps in your browser</h2>
    <p>
      The app saves a few settings in your browser's local storage, so they are still there next time. They stay on
      your device: the app never sends them to our server. The flag you pick only leaves your browser when you choose to:
      on a ticket you buy, and on the Play page's live table.
    </p>
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>What it holds</th>
          <th>Saved</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in keys" :key="row.key">
          <td><code>{{ row.key }}</code></td>
          <td>{{ row.holds }}</td>
          <td>{{ row.when }}</td>
        </tr>
      </tbody>
    </table>
    <p>Your wallet extension keeps its own data, under its maker's policy.</p>

    <h2 id="clear">Removing it</h2>
    <ul>
      <li>Disconnect your wallet in the app to remove <code>solucky:wallet</code>.</li>
      <li>Clear this site's data in your browser's settings to remove all of them.</li>
      <li>In a private window, they are deleted when you close it.</li>
    </ul>
    <p>Removing them only resets these settings; your tickets are on Solana and stay yours.</p>

    <h2 id="banner">Why there is no cookie banner</h2>
    <p>
      Nothing here tracks you, and every setting above exists because you set it. So there is nothing to accept or
      refuse.
    </p>
  </LegalPage>
</template>
