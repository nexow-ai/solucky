/** Who runs S☉Lucky, as the legal pages name them. */
export const OPERATOR = {
  name: 'Nexow, Inc.',
  email: 'admin@nexow.ai',
  site: 'https://nexow.studio',
} as const;

/** When the wording of the legal pages last changed. Update it with every change to them. */
export const LEGAL_UPDATED = '2026-10-21';

/**
 * The legal documents, in the order they are listed. Each one's title and
 * summary are `legal.pages.<key>.label` and `.description` in the dictionaries.
 */
export const LEGAL_PAGES = [
  { key: 'notice', to: '/legal', icon: 'i-lucide-scale' },
  { key: 'terms', to: '/legal/terms', icon: 'i-lucide-scroll-text' },
  { key: 'privacy', to: '/legal/privacy', icon: 'i-lucide-eye-off' },
  { key: 'cookies', to: '/legal/cookies', icon: 'i-lucide-cookie' },
  { key: 'play', to: '/legal/responsible-play', icon: 'i-lucide-heart-handshake' },
] as const;

/**
 * A legal page's index: each section's anchor (`openSource` → `#open-source`)
 * and its title, `legal.<page>.<section>.title` in the dictionaries.
 */
export function legalSections(t: (key: string) => string, page: string, keys: readonly string[]) {
  return keys.map((key) => ({
    id: key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
    label: t(`legal.${page}.${key}.title`),
  }));
}
