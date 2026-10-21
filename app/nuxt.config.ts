import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { DEFAULT_LOCALE, LOCALES } from './i18n/languages';

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

/** The dApp pages, in every language: they talk to a wallet and an RPC endpoint, so they only render in the browser. */
const browserOnly = Object.fromEntries(
  LOCALES.flatMap(({ code }) => {
    const prefix = code === DEFAULT_LOCALE ? '' : `/${code}`;
    return [
      [`${prefix}/play`, { ssr: false }],
      [`${prefix}/play/**`, { ssr: false }],
      [`${prefix}/rounds/**`, { ssr: false }],
    ];
  }),
);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  app: {
    head: {
      // The title, description, lang and dir come from the page's language (app.vue);
      // this title only stays on the shell of the browser-only pages until they load.
      title: 'S☉Lucky',
      meta: [
        { name: 'theme-color', content: '#0c0716' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'S☉Lucky' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },

  // The landing and legal pages are rendered per request, so runtime settings
  // such as the cluster always apply (a prerendered page would keep the
  // build's values).
  // English lives at the root: /en/… addresses go there.
  routeRules: {
    ...browserOnly,
    '/en': { redirect: { to: '/', statusCode: 301 } },
    '/en/**': { redirect: { to: '/**', statusCode: 301 } },
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
      /** Highest ticket number, shown until the on-chain config loads. */
      maxNumber: 21_000_000,
      /** Public URL of the site, for absolute links in social cards. */
      siteUrl: '',
      twitterUrl: '',
      discordUrl: '',
      githubUrl: 'https://github.com/nexow-ai/solucky',
      i18n: {
        /** Public URL of the site again, for the hreflang and canonical links. */
        baseUrl: '',
      },
    },
  },

  // English at the root, every other language under its code (/fr/play). The
  // language never comes from a cookie or a redirect: the header lists them
  // all, and components/AppLangSuggest.vue offers the browser's own once.
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALES.map((l) => ({
      code: l.code,
      language: l.language,
      name: l.name,
      dir: ('dir' in l ? l.dir : 'ltr') as 'ltr' | 'rtl',
      file: `${l.code}.ts`,
    })),
    detectBrowserLanguage: false,
    experimental: { typedOptionsAndMessages: 'default' },
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

  // How often an open page asks for the latest build (app/plugins/pwa.client.ts).
  experimental: {
    checkOutdatedBuildInterval: 10 * 60_000,
  },

  hooks: {
    // The service worker carries the build id, so every deploy changes its
    // bytes and browsers install it. Nitro has compressed it already: drop
    // those copies rather than serve the placeholder.
    'nitro:build:public-assets'(nitro) {
      const sw = join(nitro.options.output.publicDir, 'sw.js');
      writeFileSync(sw, readFileSync(sw, 'utf8').replace('__BUILD_ID__', nitro.options.runtimeConfig.app.buildId));
      for (const copy of [`${sw}.br`, `${sw}.gz`]) rmSync(copy, { force: true });
    },
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
