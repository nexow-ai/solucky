/**
 * The languages S☉Lucky is published in, the same twenty as beenzer.xyz.
 * `code` is the path prefix (/fr/play, /zh-cn/play); English, the source, lives
 * at the root. `language` goes into <html lang>, hreflang and og:locale; `intl`
 * overrides it for numbers, currencies and country names where the language's
 * default would clash with the rest of the page (Western digits in Arabic, the
 * Gregorian calendar in Thai).
 *
 * `plural` lists the forms a plural message gives, in order, separated by
 * " | ": the CLDR categories the language uses for whole numbers. A count in a
 * category the list leaves out (French "many" for a million) takes the last
 * form.
 *
 * Read by nuxt.config.ts, so plain data only.
 */
export const LOCALES = [
  { code: 'en', language: 'en', name: 'English', english: 'English', plural: ['one', 'other'] },
  { code: 'es', language: 'es', name: 'Español', english: 'Spanish', plural: ['one', 'other'] },
  { code: 'fr', language: 'fr', name: 'Français', english: 'French', plural: ['one', 'other'] },
  { code: 'de', language: 'de', name: 'Deutsch', english: 'German', plural: ['one', 'other'] },
  { code: 'it', language: 'it', name: 'Italiano', english: 'Italian', plural: ['one', 'other'] },
  { code: 'pt', language: 'pt-BR', name: 'Português', english: 'Portuguese', plural: ['one', 'other'] },
  { code: 'nl', language: 'nl', name: 'Nederlands', english: 'Dutch', plural: ['one', 'other'] },
  { code: 'tr', language: 'tr', name: 'Türkçe', english: 'Turkish', plural: ['one', 'other'] },
  { code: 'ru', language: 'ru', name: 'Русский', english: 'Russian', plural: ['one', 'few', 'many'] },
  { code: 'uk', language: 'uk', name: 'Українська', english: 'Ukrainian', plural: ['one', 'few', 'many'] },
  {
    code: 'ar',
    language: 'ar',
    name: 'العربية',
    english: 'Arabic',
    dir: 'rtl',
    intl: 'ar-u-nu-latn',
    plural: ['zero', 'one', 'two', 'few', 'many', 'other'],
  },
  { code: 'he', language: 'he', name: 'עברית', english: 'Hebrew', dir: 'rtl', plural: ['one', 'two', 'other'] },
  { code: 'hi', language: 'hi', name: 'हिन्दी', english: 'Hindi', plural: ['one', 'other'] },
  { code: 'th', language: 'th', name: 'ไทย', english: 'Thai', intl: 'th-u-ca-gregory', plural: ['other'] },
  { code: 'vi', language: 'vi', name: 'Tiếng Việt', english: 'Vietnamese', plural: ['other'] },
  { code: 'id', language: 'id', name: 'Bahasa Indonesia', english: 'Indonesian', plural: ['other'] },
  { code: 'zh-cn', language: 'zh-CN', name: '简体中文', english: 'Chinese (Simplified)', plural: ['other'] },
  { code: 'zh-tw', language: 'zh-TW', name: '繁體中文', english: 'Chinese (Traditional)', plural: ['other'] },
  { code: 'ja', language: 'ja', name: '日本語', english: 'Japanese', plural: ['other'] },
  { code: 'ko', language: 'ko', name: '한국어', english: 'Korean', plural: ['other'] },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];
export type LocaleInfo = (typeof LOCALES)[number] & { dir?: 'rtl'; intl?: string };

export const DEFAULT_LOCALE: Locale = 'en';

/** Where the visitor's choice of language is kept (local storage, never a cookie). */
export const LANG_STORAGE_KEY = 'solucky:lang';

export function localeInfo(code: string): LocaleInfo {
  return (LOCALES.find((l) => l.code === code) ?? LOCALES[0]) as LocaleInfo;
}

/** The tag for `Intl` formatters in a language. */
export function intlTag(code: string): string {
  const info = localeInfo(code);
  return info.intl ?? info.language;
}

/** A browser language tag ("pt-BR", "zh-Hant-HK", "iw") to one of the site's languages. */
export function matchLocale(tag: string): Locale | undefined {
  const t = tag.toLowerCase();
  if (t.startsWith('zh')) return /^zh-(tw|hk|mo|hant)/.test(t) ? 'zh-tw' : 'zh-cn';
  const primary = t.split('-')[0]!;
  const code = ({ iw: 'he', in: 'id' } as Record<string, string>)[primary] ?? primary;
  return LOCALES.find((l) => l.code === code)?.code;
}
