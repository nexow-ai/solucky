/**
 * In right-to-left languages, every value filled into a message is set off in
 * its own direction (FSI…PDI, invisible), so it keeps its order inside Arabic
 * or Hebrew text: a date stays 2026-10-21 and an address keeps its full stop.
 * Values given through <i18n-t> slots are elements, which carry `dir`
 * themselves where they need it.
 */
export default defineNuxtPlugin({
  name: 'bidi-isolate',
  dependsOn: ['i18n:plugin'],
  setup(nuxtApp) {
    const i18n = nuxtApp.$i18n;
    const translate = i18n.t;

    const isolate = (values: Record<string, unknown>) =>
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          typeof value === 'string' || typeof value === 'number' ? `⁨${value}⁩` : value,
        ]),
      );

    i18n.t = ((key: string, ...args: unknown[]) => {
      if (i18n.localeProperties.value.dir === 'rtl' && args[0] && typeof args[0] === 'object') {
        args[0] = isolate(args[0] as Record<string, unknown>);
      }
      return (translate as (...all: unknown[]) => string)(key, ...args);
    }) as typeof translate;
  },
});
