// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'S☉Lucky: the daily lottery on Solana',
      meta: [
        {
          name: 'description',
          content:
            'Pick a number, buy a ticket, and win the whole pot at midnight UTC. Every ticket, pot and draw lives on Solana and can be checked by anyone.',
        },
        { name: 'theme-color', content: '#0f172a' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'S☉Lucky' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  // The landing page is prerendered; the dApp pages talk to a wallet and an
  // RPC endpoint, so they only render in the browser.
  routeRules: {
    '/': { prerender: true },
    '/play': { ssr: false },
    '/rounds/**': { ssr: false },
  },

  runtimeConfig: {
    public: {
      /** devnet, testnet, mainnet or localnet. */
      cluster: 'devnet',
      /** RPC endpoint. Defaults to the public endpoint of the cluster. */
      rpcUrl: '',
      /** RPC websocket endpoint. Defaults to `rpcUrl` with ws(s)://. */
      rpcWsUrl: '',
      /** Program address. Defaults to the address in the IDL. */
      programId: '',
      /** Public URL of the site, for absolute links in social cards (set at build time). */
      siteUrl: '',
      twitterUrl: '',
      discordUrl: '',
      githubUrl: 'https://github.com/nexow-ai/solucky',
    },
  },

  // Bundle only the icons the code uses; on edge presets the server falls
  // back to the Iconify CDN instead of shipping whole collections.
  icon: {
    clientBundle: { scan: true },
  },

  fonts: {
    families: [{ name: 'Space Grotesk', provider: 'google', weights: [400, 500, 600, 700] }],
  },

  vite: {
    optimizeDeps: {
      include: ['@solana/kit', '@solana/kit-plugin-rpc', '@solana/kit-plugin-wallet'],
    },
  },

  eslint: {
    config: { stylistic: false },
  },
});
