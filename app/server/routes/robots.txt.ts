/** robots.txt, with the sitemap's absolute address (server/utils/seo.ts). */
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  });
  return robotsTxt(siteOrigin(event));
});
