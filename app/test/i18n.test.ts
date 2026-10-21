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

describe('English', () => {
  it('is a valid source', () => {
    for (const [key, message] of Object.entries(source)) {
      expect(message.trim(), key).toBe(message);
      if (isPlural(message)) expect(message.split(' | '), key).toHaveLength(2);
    }
  });
});

describe.each(LOCALES.map((l) => [l.code, l] as const))('%s', (code, locale) => {
  const file = files[`../i18n/locales/${code}.ts`];
  const messages = file ? flatten(file.default) : {};

  it('has a dictionary with exactly the English keys', () => {
    expect(file, `i18n/locales/${code}.ts`).toBeDefined();
    expect(Object.keys(messages).sort()).toEqual(Object.keys(source).sort());
  });

  it('writes valid messages with the same values to fill in', () => {
    for (const [key, original] of Object.entries(source)) {
      const message = messages[key];
      if (message === undefined) continue;
      const errors: string[] = [];
      baseCompile(message, { jit: true, onError: (error) => errors.push(error.message) });
      expect(errors, `${code}: ${key}`).toEqual([]);
      // @ $ start linked messages and modifiers; tags are refused at runtime.
      expect(message, `${code}: ${key} uses @, $ or a <tag>`).not.toMatch(/[@$]|<\/?[a-z]/i);

      const wanted = placeholders(original);
      const used = placeholders(message);
      expect([...used].filter((name) => !wanted.has(name)), `${code}: ${key} has unknown values`).toEqual([]);
      if (isPlural(original)) {
        const forms = message.split(' | ');
        expect(forms, `${code}: ${key} needs one form per plural category (${locale.plural.join(' | ')})`).toHaveLength(
          locale.plural.length,
        );
        // A form may leave out the count ("a ticket"), never anything else.
        const missing = [...wanted].filter((name) => name !== 'n' && !used.has(name));
        expect(missing, `${code}: ${key} leaves out values`).toEqual([]);
      } else {
        expect(message, `${code}: ${key} is not a plural message`).not.toContain('|');
        expect([...wanted].filter((name) => !used.has(name)), `${code}: ${key} leaves out values`).toEqual([]);
      }
    }
  });

  it.skipIf(code === 'en')('is translated', () => {
    // Brand names, codes and a few short labels can stay the same as English.
    const same = Object.entries(source).filter(([key, original]) => messages[key] === original && original.length > 12);
    expect(same.length / Object.keys(source).length, same.map(([key]) => key).join(', ')).toBeLessThan(0.08);
  });

  it('offers itself in its own words', () => {
    expect(SUGGEST[code]).toBeDefined();
  });
});
