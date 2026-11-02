/**
 * What search engines and AI assistants are told about the site, beyond the
 * pages themselves: the sitemap, robots.txt, llms.txt, and the title, summary
 * and social card of the pages that only render in the browser (play, rounds),
 * which crawlers that do not run scripts would otherwise see blank.
 *
 * The words come from the same dictionaries as the pages (the i18n module
 * bundles them into the server already), so nothing here says more than the
 * site does.
 */
import { GAME_SLUGS, type GameSlug } from '@solucky/client';

import { LEGAL_PAGES, LEGAL_UPDATED, OPERATOR } from '../../app/utils/legal';
import { homePath, playPath, shareImagePath } from '../../app/utils/play';
import { DEFAULT_LOCALE, type Locale, type LocaleInfo, LOCALES } from '../../i18n/languages';
import ar from '../../i18n/locales/ar';
import de from '../../i18n/locales/de';
import en, { type Dict } from '../../i18n/locales/en';
import es from '../../i18n/locales/es';
import fr from '../../i18n/locales/fr';
import he from '../../i18n/locales/he';
import hi from '../../i18n/locales/hi';
import id from '../../i18n/locales/id';
import it from '../../i18n/locales/it';
import ja from '../../i18n/locales/ja';
import ko from '../../i18n/locales/ko';
import nl from '../../i18n/locales/nl';
import pt from '../../i18n/locales/pt';
import ru from '../../i18n/locales/ru';
import th from '../../i18n/locales/th';
import tr from '../../i18n/locales/tr';
import uk from '../../i18n/locales/uk';
import vi from '../../i18n/locales/vi';
import zhCn from '../../i18n/locales/zh-cn';
import zhTw from '../../i18n/locales/zh-tw';

export const DICTIONARIES: Record<Locale, Dict> = {
  en,
  es,
  fr,
  de,
  it,
  pt,
  nl,
  tr,
  ru,
  uk,
  ar,
  he,
  hi,
  th,
  vi,
  id,
  'zh-cn': zhCn,
  'zh-tw': zhTw,
  ja,
  ko,
};

/** Fills a dictionary message's `{name}` values. */
export function fill(message: string, values: Record<string, string | number> = {}): string {
  return message.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}

/** A page's address in a language: English at the root, the others under their code (`/fr/play`). */
export function localizedPath(code: string, path: string): string {
  if (code === DEFAULT_LOCALE) return path;
  return path === '/' ? `/${code}` : `/${code}${path}`;
}

/**
 * The pages worth indexing, in every language: each game's own page (the
 * daily lottery's is the home, `/`) and its table (the daily lottery's is
 * `/play`), then the legal pages.
 */
export const INDEXED_PATHS: readonly { path: string; lastmod?: string }[] = [
  { path: '/' },
  { path: '/hourly' },
  { path: '/guess' },
  { path: '/play' },
  { path: '/play/hourly' },
  { path: '/play/guess' },
  ...LEGAL_PAGES.map((page) => ({ path: page.to, lastmod: LEGAL_UPDATED })),
];

const xml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** sitemap.xml: every indexed page in every language, each listing its translations (hreflang). */
export function sitemapXml(origin: string): string {
  const urls = INDEXED_PATHS.flatMap(({ path, lastmod }) => {
    const alternates = [
      ...LOCALES.map((l) => ({ lang: l.language, href: `${origin}${localizedPath(l.code, path)}` })),
      { lang: 'x-default', href: `${origin}${path}` },
    ]
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${xml(a.href)}"/>`)
      .join('\n');
    return LOCALES.map(
      (l) =>
        `  <url>\n    <loc>${xml(`${origin}${localizedPath(l.code, path)}`)}</loc>\n` +
        (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
        `${alternates}\n  </url>`,
    );
  });
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    `${urls.join('\n')}\n</urlset>\n`
  );
}

