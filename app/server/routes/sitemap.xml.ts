/** The sitemap: every indexed page in all twenty languages, with their hreflang links (server/utils/seo.ts). */
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  });
  return sitemapXml(siteOrigin(event));
});
