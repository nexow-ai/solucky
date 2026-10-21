/**
 * The live table: who is on the play page right now. Presence only, never
 * game state: tickets, pots and draws come from the chain, where nobody can
 * fake them. A connection is anonymous (a random id), shows an optional
 * country flag, and can say "picking a number" while its keypad is in use.
 *
 * Pure helpers here, so they can be tested without a socket; the handler is
 * in server/routes/_live.ts.
 */

/** Everyone on the play page is subscribed to this topic. */
export const LIVE_TOPIC = 'table';

/** Anything longer is not one of our messages. */
export const MAX_MESSAGE_LENGTH = 200;

/** Messages a client may send. */
export type ClientMessage =
  /** Hello, and every 20 s a heartbeat. `fresh` only on the first one of a connection. */
  | { t: 'hi'; cc: string | null; fresh: boolean }
  /** The keypad is (or stopped being) in use. */
  | { t: 'pick'; on: boolean };

export interface LivePeer {
  id: string;
  cc: string | null;
  pick: boolean;
}

/** Messages the server sends. `online` counts every open connection, this one included. */
export type ServerMessage =
  | { t: 'hello'; id: string; online: number; peers: LivePeer[] }
  | { t: 'join'; id: string; cc: string | null; online: number }
  | { t: 'leave'; id: string; online: number }
  | { t: 'peer'; id: string; cc: string | null }
  | { t: 'pick'; id: string; on: boolean };

/** An ISO 3166 alpha-2 code, as the flag picker and the edge headers use. Cloudflare's XX (unknown) and T1 (Tor) are not countries. */
export function validCountry(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== 'XX' && code !== 'T1' ? code : null;
}

const COUNTRY_HEADERS = ['cf-ipcountry', 'x-vercel-ip-country', 'cloudfront-viewer-country', 'x-country-code'];

/** The visitor's country as the host's edge network already knows it, or null. No IP is read or kept. */
export function countryFromHeaders(get: (name: string) => string | null | undefined): string | null {
  for (const name of COUNTRY_HEADERS) {
    const code = validCountry(get(name));
    if (code) return code;
  }
  return null;
}

/** Parses a client message, or returns null for anything malformed, oversized or unknown. */
export function parseClientMessage(raw: string): ClientMessage | null {
  if (raw.length > MAX_MESSAGE_LENGTH) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const message = data as Record<string, unknown>;
  if (message.t === 'hi') return { t: 'hi', cc: validCountry(message.cc), fresh: message.fresh === true };
  if (message.t === 'pick' && typeof message.on === 'boolean') return { t: 'pick', on: message.on };
  return null;
}

/**
 * A token bucket per connection: `burst` messages at once, refilled at
 * `perSecond`. Returns false when the connection is over its budget, and the
 * message should be dropped.
 */
export function allow(bucket: { tokens: number; at: number }, now: number, burst = 6, perSecond = 0.5): boolean {
  bucket.tokens = Math.min(burst, bucket.tokens + ((now - bucket.at) / 1000) * perSecond);
  bucket.at = now;
  if (bucket.tokens < 1) return false;
  bucket.tokens -= 1;
  return true;
}
