/**
 * Web Push on WebCrypto alone, so it runs on Node and on Cloudflare Workers:
 * a message (RFC 8030) signed for our VAPID key (RFC 8292), with its payload
 * encrypted for the browser that subscribed (RFC 8291, `aes128gcm`).
 */

/** What `PushSubscription.toJSON()` gives in the browser. */
export interface Subscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/** The server's key pair (`bun run vapid`) and a contact for the push services. */
export interface Vapid {
  /** Uncompressed P-256 point, base64url: what browsers subscribe with. */
  publicKey: string;
  /** The private scalar `d`, base64url. */
  privateKey: string;
  /** `mailto:` or `https:` address. */
  subject: string;
}

const utf8 = new TextEncoder();
export const toBase64Url = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64url');
export const fromBase64Url = (text: string) => new Uint8Array(Buffer.from(text, 'base64url'));
const concat = (...parts: Uint8Array[]) => new Uint8Array(Buffer.concat(parts));

/** A P-256 key as a JWK, from its uncompressed public point (and private scalar). */
export function p256Jwk(publicKey: Uint8Array, d?: string): JsonWebKey {
  const x = toBase64Url(publicKey.slice(1, 33));
  const y = toBase64Url(publicKey.slice(33, 65));
  return { kty: 'EC', crv: 'P-256', x, y, ...(d && { d }) };
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8));
}

/**
 * The encrypted body of one message, as RFC 8291 builds it: one record, a
 * fresh key pair and salt per message. Tests pass in the RFC's own.
 */
export async function encryptPayload(
  plaintext: Uint8Array,
  keys: Subscription['keys'],
  local?: CryptoKeyPair,
  salt = crypto.getRandomValues(new Uint8Array(16)),
): Promise<Uint8Array> {
  local ??= (await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, [
    'deriveBits',
  ])) as CryptoKeyPair;
  const uaPublic = fromBase64Url(keys.p256dh);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', local.publicKey));
  const peer = await crypto.subtle.importKey('raw', uaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: peer }, local.privateKey, 256));

  const ikm = await hkdf(fromBase64Url(keys.auth), shared, concat(utf8.encode('WebPush: info\0'), uaPublic, asPublic), 32);
  const cek = await hkdf(salt, ikm, utf8.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, utf8.encode('Content-Encoding: nonce\0'), 12);
  const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  // 0x02 marks the last (and only) record.
  const sealed = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aes, concat(plaintext, new Uint8Array([2])));

  // Header: salt, record size (4096), key id length, key id (our public key).
  const header = new Uint8Array(21);
  header.set(salt);
  new DataView(header.buffer).setUint32(16, 4096);
  header[20] = asPublic.length;
  return concat(header, asPublic, new Uint8Array(sealed));
}

/** The `Authorization` header for one push service: a JWT signed with our VAPID key, valid 12 hours. */
export async function vapidAuthorization(endpoint: string, vapid: Vapid): Promise<string> {
  const jwk = p256Jwk(fromBase64Url(vapid.publicKey), vapid.privateKey);
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const part = (value: object) => toBase64Url(utf8.encode(JSON.stringify(value)));
  const claims = { aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: vapid.subject };
  const unsigned = `${part({ typ: 'JWT', alg: 'ES256' })}.${part(claims)}`;
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, utf8.encode(unsigned));
  return `vapid t=${unsigned}.${toBase64Url(new Uint8Array(signature))}, k=${vapid.publicKey}`;
}

/**
 * Sends one message and returns the push service's HTTP status: 201 when
 * it took the message, 404 or 410 when the subscription is gone. A newer
 * message with the same `topic` replaces one still waiting for delivery.
 */
export async function sendPush(
  subscription: Subscription,
  payload: string,
  vapid: Vapid,
  options: { ttl: number; topic?: string },
): Promise<number> {
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      Authorization: await vapidAuthorization(subscription.endpoint, vapid),
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: String(options.ttl),
      Urgency: 'normal',
      ...(options.topic && { Topic: options.topic }),
    },
    body: await encryptPayload(utf8.encode(payload), subscription.keys),
  });
  await response.body?.cancel();
  return response.status;
}
