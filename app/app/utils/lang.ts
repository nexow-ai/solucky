import { LANG_STORAGE_KEY, LOCALES, type Locale } from '~~/i18n/languages';

/** The language this visitor picked, or kept when offered another (local storage, never a cookie). */
export function savedLanguage(): Locale | null {
  try {
    const code = localStorage.getItem(LANG_STORAGE_KEY);
    return LOCALES.find((l) => l.code === code)?.code ?? null;
  } catch {
    return null;
  }
}

export function rememberLanguage(code: string) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, code);
  } catch {
    // Applied for this visit only.
  }
}
