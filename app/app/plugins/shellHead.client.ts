/**
 * The server gives the browser-only pages' HTML shell their title, summary and
 * links (server/plugins/shellHead.ts), marked `data-shell`. Once the app runs,
 * its own head takes over, so the shell's copies go.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    for (const el of document.head.querySelectorAll('[data-shell]')) el.remove();
  });
});
