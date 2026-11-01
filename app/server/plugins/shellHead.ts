/**
 * The play and round pages render only in the browser, so their HTML shell
 * carries no words of its own. This gives the shell its page's title, summary,
 * social card, canonical address and translations, in the page's language, so
 * link previews and crawlers that do not run scripts see the right page
 * (server/utils/seo.ts). The app replaces them once it starts.
 */
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html, { event }) => {
    const page = browserOnlyPage(event.path);
    if (!page) return;
    const { title, head, noscript } = shellHead(page, event.path, siteOrigin(event));
    html.head = html.head.map((chunk) => chunk.replace(/<title>[^<]*<\/title>/, ''));
    html.head.push(`<title>${title.replace(/</g, '&lt;')}</title>${head}`);
    if (!html.htmlAttrs.some((attrs) => attrs.includes('lang='))) {
      html.htmlAttrs.push(`lang="${page.locale.language}" dir="${page.locale.dir ?? 'ltr'}"`);
    }
    html.bodyPrepend.unshift(noscript);
  });
});
