import { baseCompile } from '@intlify/message-compiler';
import { describe, expect, it } from 'vitest';

import { LOCALES } from '../i18n/languages';
import en from '../i18n/locales/en';
import { SUGGEST } from '../i18n/suggest';

type Tree = { [key: string]: string | Tree };

const files = import.meta.glob<{ default: Tree }>('../i18n/locales/*.ts', { eager: true });

/** `{ a: { b: 'x' } }` → `{ 'a.b': 'x' }`. */
function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((all, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return Object.assign(all, typeof value === 'string' ? { [path]: value } : flatten(value, path));
  }, {});
}

const placeholders = (message: string) => new Set([...message.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!));
const isPlural = (message: string) => message.includes(' | ');

const source = flatten(en as unknown as Tree);

/** Everything wrong with one message, compared with its English original. */
function check(message: string, original: string, forms: readonly string[]): string[] {
  const problems: string[] = [];
  baseCompile(message, { jit: true, onError: (error) => problems.push(error.message) });
  // @ and $ start linked messages and modifiers; tags are refused at runtime.
  if (/[@$]|<\/?[a-z]/i.test(message)) problems.push('uses @, $ or a <tag> as text');

  const wanted = placeholders(original);
  const used = placeholders(message);
  const unknown = [...used].filter((name) => !wanted.has(name));
  if (unknown.length) problems.push(`unknown values {${unknown.join('}, {')}}`);
  if (isPlural(original)) {
    const count = message.split(' | ').length;
    if (count !== forms.length)
      problems.push(`${count} plural forms instead of ${forms.length} (${forms.join(' | ')})`);
    // A form may leave out the count ("a ticket"), never anything else.
    const missing = [...wanted].filter((name) => name !== 'n' && !used.has(name));
    if (missing.length) problems.push(`leaves out {${missing.join('}, {')}}`);
  } else {
    if (message.includes('|')) problems.push('has a | but is not a plural message');
    const missing = [...wanted].filter((name) => !used.has(name));
    if (missing.length) problems.push(`leaves out {${missing.join('}, {')}}`);
  }
  return problems;
}

describe('English', () => {
  it('is a valid source', () => {
    const problems = Object.entries(source).flatMap(([key, message]) =>
      check(message, message, ['one', 'other']).map((problem) => `${key}: ${problem}`),
    );
    expect(problems).toEqual([]);
  });
});

// Each test lists every problem it finds, so a translator sees them all at once.
describe.each(LOCALES.map((l) => [l.code, l] as const))('%s', (code, locale) => {
  const file = files[`../i18n/locales/${code}.ts`];
  const messages = file ? flatten(file.default) : {};

  it('has a dictionary with exactly the English keys', () => {
    expect(file, `i18n/locales/${code}.ts`).toBeDefined();
    expect(Object.keys(messages).sort()).toEqual(Object.keys(source).sort());
  });

  it('writes valid messages with the same values to fill in', () => {
    const problems = Object.entries(source).flatMap(([key, original]) =>
      key in messages ? check(messages[key]!, original, locale.plural).map((problem) => `${key}: ${problem}`) : [],
    );
    expect(problems).toEqual([]);
  });

  it.skipIf(code === 'en')('is translated', () => {
    // Brand names, codes and a few short labels can stay the same as English.
    const same = Object.keys(source).filter((key) => messages[key] === source[key] && source[key]!.length > 12);
    const share = same.length / Object.keys(source).length;
    expect(share, `${same.length} messages still in English: ${same.slice(0, 10).join(', ')}…`).toBeLessThan(0.08);
  });

  it('offers itself in its own words', () => {
    expect(SUGGEST[code]).toBeDefined();
  });
});
