import { describe, expect, it } from 'vitest';

import { allow, countryFromHeaders, MAX_MESSAGE_LENGTH, parseClientMessage, validCountry } from '../server/utils/live';

describe('live table protocol', () => {
  it('accepts hellos and keypad updates', () => {
    expect(parseClientMessage('{"t":"hi","cc":"es","fresh":true}')).toEqual({ t: 'hi', cc: 'ES', fresh: true });
    expect(parseClientMessage('{"t":"hi"}')).toEqual({ t: 'hi', cc: null, fresh: false });
    expect(parseClientMessage('{"t":"pick","on":true}')).toEqual({ t: 'pick', on: true });
  });

  it('drops anything malformed, oversized or unknown', () => {
    expect(parseClientMessage('not json')).toBeNull();
    expect(parseClientMessage('null')).toBeNull();
    expect(parseClientMessage('{"t":"pick","on":"yes"}')).toBeNull();
    expect(parseClientMessage('{"t":"buy","number":7}')).toBeNull();
    expect(parseClientMessage(`{"t":"hi","cc":"${'x'.repeat(MAX_MESSAGE_LENGTH)}"}`)).toBeNull();
  });

  it('keeps only real country codes', () => {
    expect(validCountry('fr')).toBe('FR');
    expect(validCountry('XX')).toBeNull();
    expect(validCountry('T1')).toBeNull();
    expect(validCountry('FRA')).toBeNull();
    expect(validCountry(42)).toBeNull();
    // A fake flag in a hello is ignored, not passed on.
    expect(parseClientMessage('{"t":"hi","cc":"<script>"}')).toEqual({ t: 'hi', cc: null, fresh: false });
  });

  it('reads the country the edge network already set', () => {
    const headers: Record<string, string> = { 'x-vercel-ip-country': 'jp' };
    expect(countryFromHeaders((name) => headers[name])).toBe('JP');
    expect(countryFromHeaders(() => 'XX')).toBeNull();
    expect(countryFromHeaders(() => undefined)).toBeNull();
  });

  it('rate-limits each connection', () => {
    const bucket = { tokens: 6, at: 0 };
    const sent = Array.from({ length: 10 }, () => allow(bucket, 0));
    expect(sent.filter(Boolean)).toHaveLength(6);
    // Refills at half a message per second.
    expect(allow(bucket, 1_000)).toBe(false);
    expect(allow(bucket, 2_000)).toBe(true);
  });
});
