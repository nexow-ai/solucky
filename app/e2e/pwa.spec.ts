import { expect, test } from '@playwright/test';

// The installable app: its manifest, and a service worker that keeps the last
// visit for offline use. A deploy's worker update stalls under Playwright
// (not in Chromium itself), so that part is not driven from here.
test('installs and opens offline', async ({ page, context }) => {
  await page.goto('/');
  const manifest = await page.evaluate(async () => {
    const link = document.querySelector<HTMLLinkElement>('link[rel=manifest]');
    return (await fetch(link!.href)).json();
  });
  expect(manifest).toMatchObject({ name: 'S☉Lucky', start_url: '/play', display: 'standalone' });

  // The worker caches under this build's id (nuxt.config.ts) from the next load on.
  const build = await page.evaluate(async () => (await (await fetch('/_nuxt/builds/latest.json')).json()).id);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => caches.keys())).toEqual([`solucky-${build}`]);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Play' })).toBeVisible();
});
