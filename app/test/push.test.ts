import { describe, expect, it } from 'vitest';

import { drawMessage, parseDraw, parseGames, parseSubscription, sameSecret } from '../server/utils/push';
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
      privateKey: await crypto.subtle.importKey(
        'jwk',
        p256Jwk(fromBase64Url(RFC.asPublic), RFC.asPrivate),
        algorithm,
        false,
        ['deriveBits'],
      ),
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

describe('draw notifications', () => {
  const keys = { p256dh: RFC.uaPublic, auth: RFC.auth };

  it('only keeps subscriptions to the browsers’ push services', () => {
    const fcm = { endpoint: 'https://fcm.googleapis.com/fcm/send/abc', keys };
    expect(parseSubscription(fcm)).toEqual(fcm);
    expect(parseSubscription({ ...fcm, endpoint: 'https://web.push.apple.com/QGuQ' })).not.toBeNull();
    expect(parseSubscription({ ...fcm, endpoint: 'https://wns2-par02p.notify.windows.com/w/?token=x' })).not.toBeNull();
    // Anything else could point our server at another host.
    expect(parseSubscription({ ...fcm, endpoint: 'https://example.com/fcm.googleapis.com' })).toBeNull();
    expect(parseSubscription({ ...fcm, endpoint: 'http://fcm.googleapis.com/fcm/send/abc' })).toBeNull();
    expect(parseSubscription({ ...fcm, endpoint: 'https://fcm.googleapis.com.evil.io/x' })).toBeNull();
    expect(parseSubscription({ ...fcm, keys: { ...keys, auth: 'c2hvcnQ' } })).toBeNull();
    expect(parseSubscription(null)).toBeNull();
  });

  it('reads games and draws strictly', () => {
    expect(parseGames([2, 0, 2])).toEqual([0, 2]);
    expect(parseGames([])).toEqual([]);
    expect(parseGames([3])).toBeNull();
    expect(parseGames('0')).toBeNull();
    const draw = { kind: 0, period: 20_382, drawnNumber: 1_234_567, winningNumber: 1_234_500, payout: '80000000' };
    expect(parseDraw(draw)).toEqual({ ...draw, payout: 80_000_000n });
    expect(parseDraw({ ...draw, payout: 80_000_000 })).toBeNull();
    expect(parseDraw({ ...draw, kind: 7 })).toBeNull();
    expect(parseDraw({ ...draw, period: -1 })).toBeNull();
  });

  it('checks the crank’s secret', async () => {
    expect(await sameSecret('Bearer s3cret', 'Bearer s3cret')).toBe(true);
    expect(await sameSecret('Bearer s3cre', 'Bearer s3cret')).toBe(false);
    expect(await sameSecret(undefined, 'Bearer s3cret')).toBe(false);
  });

  it('tells each browser the result in its language', async () => {
    const draw = { kind: 0, period: 20_382, drawnNumber: 1_234_567, winningNumber: 1_234_500, payout: 80_000_000n };
    expect(await drawMessage(draw, 'en')).toEqual({
      title: 'Daily lottery',
      body: 'Round 2025-10-21: 1\u00a0234\u00a0567 was drawn. The closest ticket, 1\u00a0234\u00a0500, wins ◎0.08.',
      url: '/rounds/daily/2025-10-21',
      tag: 'draw-0',
    });
    const guess = await drawMessage({ ...draw, kind: 2, period: 3 }, 'fr');
    expect(guess.url).toBe('/fr/rounds/guess/3');
    expect(guess.body).toContain('#3');
    // Right to left: every value is isolated, as on the site.
    expect((await drawMessage(draw, 'ar')).body).toContain('\u20681\u00a0234\u00a0567\u2069');
  });
});
