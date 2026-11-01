/**
 * Schema.org structured data (JSON-LD) for the landing page: who makes
 * S☉Lucky, what it is, its three games, how to play and the questions people
 * ask. Search engines and AI assistants read it to describe the site; every
 * word comes from the page's own dictionary, so it says no more than the page.
 */

export interface HomeGraphInput {
  /** The site's origin, without a trailing slash. */
  origin: string;
  /** The page's address and language (`fr`, `pt-BR`…). */
  url: string;
  language: string;
  title: string;
  description: string;
  lead: string;
  imageAlt: string;
  operator: { name: string; site: string; email: string };
  /** Code repository and social profiles; empty ones are left out. */
  profiles: string[];
  repository: string;
  games: { name: string; description: string; url: string }[];
  gamesTitle: string;
  howTitle: string;
  howDescription: string;
  steps: { name: string; text: string }[];
  faq: { question: string; answer: string }[];
  playUrl: string;
}

/** The names people type when they look for S☉Lucky without the ☉. */
export const SITE_ALIASES = ['SoLucky', 'Solucky', 'Sol Lucky'];

export function homeGraph(input: HomeGraphInput) {
  const { origin } = input;
  const org = `${origin}/#organization`;
  const site = `${origin}/#website`;
  const app = `${origin}/#app`;
  const image = `${origin}/og.png`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: input.operator.name,
        url: input.operator.site,
        email: input.operator.email,
        sameAs: [input.operator.site],
      },
      {
        '@type': 'WebSite',
        '@id': site,
        url: `${origin}/`,
        name: 'S☉Lucky',
        alternateName: SITE_ALIASES,
        description: input.description,
        inLanguage: input.language,
        publisher: { '@id': org },
      },
      {
        '@type': 'WebPage',
        '@id': input.url,
        url: input.url,
        name: input.title,
        description: input.description,
        inLanguage: input.language,
        isPartOf: { '@id': site },
        about: { '@id': app },
        primaryImageOfPage: { '@type': 'ImageObject', url: image, width: 1200, height: 630, caption: input.imageAlt },
      },
      {
        '@type': 'WebApplication',
        '@id': app,
        name: 'S☉Lucky',
        alternateName: SITE_ALIASES,
        url: input.playUrl,
        description: input.lead,
        applicationCategory: 'GameApplication',
        applicationSubCategory: 'Lottery',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript and a Solana wallet',
        inLanguage: input.language,
        image,
        featureList: input.games.map((game) => `${game.name}: ${game.description}`),
        publisher: { '@id': org },
        sameAs: input.profiles,
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${origin}/#source`,
        name: 'S☉Lucky',
        codeRepository: input.repository,
        programmingLanguage: ['Rust', 'TypeScript'],
        runtimePlatform: 'Solana',
        license: 'https://opensource.org/licenses/MIT',
        author: { '@id': org },
      },
      {
        '@type': 'ItemList',
        '@id': `${input.url}#games`,
        name: input.gamesTitle,
        itemListElement: input.games.map((game, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: game.url,
          name: game.name,
          description: game.description,
        })),
      },
      {
        '@type': 'HowTo',
        '@id': `${input.url}#how-it-works`,
        name: input.howTitle,
        description: input.howDescription,
        inLanguage: input.language,
        step: input.steps.map((step, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${input.url}#faq`,
        inLanguage: input.language,
        mainEntity: input.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };
}

/** JSON for a `<script type="application/ld+json">`: `<` is escaped so no text can close the script. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
