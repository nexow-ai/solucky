<script setup lang="ts">
const config = useRuntimeConfig().public;
const { explorer, programAddress, clusterLabel } = useSolana();

const sections = [
  { id: 'operator', label: 'Who runs S☉Lucky' },
  { id: 'software', label: 'The program and the site' },
  { id: 'documents', label: 'Documents' },
  { id: 'security', label: 'Reporting a security issue' },
  { id: 'license', label: 'Open source license' },
];

const documents = LEGAL_PAGES.filter((page) => page.to !== '/legal');
</script>

<template>
  <LegalPage
    title="Legal notice"
    description="Who runs S☉Lucky, how to reach us, and the documents that apply when you use it."
    :sections="sections"
  >
    <h2 id="operator">Who runs S☉Lucky</h2>
    <p>
      S☉Lucky is made and run by <strong>{{ OPERATOR.name }}</strong
      >. You can reach us by email at <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a> and learn more
      about us at <a :href="OPERATOR.site" target="_blank" rel="noopener">nexow.studio</a>.
    </p>

    <h2 id="software">The program and the site</h2>
    <p>S☉Lucky has two parts:</p>
    <ul>
      <li>
        <strong>The program</strong>, a Solana program that sells the tickets, holds each day's pot and pays the
        winner. This site uses the program at
        <a :href="explorer('address', programAddress)" target="_blank" rel="noopener"
          ><code>{{ programAddress }}</code></a
        >
        on Solana {{ clusterLabel }}. Anyone can use it directly, without this site.
      </li>
      <li>
        <strong>This site</strong>, which shows the program's public data and helps you send transactions from your
        own wallet. It never holds your keys or your SOL.
      </li>
    </ul>

    <h2 id="documents">Documents</h2>
    <p>Using the site means accepting these documents:</p>
    <ul>
      <li v-for="page in documents" :key="page.to">
        <NuxtLink :to="page.to">{{ page.label }}</NuxtLink>: {{ page.description }}
      </li>
    </ul>

    <h2 id="security">Reporting a security issue</h2>
    <p>
      Please do not open a public issue. Email <a :href="`mailto:${OPERATOR.email}`">{{ OPERATOR.email }}</a> with
      the subject <code>Security report: solucky</code>, and never test against other players' funds: use devnet or
      a local validator. The security policy, <code>SECURITY.md</code> in the
      <a :href="config.githubUrl" target="_blank" rel="noopener">source repository</a>, explains what to include and
      what is in scope.
    </p>

    <h2 id="license">Open source license</h2>
    <p>
      The program, the app and the operator scripts are open source under the MIT License (<code>LICENSE</code> in the
      <a :href="config.githubUrl" target="_blank" rel="noopener">source repository</a>), © 2022–{{
        new Date().getFullYear()
      }}
      {{ OPERATOR.name }}. The license covers the code; the
      <NuxtLink to="/legal/terms">Terms of Service</NuxtLink> cover using this site.
    </p>
  </LegalPage>
</template>
