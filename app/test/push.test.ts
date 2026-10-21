import { describe, expect, it } from 'vitest';

import { encryptPayload, fromBase64Url, p256Jwk, toBase64Url, vapidAuthorization } from '../server/utils/webpush';

/** RFC 8291, section 5 and appendix A. */
const RFC = {
  plaintext: 'V2hlbiBJIGdyb3cgdXAsIEkgd2FudCB0byBiZSBhIHdhdGVybWVsb24',
  asPublic: 'BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8',
  asPrivate: 'yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw',
  uaPublic: 'BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4',
  auth: 'BTBZMqHH6r4Tts7J_aSIgg',
  salt: 'DGv6ra1nlYgDCS1FRnbzlw',
  header:
    'DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8',
  ciphertext: '8pfeW0KbunFT06SuDKoJH9Ql87S1QUrdirN6GcG7sFz1y1sqLgVi1VhjVkHsUoEsbI_0LpXMuGvnzQ',
};

describe('web push', () => {
  it('encrypts exactly like RFC 8291', async () => {
    const algorithm = { name: 'ECDH', namedCurve: 'P-256' };
    const local = {
      publicKey: await crypto.subtle.importKey('raw', fromBase64Url(RFC.asPublic), algorithm, true, []),
      privateKey: await crypto.subtle.importKey('jwk', p256Jwk(fromBase64Url(RFC.asPublic), RFC.asPrivate), algorithm, false, [
        'deriveBits',
      ]),
    };
    const body = await encryptPayload(
      fromBase64Url(RFC.plaintext),
      { p256dh: RFC.uaPublic, auth: RFC.auth },
      local,
      fromBase64Url(RFC.salt),
    );
    expect(toBase64Url(body.slice(0, 86))).toBe(RFC.header);
    expect(toBase64Url(body.slice(86))).toBe(RFC.ciphertext);
  });

  it('signs a VAPID token the public key verifies', async () => {
    const pair = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
      'sign',
      'verify',
    ])) as CryptoKeyPair;
    const publicKey = toBase64Url(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey)));
    const { d } = await crypto.subtle.exportKey('jwk', pair.privateKey);
    const vapid = { publicKey, privateKey: d!, subject: 'mailto:admin@nexow.ai' };

    const header = await vapidAuthorization('https://push.example/send/abc', vapid);
    const [, jwt, k] = header.match(/^vapid t=([^,]+), k=(.+)$/)!;
    expect(k).toBe(publicKey);
    const [head, claims, signature] = jwt!.split('.');
    expect(JSON.parse(Buffer.from(claims!, 'base64url').toString())).toMatchObject({
      aud: 'https://push.example',
      sub: 'mailto:admin@nexow.ai',
    });
    const valid = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      pair.publicKey,
      fromBase64Url(signature!),
      new TextEncoder().encode(`${head}.${claims}`),
    );
    expect(valid).toBe(true);
  });
});
