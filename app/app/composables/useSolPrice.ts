const price = ref<number | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;

async function load() {
  try {
    const data = await $fetch<{ usd: number }>('/api/price');
    price.value = data.usd;
  } catch {
    // Keep the last price; the pot is still shown in SOL.
  }
}

/** SOL/USD price from the app's own `/api/price` endpoint, refreshed every minute. */
export function useSolPrice() {
  if (import.meta.client && !timer) {
    void load();
    timer = setInterval(load, 60_000);
  }
  return readonly(price);
}
