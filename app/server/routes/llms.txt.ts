import { SOLUCKY_PROGRAM_ADDRESS } from '@solucky/client';

const CLUSTERS: Record<string, { label: string; query: string }> = {
  mainnet: { label: 'Mainnet', query: '' },
  devnet: { label: 'Devnet', query: '?cluster=devnet' },
  testnet: { label: 'Testnet', query: '?cluster=testnet' },
  localnet: { label: 'Localnet', query: '?cluster=custom' },
};

/** llms.txt: the site summarised in Markdown for AI assistants (server/utils/seo.ts). */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event).public;
  const cluster = CLUSTERS[config.cluster] ?? CLUSTERS.devnet!;
  setResponseHeaders(event, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  });
  return llmsTxt({
    origin: siteOrigin(event),
    cluster: config.cluster,
    clusterLabel: cluster.label,
    explorerQuery: cluster.query,
    programAddress: config.programId || SOLUCKY_PROGRAM_ADDRESS,
    // Kept equal to the on-chain config's (SOLUCKY_MAX_NUMBER), which decides.
    maxNumber: Number(config.maxNumber),
    githubUrl: config.githubUrl,
  });
});
