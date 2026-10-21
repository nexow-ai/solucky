import { countryFromBytes, flagEmoji } from '@solucky/client';

/** One line of the table's live feed. */
export interface FeedItem {
  key: string;
  kind: 'join' | 'ticket';
  cc: string | null;
  at: number;
  owner?: string;
  number?: number;
  mine?: boolean;
}

const FEED_SIZE = 16;
/** Joins this close together share one toast. */
const JOIN_BATCH_MS = 4_000;
/** At most one ticket toast this often; the feed still shows every ticket. */
const TICKET_TOAST_MS = 2_500;

const feed = shallowRef<FeedItem[]>([]);
let started = false;

function push(item: FeedItem) {
  feed.value = [item, ...feed.value].slice(0, FEED_SIZE);
}

/**
 * What happens at the table, as it happens: players joining (from the live
 * socket) and tickets landing (from the chain, so they are real). Feeds the
 * ticker on the play page and raises toasts; your own tickets already get the
 * transaction toast, so they only join the feed.
 */
export function useTableFeed() {
  const { tickets, today, loading, pot } = useLottery();
  const { address } = useWallet();
  const live = useLive();
  const toast = useToast();
  const sound = useSound();

  if (import.meta.client && !started) {
    started = true;
    effectScope(true).run(() => {
      // Joins: batched, so a rush of players is one toast that counts up.
      let batch: { id: string | number; flags: string[]; until: number } | null = null;
      live.onEvent((event) => {
        if (event.t !== 'join') return;
        const { peer, online } = event;
        push({ key: `join:${peer.id}:${Date.now()}`, kind: 'join', cc: peer.cc, at: Date.now() });
        const now = Date.now();
        if (batch && now < batch.until) {
          batch.flags.push(flagEmoji(peer.cc));
          batch.until = now + JOIN_BATCH_MS;
          toast.update(batch.id, {
            title: `${batch.flags.length} new players joined the table`,
            description: `${batch.flags.slice(-8).join(' ')} · ${online} here now`,
          });
          return;
        }
        const shown = toast.add({
          title: `${flagEmoji(peer.cc)} A new player joined the table`,
          description: `${online} here now`,
          icon: 'i-lucide-user-round-plus',
          color: 'secondary',
          duration: 4_500,
          ui: { root: 'glass-toast glass-toast-join' },
        });
        batch = { id: shown.id, flags: [flagEmoji(peer.cc)], until: now + JOIN_BATCH_MS };
      });

      // Tickets: everything already in the round when the page loads is the
      // baseline; anything after that just happened.
      const seen = new Set<string>();
      let baselineDay: number | null = null;
      let lastTicketToast = 0;
      watch(
        [tickets, today, loading],
        ([list, day, isLoading]) => {
          if (isLoading) return;
          if (baselineDay !== day) {
            baselineDay = day;
            seen.clear();
            for (const t of list) seen.add(t.address);
            return;
          }
          const fresh = list.filter((t) => !seen.has(t.address));
          for (const t of fresh) seen.add(t.address);
          for (const t of fresh) {
            const cc = countryFromBytes(t.data.country);
            const mine = t.data.owner === address.value;
            push({
              key: `ticket:${t.address}`,
              kind: 'ticket',
              cc,
              at: Date.now(),
              owner: t.data.owner,
              number: t.data.number,
              mine,
            });
            const now = Date.now();
            if (mine || now - lastTicketToast < TICKET_TOAST_MS) continue;
            lastTicketToast = now;
            sound.play('pot');
            toast.add({
              title: `${flagEmoji(cc)} ${shortAddress(t.data.owner, 4)} locked in ${formatNumber(t.data.number)}`,
              description: `The pot is now ◎${formatSol(pot.value, 3)} with ${list.length} tickets`,
              icon: 'i-lucide-ticket',
              color: 'primary',
              duration: 5_000,
              ui: { root: 'glass-toast glass-toast-ticket' },
            });
          }
        },
        { immediate: true },
      );
    });
  }

  return { feed: readonly(feed) };
}
