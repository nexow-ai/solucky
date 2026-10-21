/**
 * The live table: who else is on the play page right now, over the app's own
 * WebSocket (server/routes/_live.ts). Presence only. Tickets, pots and draws
 * come from the chain (useLottery), where nobody can fake them.
 *
 * One connection per browser tab, opened by the first component that uses it
 * and closed with the last. Reconnects with backoff; a dropped socket only
 * dims the "live" light, the game keeps working without it.
 */
export type LiveStatus = 'connecting' | 'live' | 'offline';

export interface LivePeer {
  id: string;
  cc: string | null;
  pick: boolean;
}

export type LiveEvent = { t: 'join'; peer: LivePeer; online: number } | { t: 'leave'; id: string; online: number };

type ServerMessage =
  | { t: 'hello'; id: string; online: number; peers: LivePeer[] }
  | { t: 'join'; id: string; cc: string | null; online: number }
  | { t: 'leave'; id: string; online: number }
  | { t: 'peer'; id: string; cc: string | null }
  | { t: 'pick'; id: string; on: boolean };

const HEARTBEAT_MS = 20_000;
/** The keypad counts as "in use" this long after the last key. */
const PICK_IDLE_MS = 6_000;

const status = ref<LiveStatus>('offline');
const online = ref(0);
const peers = shallowRef(new Map<string, LivePeer>());
const listeners = new Set<(event: LiveEvent) => void>();

let socket: WebSocket | null = null;
let users = 0;
let attempt = 0;
let announced = false;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
let pickTimer: ReturnType<typeof setTimeout> | undefined;
let picking = false;
let watchingCountry = false;

function setPeers(update: (map: Map<string, LivePeer>) => void) {
  const next = new Map(peers.value);
  update(next);
  peers.value = next;
}

function emit(event: LiveEvent) {
  for (const listener of listeners) listener(event);
}

export function useLive() {
  const { country } = useCountry();

  function send(message: object) {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  }

  function hello(fresh: boolean) {
    send({ t: 'hi', cc: country.value, fresh });
  }

  function onMessage(raw: MessageEvent) {
    let message: ServerMessage;
    try {
      message = JSON.parse(String(raw.data));
    } catch {
      return;
    }
    switch (message.t) {
      case 'hello':
        online.value = message.online;
        peers.value = new Map(message.peers.map((p) => [p.id, p]));
        status.value = 'live';
        attempt = 0;
        // Announce ourselves once per visit; a reconnect is not a new player.
        hello(!announced);
        announced = true;
        if (picking) send({ t: 'pick', on: true });
        break;
      case 'join': {
        const peer = { id: message.id, cc: message.cc, pick: false };
        online.value = message.online;
        setPeers((map) => map.set(peer.id, peer));
        emit({ t: 'join', peer, online: message.online });
        break;
      }
      case 'leave':
        online.value = message.online;
        setPeers((map) => map.delete(message.id));
        emit({ t: 'leave', id: message.id, online: message.online });
        break;
      case 'peer':
        setPeers((map) => map.set(message.id, { ...(map.get(message.id) ?? { pick: false }), id: message.id, cc: message.cc }));
        break;
      case 'pick':
        setPeers((map) => map.set(message.id, { ...(map.get(message.id) ?? { cc: null }), id: message.id, pick: message.on }));
        break;
    }
  }

  function connect() {
    clearTimeout(reconnectTimer);
    status.value = 'connecting';
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/_live`);
    } catch {
      scheduleReconnect();
      return;
    }
    socket = ws;
    ws.addEventListener('message', onMessage);
    ws.addEventListener('close', () => {
      if (socket !== ws) return;
      socket = null;
      clearInterval(heartbeatTimer);
      status.value = 'offline';
      peers.value = new Map();
      if (users > 0) scheduleReconnect();
    });
    // The close event follows and handles the retry.
    ws.addEventListener('error', () => {});
    heartbeatTimer = setInterval(() => hello(false), HEARTBEAT_MS);
  }

  function scheduleReconnect() {
    status.value = 'offline';
    const delay = Math.min(30_000, 1_000 * 2 ** attempt) * (0.75 + Math.random() * 0.5);
    attempt++;
    reconnectTimer = setTimeout(connect, delay);
  }

  function disconnect() {
    clearTimeout(reconnectTimer);
    clearInterval(heartbeatTimer);
    const ws = socket;
    socket = null;
    ws?.close(1000);
    status.value = 'offline';
    peers.value = new Map();
  }

  /** Tells the table the keypad is in use; it clears itself after a few idle seconds. */
  function touchKeypad() {
    clearTimeout(pickTimer);
    if (!picking) {
      picking = true;
      send({ t: 'pick', on: true });
    }
    pickTimer = setTimeout(() => {
      picking = false;
      send({ t: 'pick', on: false });
    }, PICK_IDLE_MS);
  }

  /** Subscribes to joins and leaves; the returned function unsubscribes. */
  function onEvent(listener: (event: LiveEvent) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  onMounted(() => {
    if (++users === 1) connect();
  });
  onBeforeUnmount(() => {
    if (--users === 0) disconnect();
  });

  // A new flag in the picker reaches the table at once (one watcher per tab).
  if (import.meta.client && !watchingCountry) {
    watchingCountry = true;
    effectScope(true).run(() => watch(country, () => hello(false)));
  }

  const others = computed(() => [...peers.value.values()]);
  return {
    status: readonly(status),
    online: readonly(online),
    others,
    picking: computed(() => others.value.filter((p) => p.pick).length),
    touchKeypad,
    onEvent,
  };
}
