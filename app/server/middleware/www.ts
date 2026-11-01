/**
 * One origin for the site: `www.` redirects to the apex (both are routed to
 * the Worker in wrangler.jsonc). Otherwise each host keeps its own saved
 * wallet, country, service worker and push subscription, and search engines
 * see two copies of every page.
 */
export default defineEventHandler((event) => {
  const host = getRequestHost(event);
  if (!host.startsWith('www.')) return;
  const target = `${getRequestProtocol(event)}://${host.slice(4)}${event.path}`;
  return sendRedirect(event, target, 301);
});
