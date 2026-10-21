import { defineConfig, devices } from '@playwright/test';

/**
 * Browser tests against a production build of the app on a local Surfpool:
 *
 *   surfpool start --offline --no-deploy
 *   SOLANA_RPC_URL=http://127.0.0.1:8899 bun run localnet
 *   bun run build && bun run test:browser
 */
const PORT = 3400;
const RPC_URL = process.env.SOLANA_RPC_URL || 'http://127.0.0.1:8899';

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 30_000 },
  // One chain, one clock: the tests run in order.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node .output/server/index.mjs',
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: String(PORT),
      HOST: '127.0.0.1',
      NUXT_PUBLIC_CLUSTER: 'localnet',
      NUXT_PUBLIC_RPC_URL: RPC_URL,
    },
  },
});
