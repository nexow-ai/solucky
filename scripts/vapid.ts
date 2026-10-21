/**
 * New keys for the draw notifications (Web Push): the app's VAPID key pair
 * and the secret the crank reports draws with. Prints them as settings;
 * NUXT_PUBLIC_VAPID_KEY is public, keep the other values secret.
 *
 *   bun run vapid
 *
 * A new key pair cuts off the browsers subscribed with the old one: they
 * have to turn notifications on again.
 */
const pair = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
  'sign',
  'verify',
])) as CryptoKeyPair;
const base64url = (bytes: ArrayBuffer | Uint8Array) => Buffer.from(new Uint8Array(bytes)).toString('base64url');
const publicKey = base64url(await crypto.subtle.exportKey('raw', pair.publicKey));
const { d } = await crypto.subtle.exportKey('jwk', pair.privateKey);
const secret = base64url(crypto.getRandomValues(new Uint8Array(32)));

console.log(`# App (app/.env, or the host's settings and secrets)
NUXT_PUBLIC_VAPID_KEY=${publicKey}
NUXT_VAPID_PRIVATE_KEY=${d}
NUXT_PUSH_SECRET=${secret}

# Crank (.env): the site's URL, and the same secret
SOLUCKY_APP_URL=
SOLUCKY_PUSH_SECRET=${secret}`);

export {};
