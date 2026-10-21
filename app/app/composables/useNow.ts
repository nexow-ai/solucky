import { fetchSysvarClock } from '@solana/sysvars';

const now = ref(Date.now());
/** Cluster time minus device time, so a wrong device clock never picks the wrong day. */
let offset = 0;
let timer: ReturnType<typeof setInterval> | undefined;

async function syncWithCluster(client: SoluckyClient) {
  try {
    const sent = Date.now();
    const clock = await fetchSysvarClock(client.rpc, { commitment: 'confirmed' });
    const received = Date.now();
    offset = Number(clock.unixTimestamp) * 1000 - (sent + received) / 2;
    now.value = Date.now() + offset;
  } catch {
    // Keep the device clock.
  }
}

/** The cluster's current time in milliseconds, ticking once a second (shared by every caller). */
export function useNow() {
  if (import.meta.client && !timer) {
    const { client } = useSolana();
    timer = setInterval(() => (now.value = Date.now() + offset), 1_000);
    void syncWithCluster(client);
    setInterval(() => void syncWithCluster(client), 5 * 60_000);
  }
  return readonly(now);
}
