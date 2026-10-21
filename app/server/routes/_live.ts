/**
 * WebSocket for the live table (see server/utils/live.ts for the protocol).
 *
 * On Cloudflare the `cloudflare_durable` preset sends every connection to one
 * Durable Object, so all players share one table. That object can hibernate
 * between messages, which empties each connection's memory: the client's
 * heartbeat puts the country back, and only its first, `fresh` hello is
 * announced, so a wake-up never replays joins.
 */
import { allow, countryFromHeaders, LIVE_TOPIC, parseClientMessage, type ServerMessage } from '../utils/live';

type Hooks = NonNullable<Parameters<typeof defineWebSocketHandler>[0]>;
type Peer = Parameters<NonNullable<Hooks['open']>>[0];

interface PeerState {
  cc: string | null;
  pick: boolean;
  announced: boolean;
  bucket: { tokens: number; at: number };
}

function stateOf(peer: Peer): PeerState {
  const context = peer.context as { live?: PeerState };
  context.live ??= { cc: null, pick: false, announced: false, bucket: { tokens: 6, at: Date.now() } };
  return context.live;
}

const others = (peer: Peer) => [...peer.peers].filter((p) => p.id !== peer.id);
const send = (peer: Peer, message: ServerMessage) => peer.send(JSON.stringify(message));
const publish = (peer: Peer, message: ServerMessage) => peer.publish(LIVE_TOPIC, JSON.stringify(message));

function header(peer: Peer, name: string): string | null {
  const headers = peer.request?.headers as Headers | Record<string, string> | undefined;
  if (!headers) return null;
  return typeof (headers as Headers).get === 'function'
    ? (headers as Headers).get(name)
    : ((headers as Record<string, string>)[name] ?? null);
}

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe(LIVE_TOPIC);
    const state = stateOf(peer);
    state.cc = countryFromHeaders((name) => header(peer, name));
    send(peer, {
      t: 'hello',
      id: peer.id,
      online: peer.peers.size,
      peers: others(peer).map((p) => ({ id: p.id, cc: stateOf(p).cc, pick: stateOf(p).pick })),
    });
  },

  message(peer, raw) {
    const state = stateOf(peer);
    if (!allow(state.bucket, Date.now())) return;
    const message = parseClientMessage(raw.text());
    if (!message) return;

    if (message.t === 'hi') {
      const cc = message.cc ?? state.cc;
      const changed = cc !== state.cc;
      state.cc = cc;
      if (message.fresh && !state.announced) {
        state.announced = true;
        publish(peer, { t: 'join', id: peer.id, cc, online: peer.peers.size });
      } else if (changed) {
        publish(peer, { t: 'peer', id: peer.id, cc });
      }
      return;
    }

    if (message.t === 'pick' && message.on !== state.pick) {
      state.pick = message.on;
      publish(peer, { t: 'pick', id: peer.id, on: message.on });
    }
  },

  close(peer) {
    publish(peer, { t: 'leave', id: peer.id, online: others(peer).length });
  },
});
