/**
 * Security headers for production. The app talks to user-configured RPC
 * endpoints and browser wallets, so `connect-src` allows any HTTPS/WSS host
 * (plus localhost for local clusters). Nuxt's hydration payload and the color
 * mode script are inline, hence `'unsafe-inline'` for scripts; nothing is ever
 * loaded from another origin. On Cloudflare, Nitro also writes these to
 * `_headers` so static files get them too.
 */
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss: http://127.0.0.1:* ws://127.0.0.1:* http://localhost:* ws://localhost:*",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

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
        { name: 'theme-color', content: '#0c0716' },
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

  // The landing page is rendered per request, so runtime settings such as the
  // cluster always apply (a prerendered page would keep the build's values).
  // The dApp pages talk to a wallet and an RPC endpoint, so they only render
  // in the browser.
  routeRules: {
    '/play': { ssr: false },
    '/rounds/**': { ssr: false },
  },

  // Dev and HMR stay header-free; production responses carry the headers.
  $production: {
    routeRules: {
      '/**': { headers: securityHeaders },
    },
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
      /** Public URL of the site, for absolute links in social cards. */
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

  // Only generate CSS for the Nuxt UI components the app uses.
  ui: {
    experimental: { componentDetection: true },
  },

  // Serve gzip and brotli copies of static files from the Node server
  // (Cloudflare compresses on its own). WebSockets carry the play page's live
  // table (server/routes/_live.ts).
  nitro: {
    compressPublicAssets: true,
    experimental: { websocket: true },
  },

  // The night palette is the house style; the toggle in the header still switches to light.
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  fonts: {
    families: [
      { name: 'Space Grotesk', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 600, 800] },
    ],
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
