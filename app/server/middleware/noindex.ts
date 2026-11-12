/**
 * Only the Mainnet site belongs in search results: the sites where tickets
 * cost test SOL (devnet.solucky.me) tell crawlers not to index any page, so
 * they never compete with it. See robots.txt (server/utils/seo.ts).
 */
export default defineEventHandler((event) => {
  if (useRuntimeConfig(event).public.cluster !== 'mainnet') setResponseHeader(event, 'X-Robots-Tag', 'noindex');
});
