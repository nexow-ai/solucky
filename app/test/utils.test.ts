import { SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM, SolanaError } from '@solana/kit';
import { describe, expect, it } from 'vitest';

import { COUNTRY_CODES, countryName, countryOptions } from '../app/utils/countries';
import { friendlyError, isUserRejection } from '../app/utils/errors';
import {
  formatDate,
  formatNumber,
  formatPercent,
  formatSol,
  formatUnit,
  formatUsd,
  formatUtcTime,
  shortAddress,
} from '../app/utils/format';
import { matchLocale } from '../i18n/languages';

function programError(code: number) {
  const inner = new SolanaError(SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM, { code, index: 1 });
  return new Error('Transaction simulation failed', { cause: inner });
}

describe('format', () => {
  it('groups digits with spaces', () => {
    expect(formatNumber(777777777)).toBe('777\u00a0777\u00a0777');
    expect(formatNumber(0)).toBe('0');
  });

  it('shows lamports as SOL', () => {
    expect(formatSol(1_500_000_000n)).toBe('1.5');
    expect(formatSol(123_456_789n, 2)).toBe('0.12');
    expect(formatSol(1_234_000_000_000n)).toBe('1\u00a0234');
  });

  it('converts to dollars once the price is known', () => {
    expect(formatUsd(2_000_000_000n, null)).toBe('—');
    expect(formatUsd(2_000_000_000n, 105.5)).toBe('$211');
  });

  it('shortens addresses and formats times', () => {
    expect(shortAddress('8uiVKnUeC7L4KG93MWvfhRoJkprdAUZ3eg3nzzKfowq2')).toBe('8uiV…owq2');
    expect(shortAddress('abc')).toBe('abc');
    expect(formatUtcTime(86_400 + 3_661)).toBe('01:01:01');
  });

  it('formats odds', () => {
    expect(formatPercent(null)).toBe('—');
    expect(formatPercent(0.225)).toBe('22.5%');
    expect(formatPercent(1)).toBe('100.0%');
  });

  it("writes dollars, odds, units and dates the way the page's language does", () => {
    expect(formatUsd(2_000_000_000n, 105.5, 'de')).toBe('211\u00a0$');
    expect(formatPercent(0.225, 'fr')).toBe('22,5\u00a0%');
    expect(formatUnit(3, 'minute', 'en-US', 'long')).toBe('3 minutes');
    expect(formatDate('2026-10-21')).toBe('October 21, 2026');
    expect(formatDate('2026-10-21', 'th-u-ca-gregory')).toContain('2026');
  });

  it('keeps lottery numbers and SOL in one style for every language', () => {
    expect(formatNumber(1_000_000_000)).toBe('1\u00a0000\u00a0000\u00a0000');
    expect(formatSol(1_500_000_000n)).toBe('1.5');
  });
});

describe('languages', () => {
  it("matches browser language tags to the site's languages", () => {
    expect(matchLocale('fr-CA')).toBe('fr');
    expect(matchLocale('pt-BR')).toBe('pt');
    expect(matchLocale('zh-Hant-HK')).toBe('zh-tw');
    expect(matchLocale('zh')).toBe('zh-cn');
    expect(matchLocale('iw')).toBe('he');
    expect(matchLocale('sw')).toBeUndefined();
  });
});

describe('countries', () => {
  it('lists every ISO code once', () => {
    expect(COUNTRY_CODES).toHaveLength(249);
    expect(new Set(COUNTRY_CODES).size).toBe(COUNTRY_CODES.length);
    expect(COUNTRY_CODES.every((code) => /^[A-Z]{2}$/.test(code))).toBe(true);
  });

  it("names and sorts countries in the page's language", () => {
    expect(countryName('ES', 'es')).toBe('España');
    expect(countryName(null, 'fr', 'Privé')).toBe('Privé');
    const options = countryOptions('de', 'Privat');
    expect(options[0]).toMatchObject({ value: null, label: 'Privat' });
    expect(options.find((o) => o.value === 'DE')?.label).toBe('Deutschland');
  });

  it('names countries and keeps "private" first', () => {
    expect(countryName('ES')).toBe('Spain');
    expect(countryName(null)).toBe('Private');
    const options = countryOptions();
    expect(options[0]).toMatchObject({ value: null, label: 'Private' });
    expect(options.find((o) => o.value === 'JP')?.flag).toBe('🇯🇵');
  });
});

describe('errors', () => {
  it('explains program errors', () => {
    expect(friendlyError(programError(6005))).toBe("Tickets can only be bought for today's round.");
    expect(friendlyError(programError(6004))).toBe('Ticket sales are paused.');
  });

  it('explains a taken number', () => {
    expect(friendlyError(programError(0))).toMatch(/already holds this number/);
  });

  it("explains errors in the page's language", () => {
    const t = (key: string) => `[${key}]`;
    expect(friendlyError(programError(6004), t)).toBe('[errors.program.paused]');
    expect(friendlyError(programError(0), t)).toBe('[errors.taken]');
    expect(friendlyError(Object.assign(new Error('User rejected'), { code: 4001 }), t)).toBe('[errors.rejected]');
    expect(friendlyError(new Error('RPC is down'), t)).toBe('RPC is down');
  });

  it('recognises a cancelled wallet prompt', () => {
    const rejected = Object.assign(new Error('User rejected the request.'), { code: 4001 });
    expect(isUserRejection(rejected)).toBe(true);
    expect(friendlyError(rejected)).toBe('You cancelled the request in your wallet.');
    expect(isUserRejection(programError(6000))).toBe(false);
  });
});
