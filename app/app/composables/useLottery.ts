import type { Account, Address } from '@solana/kit';
import {
  type Config,
  countryFromBytes,
  countryToBytes,
  dayOf,
  DRAW_WINDOW_SLOTS,
  feeFor,
  fetchOwnerTickets,
  fetchRounds,
  fetchRoundTickets,
  fetchTicketByIndex,
  findConfigPda,
  findRoundPda,
  formatDay,
  getCloseTicketInstruction,
  type Round,
  RoundStatus,
  type Ticket,
} from '@solucky/client';

const config = shallowRef<Account<Config> | null>(null);
const configMissing = ref(false);
const today = ref(dayOf());
const round = shallowRef<Account<Round> | null>(null);
const tickets = shallowRef<Account<Ticket>[]>([]);
const rounds = shallowRef<Account<Round>[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const busy = ref(false);

let started = false;
let subscription: AbortController | undefined;

/**
 * Live on-chain state of the lottery: the config, today's round and tickets,
 * and every past round. Updates from account notifications, with polling as a
 * fallback, and exposes the player actions.
 */
export function useLottery() {
  const { client, programAddress } = useSolana();
  const { address: wallet, refreshBalance } = useWallet();
  const { run } = useTransaction();
  const toast = useToast();

  async function loadConfig() {
    const [address] = await findConfigPda({ programAddress });
    const account = await client.solucky.accounts.config.fetchMaybe(address, { commitment: 'confirmed' });
    config.value = account.exists ? account : null;
    configMissing.value = !account.exists;
  }

  async function loadToday() {
    const [address] = await findRoundPda({ day: today.value }, { programAddress });
    const account = await client.solucky.accounts.round.fetchMaybe(address, { commitment: 'confirmed' });
    if (!account.exists) {
      round.value = null;
      tickets.value = [];
      return;
    }
    const list = await fetchRoundTickets(client.rpc, address, programAddress);
    round.value = account;
    tickets.value = list;
  }

  async function loadHistory() {
    rounds.value = await fetchRounds(client.rpc, programAddress);
  }

  async function refresh() {
    try {
      await Promise.all([loadConfig(), loadToday(), loadHistory()]);
      error.value = null;
    } catch (cause) {
      error.value = `Could not reach the Solana RPC endpoint (${friendlyError(cause)})`;
    } finally {
      loading.value = false;
    }
  }

  /** Reloads today's round whenever its account changes. */
  async function watchToday() {
    subscription?.abort();
    const controller = new AbortController();
    subscription = controller;
    try {
      const [address] = await findRoundPda({ day: today.value }, { programAddress });
      const notifications = await client.rpcSubscriptions
        .accountNotifications(address, { commitment: 'confirmed', encoding: 'base64' })
        .subscribe({ abortSignal: controller.signal });
      for await (const _ of notifications) {
        await loadToday().catch(() => {});
      }
    } catch {
      // Websockets are optional: polling below keeps the page fresh.
    }
  }

  if (import.meta.client && !started) {
    started = true;
    void refresh();
    void watchToday();
    setInterval(() => void loadToday().catch(() => {}), 15_000);
    setInterval(() => void Promise.all([loadConfig(), loadHistory()]).catch(() => {}), 60_000);
    // At midnight UTC (cluster time) a new round starts. The watcher lives in
    // its own scope so it outlives the component that first used the lottery.
    const now = useNow();
    effectScope(true).run(() =>
      watch(now, (ms) => {
        const day = dayOf(ms);
        if (day !== today.value) {
          today.value = day;
          void refresh();
          void watchToday();
        }
      }),
    );
  }

  const owners = computed(() => new Set(tickets.value.map((t) => t.data.owner)));
  const countries = computed(() => new Set(tickets.value.map((t) => countryFromBytes(t.data.country)).filter(Boolean)));
  const myTickets = computed(() => tickets.value.filter((t) => t.data.owner === wallet.value));
  const ticketPrice = computed(() => round.value?.data.ticketPrice ?? config.value?.data.ticketPrice ?? null);
  const feeBps = computed(() => round.value?.data.feeBps ?? config.value?.data.feeBps ?? 0);
  const pot = computed(() => round.value?.data.pot ?? 0n);
  const prize = computed(() => pot.value - feeFor(pot.value, feeBps.value));
  const takenNumbers = computed(() => new Set(tickets.value.map((t) => t.data.number)));

  const past = computed(() => rounds.value.filter((r) => r.data.day < today.value));
  const settled = computed(() => past.value.filter((r) => r.data.status === RoundStatus.Settled));
  const pending = computed(() => past.value.filter((r) => r.data.status !== RoundStatus.Settled));

  const totals = computed(() => {
    const done = settled.value;
    const pots = done.map((r) => r.data.pot);
    const sum = pots.reduce((a, b) => a + b, 0n);
    return {
      rounds: done.length,
      tickets: done.reduce((n, r) => n + r.data.ticketCount, 0),
      paid: done.reduce((n, r) => n + r.data.payout, 0n),
      biggestPot: pots.reduce((a, b) => (b > a ? b : a), 0n),
      averagePot: done.length ? sum / BigInt(done.length) : 0n,
      winnerCountries: new Set(done.map((r) => countryFromBytes(r.data.winnerCountry)).filter(Boolean)).size,
      winners: new Set(done.map((r) => r.data.winner)).size,
    };
  });

  async function after() {
    await Promise.all([loadToday(), loadHistory(), refreshBalance()]).catch(() => {});
  }

  /** Buys `number` in today's round. */
  async function buy(number: number, country: string | null) {
    if (!wallet.value) return null;
    busy.value = true;
    try {
      const signature = await run(
        `Buying number ${formatNumber(number)}`,
        () =>
          client.solucky.instructions
            .buyTicket({ buyer: client.payer, day: today.value, number, country: countryToBytes(country) })
            .sendTransaction(),
        `Number ${formatNumber(number)} is yours. Good luck!`,
      );
      await after();
      return signature;
    } finally {
      busy.value = false;
    }
  }

  /** Waits until the cluster is past `slot` (the draw needs it), up to ~40 s. */
  async function waitForSlot(slot: bigint) {
    for (let i = 0; i < 40; i++) {
      const current = await client.rpc.getSlot({ commitment: 'confirmed' }).send();
      if (current > slot) return current;
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
    throw new Error('The cluster is slow to reach the draw slot. Try again in a minute.');
  }

  /** Takes a finished round to the end: close, draw and pay the winner, as needed. */
  async function settle(target: Account<Round>) {
    if (!wallet.value) return;
    busy.value = true;
    const label = formatDay(target.data.day);
    const ix = client.solucky.instructions;
    try {
      let current = target;
      const reload = async () => {
        current = await client.solucky.accounts.round.fetch(current.address, { commitment: 'confirmed' });
      };

      if (current.data.status === RoundStatus.Closed) {
        const slot = await client.rpc.getSlot({ commitment: 'confirmed' }).send();
        if (slot > current.data.targetSlot + DRAW_WINDOW_SLOTS) {
          if (
            !(await run(`Re-pinning the draw slot for ${label}`, () =>
              ix.closeRound({ round: current.address }).sendTransaction(),
            ))
          )
            return;
          await reload();
        }
      }
      if (current.data.status === RoundStatus.Open) {
        if (!(await run(`Closing ${label}`, () => ix.closeRound({ round: current.address }).sendTransaction()))) return;
        await reload();
      }
      if (current.data.status === RoundStatus.Closed) {
        await waitForSlot(current.data.targetSlot);
        if (!(await run(`Drawing ${label}`, () => ix.drawRound({ round: current.address }).sendTransaction()))) return;
        await reload();
      }
      if (current.data.status === RoundStatus.Drawn) {
        const winner = await fetchTicketByIndex(client.rpc, current.address, current.data.winningIndex, programAddress);
        if (!winner || !config.value) throw new Error('The winning ticket could not be found.');
        await run(
          `Paying the ${label} winner`,
          () =>
            ix
              .claimPrize({
                round: current.address,
                ticket: winner.address,
                owner: winner.data.owner,
                treasury: config.value!.data.treasury,
              })
              .sendTransaction(),
          `Paid ◎${formatSol(current.data.pot - feeFor(current.data.pot, current.data.feeBps))} to the ${label} winner`,
        );
      }
    } catch (cause) {
      toast.add({ title: `Could not settle ${label}`, description: friendlyError(cause), color: 'error' });
    } finally {
      busy.value = false;
      await after();
    }
  }

  /** The connected wallet's tickets from settled rounds, whose rent can be returned. */
  async function reclaimable(): Promise<Account<Ticket>[]> {
    if (!wallet.value) return [];
    const done = new Set<Address>(settled.value.map((r) => r.address));
    const mine = await fetchOwnerTickets(client.rpc, wallet.value, programAddress);
    return mine.filter((t) => done.has(t.data.round));
  }

  /** Closes settled tickets, eight per transaction, and returns their rent. */
  async function reclaim(list: Account<Ticket>[]) {
    if (!wallet.value || list.length === 0) return;
    busy.value = true;
    try {
      for (let i = 0; i < list.length; i += 8) {
        const batch = list
          .slice(i, i + 8)
          .map((t) =>
            getCloseTicketInstruction(
              { owner: client.payer, round: t.data.round, ticket: t.address },
              { programAddress },
            ),
          );
        if (!(await run('Returning ticket rent', () => client.sendTransaction(batch)))) break;
      }
    } finally {
      busy.value = false;
      await after();
    }
  }

  return {
    config: computed(() => config.value),
    configMissing: computed(() => configMissing.value),
    today: computed(() => today.value),
    round: computed(() => round.value),
    tickets: computed(() => tickets.value),
    rounds: computed(() => rounds.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    busy: computed(() => busy.value),
    players: computed(() => owners.value.size),
    countries: computed(() => countries.value.size),
    myTickets,
    ticketPrice,
    feeBps,
    pot,
    prize,
    takenNumbers,
    settled,
    pending,
    totals,
    refresh,
    buy,
    settle,
    reclaimable,
    reclaim,
  };
}
