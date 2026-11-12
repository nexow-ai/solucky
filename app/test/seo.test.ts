import { describe, expect, it } from 'vitest';

import { homeGraph, jsonLd } from '../app/utils/structuredData';
import { LOCALES } from '../i18n/languages';
import en from '../i18n/locales/en';
import {
  browserOnlyPage,
  fill,
  INDEXED_PATHS,
  llmsTxt,
  localizedPath,
  robotsTxt,
  shellHead,
  sitemapXml,
} from '../server/utils/seo';

const ORIGIN = 'https://solucky.example';

describe('localizedPath', () => {
  it('keeps English at the root and prefixes the other languages', () => {
    expect(localizedPath('en', '/')).toBe('/');
    expect(localizedPath('en', '/play')).toBe('/play');
    expect(localizedPath('fr', '/')).toBe('/fr');
    expect(localizedPath('zh-cn', '/play/guess')).toBe('/zh-cn/play/guess');
  });
});

describe('fill', () => {
  it('fills known values and leaves the others', () => {
    expect(fill('0 to {max}, {other}', { max: '21' })).toBe('0 to 21, {other}');
  });
});

describe('browserOnlyPage', () => {
  it('reads the language and the game of play and round pages', () => {
    expect(browserOnlyPage('/play')).toMatchObject({ kind: 'play', slug: 'daily', locale: { code: 'en' } });
    expect(browserOnlyPage('/fr/play/hourly?x=1')).toMatchObject({
      kind: 'play',
      slug: 'hourly',
      locale: { code: 'fr' },
    });
    expect(browserOnlyPage('/ar/rounds/guess/3')).toMatchObject({
      kind: 'round',
      slug: 'guess',
      locale: { dir: 'rtl' },
    });
  });

  it('ignores every other page', () => {
    for (const path of ['/', '/fr', '/legal', '/play/lotto', '/play/daily/extra', '/rounds/daily', '/xx/play']) {
      expect(browserOnlyPage(path), path).toBeNull();
    }
  });
});

describe('sitemapXml', () => {
  const sitemap = sitemapXml(ORIGIN);

  it('lists every indexed page in every language', () => {
    expect(sitemap.match(/<url>/g)).toHaveLength(INDEXED_PATHS.length * LOCALES.length);
    expect(sitemap).toContain(`<loc>${ORIGIN}/ja/play/guess</loc>`);
    expect(sitemap).toContain(`<loc>${ORIGIN}/ja/guess</loc>`);
    expect(sitemap).toContain(`<loc>${ORIGIN}/legal/terms</loc>`);
  });

  it('links each page to its translations and a default', () => {
    const first = sitemap.slice(sitemap.indexOf('<url>'), sitemap.indexOf('</url>'));
    expect(first.match(/hreflang=/g)).toHaveLength(LOCALES.length + 1);
    expect(first).toContain(`hreflang="x-default" href="${ORIGIN}/"`);
    expect(first).toContain(`hreflang="pt-BR" href="${ORIGIN}/pt"`);
  });
});

describe('robotsTxt', () => {
  it('allows crawling and points to the sitemap', () => {
    const robots = robotsTxt(ORIGIN);
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  it('lists no sitemap on a test-money site', () => {
    const robots = robotsTxt(ORIGIN, { indexed: false });
    expect(robots).toContain('Allow: /');
    expect(robots).not.toContain('Sitemap');
  });
});

describe('llmsTxt', () => {
  const text = llmsTxt({
    origin: ORIGIN,
    cluster: 'devnet',
    clusterLabel: 'Devnet',
    explorerQuery: '?cluster=devnet',
    programAddress: 'JCupk8SMKzCzApb7LbW3LHryrj7ZN9i1sGo6w2cSQLdF',
    maxNumber: 21_000_000,
    githubUrl: 'https://github.com/nexow-ai/solucky',
  });

  it('summarises the games, the rules and every question', () => {
    expect(text.startsWith('# S☉Lucky\n\n> ')).toBe(true);
    expect(text).toContain(`[${en.games.hourly.name}](${ORIGIN}/hourly)`);
    expect(text).toContain(`[${en.nav.play}](${ORIGIN}/play/hourly)`);
    for (const slug of ['daily', 'hourly', 'guess'] as const) {
      for (const step of Object.values(en.landing[slug].steps)) expect(text).toContain(`**${step.title}**`);
    }
    for (const item of Object.values(en.home.faq.items)) expect(text).toContain(`### ${item.q}`);
    expect(text).toContain('test money');
  });

  it('fills every value', () => {
    expect(text).not.toMatch(/\{\w+\}/);
    expect(text).toContain('21,000,000');
  });
});

describe('shellHead', () => {
  it('names the page in its language, with its canonical address and translations', () => {
    const page = browserOnlyPage('/de/play/daily')!;
    const { title, head, noscript } = shellHead(page, '/de/play/daily', ORIGIN);
    expect(title).toBe('Tägliche Lotterie · S☉Lucky');
    // The daily lottery's address is /play.
    expect(head).toContain(`rel="canonical" href="${ORIGIN}/de/play"`);
    expect(head).toContain(`hreflang="x-default" href="${ORIGIN}/play"`);
    expect(head).toContain(`property="og:image" content="${ORIGIN}/og.png"`);
    expect(noscript).toContain(`href="${ORIGIN}/de"`);
  });

  it('escapes the words it writes into attributes', () => {
    const { head, noscript } = shellHead(browserOnlyPage('/fr/play/guess')!, '/fr/play/guess', ORIGIN);
    expect(head).not.toMatch(/content="[^"]*[<>][^"]*"/);
    // Without scripts, the shell leads to the game's own page, which renders on the server.
    expect(noscript).toContain(`href="${ORIGIN}/fr/guess"`);
    // Each game's pages share its own card.
    expect(head).toContain(`property="og:image" content="${ORIGIN}/og-guess.png"`);
  });
});

describe('homeGraph', () => {
  const graph = homeGraph({
    origin: ORIGIN,
    url: `${ORIGIN}/`,
    language: 'en',
    title: en.meta.title,
    description: en.meta.description,
    lead: en.home.lead,
    imageAlt: en.meta.ogImageAlt,
    operator: { name: 'Nexow, Inc.', site: 'https://nexow.studio', email: 'admin@nexow.ai' },
    profiles: ['https://github.com/nexow-ai/solucky'],
    repository: 'https://github.com/nexow-ai/solucky',
    games: [{ name: 'Daily lottery', description: 'Daily', url: `${ORIGIN}/play/daily` }],
    gamesTitle: en.games.title,
    howTitle: en.landing.daily.how.title,
    howDescription: en.landing.daily.how.description,
    steps: [{ name: 'Connect', text: 'A wallet' }],
    faq: [{ question: 'Q?', answer: 'A </script><script>alert(1)</script>' }],
    playUrl: `${ORIGIN}/play`,
  });

  it('describes the organisation, the site, the app, the games, the steps and the questions', () => {
    const types = graph['@graph'].map((node) => node['@type']);
    expect(types).toEqual([
      'Organization',
      'WebSite',
      'WebPage',
      'WebApplication',
      'SoftwareSourceCode',
      'ItemList',
      'HowTo',
      'FAQPage',
    ]);
  });

  it('serialises without a way to close the script tag', () => {
    const json = jsonLd(graph);
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual(graph);
  });
});
