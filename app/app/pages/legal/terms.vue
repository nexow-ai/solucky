<script setup lang="ts">
const config = useRuntimeConfig().public;
const { isMainnet, clusterLabel } = useSolana();

const sections = [
  { id: 'agreement', label: 'These terms' },
  { id: 'eligibility', label: 'Who can play' },
  { id: 'money', label: 'Test SOL and real SOL' },
  { id: 'rounds', label: 'How a round works' },
  { id: 'wallet', label: 'Your wallet and transactions' },
  { id: 'operator', label: 'What the operator can and cannot do' },
  { id: 'risks', label: 'Risks' },
  { id: 'use', label: 'Using the site fairly' },
  { id: 'liability', label: 'No warranty' },
  { id: 'open-source', label: 'Open source' },
  { id: 'changes', label: 'Changes' },
  { id: 'contact', label: 'Contact' },
];
</script>

<template>
  <LegalPage
    title="Terms of Service"
    description="The rules for using S☉Lucky, and what its program does and does not promise."
    :sections="sections"
  >
    <h2 id="agreement">These terms</h2>
    <p>
      These terms apply when you use the S☉Lucky website and app, run by {{ OPERATOR.name }} ("we", "us"). By using
      it, you accept them, along with the <NuxtLink to="/legal/privacy">Privacy Policy</NuxtLink> and the
      <NuxtLink to="/legal/cookies">Cookies &amp; storage</NuxtLink> page. If you do not accept them, do not use the
      site.
    </p>
    <p>
      The game itself is a Solana program: open source software that runs on the Solana network, not on our servers.
      The site is one way to use it; anyone can also use the program directly.
    </p>

    <h2 id="eligibility">Who can play</h2>
    <ul>
      <li>You must be 18 or older.</li>
      <li>
        You may only play where lotteries and online games of chance are legal for you. Checking that is your
        responsibility; we do not check where you are.
      </li>
      <li>Do not play for someone else, or with SOL that is not yours.</li>
    </ul>

    <h2 id="money">Test SOL and real SOL</h2>
    <p v-if="!isMainnet">
      This site runs on <strong>Solana {{ clusterLabel }}</strong
      >. Tickets cost test SOL, which is free from a faucet and has no value: it cannot be exchanged for real money,
      and neither can anything you win with it.
    </p>
    <p v-else>
      This site runs on <strong>Solana Mainnet</strong>. Tickets cost real SOL, and pots are paid in real SOL.
    </p>

    <h2 id="rounds">How a round works</h2>
    <p>The program enforces these rules; the site only shows them:</p>
    <ul>
      <li>One round runs per UTC day, from 00:00 UTC to the next midnight.</li>
      <li>
        A ticket is one number, from 0 to the highest number set in the program's configuration. Each number can be
        held by one ticket per round.
      </li>
      <li>
        The ticket price and the house fee are copied from the configuration when a round opens, and stay fixed for
        that round. The fee can never be more than 10% of the pot. When you buy, you never pay more than the price you
        were shown.
      </li>
      <li>
        Every ticket's price goes into the round's pot, held by the round's own account on Solana. Each ticket has the
        same chance: your chance is your tickets divided by all the tickets sold in that round. The number you pick does
        not change it.
      </li>
      <li>
        After midnight, anyone can close the round, draw it and pay it. The winning ticket's owner receives the pot
        minus the house fee, and the fee goes to the treasury.
      </li>
      <li>
        A ticket account also holds a small rent deposit, which you get back by closing the ticket once its round is
        paid. The first ticket of a round also pays the rent of the round's account, which stays on Solana as the
        round's public record.
      </li>
    </ul>

    <h2 id="wallet">Your wallet and transactions</h2>
    <ul>
      <li>
        You play with your own wallet. We never hold your keys, your SOL or your tickets, and we cannot move them.
      </li>
      <li>
        You sign every transaction yourself, and you pay Solana's network fees. Confirmed transactions are final: we
        cannot cancel, reverse or refund them.
      </li>
      <li>
        A ticket's number, its owner's address and the country flag you choose for it are public on Solana for good.
        The <NuxtLink to="/legal/privacy">Privacy Policy</NuxtLink> explains what that means.
      </li>
      <li>Keep your wallet's keys safe. Nobody, including us, can recover them for you.</li>
    </ul>

    <h2 id="operator">What the operator can and cannot do</h2>
    <p>The program's configuration has an authority, which can:</p>
    <ul>
      <li>
        change the ticket price (at least ◎0.001) and the house fee (at most 10%), effective from the next round to
        open;
      </li>
      <li>pause and resume ticket sales. A pause stops new tickets only: rounds already played can still be drawn and paid;</li>
      <li>change the treasury, the highest number, and the authority itself.</li>
    </ul>
    <p>
      The program's code does not let the authority, or anyone else, take a round's pot or send it anywhere but to the
      winning ticket's owner, take more than the fee, or charge a buyer more than the price they were shown.
    </p>
    <p>
      The program is upgradeable: whoever holds its upgrade authority could deploy different code, so you are trusting
      them until the program is made immutable or handed to a multisig. The source of every version is public, and a
      deployed program can be checked against it as the README's "Verifiable builds" section explains.
    </p>

    <h2 id="risks">Risks</h2>
    <p>By playing, you accept that:</p>
    <ul>
      <li>
        software can have bugs, including the program, the app and your wallet, and a bug could cost you your tickets
        or your SOL;
      </li>
      <li>
        Solana or the RPC endpoint the site uses can be slow, congested or down, and a transaction can fail or arrive
        after a round closes;
      </li>
      <li>
        the draw uses the hash of a Solana slot that nobody knows when sales close. Players cannot predict it, but the
        validator that produces that slot could bias it, and whoever closes a round could hold back an unfavourable
        draw until that slot can no longer be read. It is not a verifiable randomness oracle;
      </li>
      <li>the site can be unavailable at any time. The program, and your tickets, keep working without it;</li>
      <li>laws on lotteries and crypto-assets differ between countries and can change.</li>
    </ul>

    <h2 id="use">Using the site fairly</h2>
    <p>
      Do not attack or overload the site or its servers, try to get around their limits, interfere with other players,
      or use the site to break the law. We may block access from anyone who does.
    </p>

    <h2 id="liability">No warranty</h2>
    <p>
      The site and the program are provided "as is", without any warranty. To the extent the law allows, we are not
      liable for any loss that comes from using them, including lost tickets, failed or late transactions, bugs,
      network problems, or a draw you consider unfair. Nothing in these terms limits a liability that the law does not
      allow us to limit.
    </p>

    <h2 id="open-source">Open source</h2>
    <p>
      The program, the app and the operator scripts are open source under the MIT License: see the
      <a :href="config.githubUrl" target="_blank" rel="noopener">source repository</a>. That license covers the code;
      these terms cover using this site.
    </p>

    <h2 id="changes">Changes</h2>
    <p>
      We may update these terms. The date at the top shows the last change, and the version shown here applies from
      that date.
    </p>

    <h2 id="contact">Contact</h2>
    <p>
      Questions about these terms: <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a
      >.
    </p>
  </LegalPage>
</template>
