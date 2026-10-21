/**
 * SOL/USD spot price for showing the pot in dollars. Public sources, no API
 * key, cached for a minute so visitors never hit the upstream APIs directly.
 */
const SOURCES: { name: string; url: string; read: (body: unknown) => number }[] = [
  {
    name: 'coinbase',
    url: 'https://api.coinbase.com/v2/prices/SOL-USD/spot',
    read: (body) => Number((body as { data: { amount: string } }).data.amount),
  },
  {
    name: 'coingecko',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
    read: (body) => Number((body as { solana: { usd: number } }).solana.usd),
  },
];

export default defineCachedEventHandler(
  async () => {
    for (const source of SOURCES) {
      try {
        const usd = source.read(await $fetch(source.url, { timeout: 5_000 }));
        if (Number.isFinite(usd) && usd > 0) {
          return { usd, source: source.name, updatedAt: new Date().toISOString() };
        }
      } catch {
        // Try the next source.
      }
    }
    throw createError({ statusCode: 503, statusMessage: 'SOL price unavailable' });
  },
  { maxAge: 60, swr: true, name: 'sol-price' },
);
