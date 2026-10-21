import { intlTag } from '~~/i18n/languages';

/** The page's language as a tag for `Intl` formatters: formatUsd, formatPercent, countryName… */
export function useIntlLocale() {
  const { locale } = useI18n();
  return computed(() => intlTag(locale.value));
}
