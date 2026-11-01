import type { H3Event } from 'h3';

/**
 * The site's public origin, without a trailing slash: `siteUrl`, else the
 * i18n base URL (the canonical links use it), else the address the request
 * came to.
 */
export function siteOrigin(event: H3Event): string {
  const config = useRuntimeConfig(event).public;
  return (config.siteUrl || config.i18n?.baseUrl || getRequestURL(event).origin).replace(/\/$/, '');
}