/** robots.txt: every page may be crawled; the API and the live socket are not pages. */
export function robotsTxt(origin: string): string {
  return [
    '# S☉Lucky: every page may be crawled, indexed and quoted.',
    '# A summary for AI assistants is at /llms.txt.',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /_live',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
}

export interface SiteFacts {
  origin: string;
  cluster: string;
  clusterLabel: string;
  programAddress: string;
  explorerQuery: string;
  maxNumber: number;
  githubUrl: string;
}

/**
 * llms.txt (llmstxt.org): the site in plain Markdown for AI assistants, in
 * English, from the landing page's own words: what it is, the games, how to
 * play, the rules the program enforces, the questions, and where to look.
 */
export function llmsTxt(facts: SiteFacts, d: Dict = en): string {
  const max = new Intl.NumberFormat('en-US').format(facts.maxNumber);
  const url = (path: string) => `${facts.origin}${path}`;
  const games = GAME_SLUGS.map(
    (slug: GameSlug) =>
      `- [${d.games[slug].name}](${url(homePath(slug))}): ${d.games[slug].description} [${d.nav.play}](${url(playPath(slug))})`,
  );
  // Each game's four steps, in the dictionary's order.
  const how = GAME_SLUGS.map((slug: GameSlug) => {
    const steps = Object.values(d.landing[slug].steps).map(
      (step, i) => `${i + 1}. **${step.title}** (${step.when}): ${fill(step.description, { max })}`,
    );
    return `### ${d.games[slug].name}\n\n${d.landing[slug].how.description}\n\n${steps.join('\n')}`;
  });
  // Guess the number's check stands in for the lotteries' draw.
  const rules = (['locked', 'draw', 'guessDraw', 'anyone', 'browser', 'guessBrowser', 'limits', 'open'] as const).map(
    (id) => {
      const rule = d.home.fairness.rules[id];
      const game = id === 'guessDraw' || id === 'guessBrowser' ? ` (${d.games.guess.name})` : '';
      return `- **${rule.title}**${game}: ${rule.description}`;
    },
  );
  const faq = (['what', 'real', 'price', 'odds', 'guess', 'draw', 'country', 'validator'] as const).map(
    (id) => `### ${d.home.faq.items[id].q}\n\n${fill(d.home.faq.items[id].a, { max })}`,
  );
  const legal = LEGAL_PAGES.map((page) => `- [${d.legal.pages[page.key].label}](${url(page.to)})`);
  const languages = LOCALES.map((l: LocaleInfo) => `${l.english} (${url(localizedPath(l.code, '/'))})`).join(', ');

  return `# S☉Lucky

> ${d.meta.description}

${d.home.lead}

S☉Lucky (also written SoLucky) is made by ${OPERATOR.name} (${OPERATOR.site}). This site runs on Solana ${facts.clusterLabel}${facts.cluster === 'mainnet' ? '' : ', where SOL is test money with no value'}. Program address: \`${facts.programAddress}\` ([explorer](https://explorer.solana.com/address/${facts.programAddress}${facts.explorerQuery})). ${d.footer.age}

## Games

${fill(d.games.description, { max })}

${games.join('\n')}

## How it works

${how.join('\n\n')}

## Fairness

${d.home.fairness.description}

${rules.join('\n')}

## Questions

${faq.join('\n\n')}

## More

- [Play](${url('/play')})
- [Source code](${facts.githubUrl})
${legal.join('\n')}
- Languages: ${languages}
- Contact: ${OPERATOR.email}
`;
}

/** A page that only renders in the browser, read from its address: its language and what it shows. */
export function browserOnlyPage(path: string): { locale: LocaleInfo; kind: 'play' | 'round'; slug: GameSlug } | null {
  const [pathname = '/'] = path.split('?');
  const parts = pathname.split('/').filter(Boolean);
  const prefixed = LOCALES.find((l) => l.code !== DEFAULT_LOCALE && l.code === parts[0]);
  const locale = (prefixed ?? LOCALES.find((l) => l.code === DEFAULT_LOCALE)!) as LocaleInfo;
  const rest = prefixed ? parts.slice(1) : parts;
  const slug = (rest[1] ?? 'daily') as GameSlug;
  if (!GAME_SLUGS.includes(slug)) return null;
  if (rest[0] === 'play' && rest.length <= 2) return { locale, kind: 'play', slug };
  if (rest[0] === 'rounds' && rest.length === 3) return { locale, kind: 'round', slug };
  return null;
}

/**
 * The head of a browser-only page's HTML shell: its title, summary and social
 * card in its language, its canonical address and translations, and a short
 * description for crawlers that do not run scripts. The tags marked
 * `data-shell` are the ones the app sets again once it runs.
 */
export function shellHead(
  page: NonNullable<ReturnType<typeof browserOnlyPage>>,
  path: string,
  origin: string,
): { title: string; head: string; noscript: string } {
  const d = DICTIONARIES[page.locale.code as Locale];
  const game = d.games[page.slug];
  const title = `${game.name} · S☉Lucky`;
  const description = page.kind === 'play' ? `${game.description} ${d.play.description}` : game.description;
  // The daily lottery lives at /play; /play/daily shows the same table.
  const route = page.kind === 'play' ? playPath(page.slug) : null;
  const canonical = route ? `${origin}${localizedPath(page.locale.code, route)}` : `${origin}${path.split('?')[0]}`;
  const attr = (text: string) => xml(text);
  const tags = [
    `<meta data-shell name="description" content="${attr(description)}">`,
    `<meta data-shell property="og:title" content="${attr(title)}">`,
    `<meta data-shell property="og:description" content="${attr(description)}">`,
    `<meta data-shell property="og:url" content="${attr(canonical)}">`,
    `<meta data-shell property="og:image" content="${attr(`${origin}${shareImagePath(page.slug)}`)}">`,
    `<meta data-shell property="og:image:width" content="1200">`,
    `<meta data-shell property="og:image:height" content="630">`,
    `<meta data-shell property="og:image:alt" content="${attr(d.meta.ogImageAlt)}">`,
    `<meta data-shell property="og:locale" content="${attr(page.locale.language.replace('-', '_'))}">`,
    `<link data-shell rel="canonical" href="${attr(canonical)}">`,
  ];
  if (route) {
    for (const l of LOCALES) {
      tags.push(
        `<link data-shell rel="alternate" hreflang="${l.language}" href="${attr(`${origin}${localizedPath(l.code, route)}`)}">`,
      );
    }
    tags.push(`<link data-shell rel="alternate" hreflang="x-default" href="${attr(`${origin}${route}`)}">`);
  }
  // The game's own page renders on the server, so it reads without scripts.
  const home = `${origin}${localizedPath(page.locale.code, homePath(page.slug))}`;
  const noscript = `<noscript><h1>${xml(title)}</h1><p>${xml(description)}</p><p><a href="${attr(home)}">${xml(fill(d.landing.title, { game: game.name }))}</a></p></noscript>`;
  return { title, head: tags.join(''), noscript };
}
