import { LOCALES } from './languages';

/**
 * Picks a plural message's form from the language's CLDR rules: the forms are
 * listed in the order of `plural` in languages.ts, and a category the list
 * leaves out takes the last form.
 */
function pluralRule(language: string, forms: readonly string[]) {
  const rules = new Intl.PluralRules(language);
  return (choice: number, choicesLength: number) => {
    const index = forms.indexOf(rules.select(Math.abs(choice)));
    return Math.min(index < 0 ? forms.length - 1 : index, choicesLength - 1);
  };
}

export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  pluralRules: Object.fromEntries(LOCALES.map((l) => [l.code, pluralRule(l.language, l.plural)])),
}));
