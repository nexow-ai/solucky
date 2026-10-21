/** Who runs S☉Lucky, as the legal pages name them. */
export const OPERATOR = {
  name: 'Nexow, Inc.',
  email: 'admin@nexow.ai',
  site: 'https://nexow.studio',
} as const;

/** When the wording of the legal pages last changed. Update it with every change to them. */
export const LEGAL_UPDATED = '2026-10-21';

export const LEGAL_PAGES = [
  {
    label: 'Legal notice',
    to: '/legal',
    icon: 'i-lucide-scale',
    description: 'Who runs S☉Lucky, how to reach us, and the documents that apply.',
  },
  {
    label: 'Terms of Service',
    to: '/legal/terms',
    icon: 'i-lucide-scroll-text',
    description: 'The rules for using the site and playing, and what the program does and does not promise.',
  },
  {
    label: 'Privacy Policy',
    to: '/legal/privacy',
    icon: 'i-lucide-eye-off',
    description: 'What is public on Solana, what our servers see, and what we never collect.',
  },
  {
    label: 'Cookies & storage',
    to: '/legal/cookies',
    icon: 'i-lucide-cookie',
    description: 'No cookies, no trackers: the four settings the app keeps in your browser.',
  },
  {
    label: 'Responsible play',
    to: '/legal/responsible-play',
    icon: 'i-lucide-heart-handshake',
    description: 'How the odds work, and where to get help if playing stops being fun.',
  },
] as const;
