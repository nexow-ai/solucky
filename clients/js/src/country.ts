/** Tickets store an ISO 3166-1 alpha-2 code as two ASCII bytes, or two zero bytes when private. */
export const NO_COUNTRY = new Uint8Array([0, 0]);

const CODE = /^[A-Z]{2}$/;

/** `'ES'` → `[69, 83]`; anything that is not a two-letter code → `[0, 0]`. */
export function countryToBytes(code: string | null | undefined): Uint8Array {
  const upper = (code ?? '').trim().toUpperCase();
  if (!CODE.test(upper)) return NO_COUNTRY;
  return new Uint8Array([upper.charCodeAt(0), upper.charCodeAt(1)]);
}

/** `[69, 83]` → `'ES'`; `[0, 0]` or invalid bytes → `null`. */
export function countryFromBytes(bytes: ArrayLike<number>): string | null {
  if (bytes.length !== 2) return null;
  const code = String.fromCharCode(bytes[0]!, bytes[1]!);
  return CODE.test(code) ? code : null;
}

/** `'ES'` → 🇪🇸; `null` → 🏴‍☠️, the flag S☉Lucky has always used for private players. */
export function flagEmoji(code: string | null): string {
  if (!code || !CODE.test(code)) return '🏴‍☠️';
  return String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}
