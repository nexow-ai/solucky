import type { Account, Address } from '@solana/kit';
import {
  type Config,
  countryFromBytes,
  countryToBytes,
  fetchOwnerTickets,
  fetchRounds,
  fetchRoundTickets,
  fetchTicketByIndex,
  findConfigPda,
  findGamePda,
  findRoundPda,
  findTicketPda,
  type Game,
  gameFromSlug,
  GameKind,
  getCloseTicketInstruction,
  isLottery,
  isPinnedSlotExpired,
  periodOf,
  prizeFor,
  type Round,
  RoundStatus,
  type Ticket,
  winShare,
} from '@solucky/client';

/** One game's live state, shared by every component that shows that game. */
function createState() {
  return {
    game: shallowRef<Account<Game> | null>(null),
    gameMissing: ref(false),
    /** The round on sale: the UTC day or hour, or the Guess round number once the game loads. */
    period: ref<number | null>(null),
    round: shallowRef<Account<Round> | null>(null),
    tickets: shallowRef<Account<Ticket>[]>([]),
    rounds: shallowRef<Account<Round>[]>([]),
    loading: ref(true),
    error: ref<string | null>(null),
    started: false,
    subscription: undefined as AbortController | undefined,
  };
}
type State = ReturnType<typeof createState>;

const states = new Map<GameKind, State>();
const config = shallowRef<Account<Config> | null>(null);
const configMissing = ref(false);
/** One wallet, one transaction at a time, whatever the game. */
const busy = ref(false);

function stateOf(kind: GameKind): State {
  let state = states.get(kind);
  if (!state) {
    state = createState();
    states.set(kind, state);
  }
  return state;
}

/** The game the page is about: `/play/hourly`, `/rounds/guess/3`… and the daily lottery anywhere else. */
export function useGame() {
  const route = useRoute();
  return computed(() => gameFromSlug(String(route.params.game ?? '')) ?? GameKind.Daily);
}

/**
 * Live on-chain state of a game (by default, the page's): its settings, the
 * round on sale and its tickets, and every past round. Updates from account
 * notifications, with polling as a fallback, and exposes the player actions.
 */
export function useLottery(game?: MaybeRefOrGetter<GameKind>) {
  const pageGame = useGame();
  const kind = computed(() => (game === undefined ? pageGame.value : toValue(game)));
  const s = computed(() => stateOf(kind.value));
  const { client, programAddress } = useSolana();
  const { address: wallet, refreshBalance } = useWallet();
  const { run } = useTransaction();
  const toast = useToast();
  const { t } = useI18n();
  const now = useNow();
  const fallbackMax = Number(useRuntimeConfig().public.maxNumber);

  async function loadConfig() {
    const [address] = await findConfigPda({ programAddress });
    const account = await client.solucky.accounts.config.fetchMaybe(address, { commitment: 'confirmed' });
    config.value = account.exists ? account : null;
    configMissing.value = !account.exists;
  }

  async function loadGame(k: GameKind) {
    const state = stateOf(k);
    const [address] = await findGamePda({ kind: k }, { programAddress });
    const account = await client.solucky.accounts.game.fetchMaybe(address, { commitment: 'confirmed' });
    state.game.value = account.exists ? account : null;
    state.gameMissing.value = !account.exists;
    // A Guess round ends when a guess finds the number; the next one is on sale at once.
    if (!isLottery(k) && account.exists && state.period.value !== account.data.currentRound) {
      const moved = state.period.value !== null;
      state.period.value = account.data.currentRound;
      if (moved) {
        await loadRound(k);
        void watchRound(k);
      }
    }
  }

  async function loadRound(k: GameKind) {
    const state = stateOf(k);
    const period = state.period.value;
    if (period === null) return;
    const [address] = await findRoundPda({ kind: k, period }, { programAddress });
    const account = await client.solucky.accounts.round.fetchMaybe(address, { commitment: 'confirmed' });
    const list = account.exists ? await fetchRoundTickets(client.rpc, address, programAddress) : [];
    // A slower load for a round that already ended must not overwrite the new one.
    if (period !== state.period.value) return;
    state.round.value = account.exists ? account : null;
    state.tickets.value = list;
  }

  async function loadHistory(k: GameKind) {
    stateOf(k).rounds.value = await fetchRounds(client.rpc, k, programAddress);
  }

  async function refreshGame(k: GameKind) {
    const state = stateOf(k);
    try {
      await Promise.all([loadConfig(), loadGame(k), loadHistory(k)]);
      await loadRound(k);
      state.error.value = null;
    } catch (cause) {
      state.error.value = t('play.rpcError', { reason: friendlyError(cause, t) });
    } finally {
      state.loading.value = false;
    }
  }

  /** Reloads the round on sale whenever its account changes. */
  async function watchRound(k: GameKind) {
    const state = stateOf(k);
    state.subscription?.abort();
    const controller = new AbortController();
    state.subscription = controller;
    const period = state.period.value;
    if (period === null) return;
    try {
      const [address] = await findRoundPda({ kind: k, period }, { programAddress });
      const notifications = await client.rpcSubscriptions
        .accountNotifications(address, { commitment: 'confirmed', encoding: 'base64' })
        .subscribe({ abortSignal: controller.signal });
      for await (const _ of notifications) {
        await loadRound(k).catch(() => {});
        if (!isLottery(k)) await loadGame(k).catch(() => {});
      }
    } catch {
      // Websockets are optional: polling below keeps the page fresh.
    }
  }

  /** Tells the player how their guesses fared, as the checks land. */
  function reportGuesses(state: State) {
    watch(state.round, (next, prev) => {
      if (!next || !prev || next.address !== prev.address || !wallet.value) return;
      const mine = state.tickets.value.filter((ticket) => ticket.data.owner === wallet.value);
      const won = next.data.status !== RoundStatus.Open && next.data.status !== RoundStatus.Closed;
      const wasWon = prev.data.status !== RoundStatus.Open && prev.data.status !== RoundStatus.Closed;
      if (won && !wasWon) {
        const hit = mine.find((ticket) => ticket.data.index === next.data.winningIndex);
        toast.add({
          title: hit ? t('guess.foundByYou', { number: formatNumber(hit.data.number) }) : t('guess.foundByOther'),
          description: t('guess.nextRound'),
          icon: hit ? 'i-lucide-trophy' : 'i-lucide-flag',
          color: hit ? 'success' : 'neutral',
        });
        return;
      }
      const missed = mine.filter(
        (ticket) => ticket.data.index >= prev.data.checked && ticket.data.index < next.data.checked,
      );
      if (missed.length) {
        toast.add({
          title: t('guess.missed', { numbers: missed.map((ticket) => formatNumber(ticket.data.number)).join(', ') }),
          description: t('guess.left', { n: formatNumber(next.data.maxNumber + 1 - next.data.checked) }),
          icon: 'i-lucide-search-x',
          color: 'neutral',
        });
      }
    });
  }

  function start(k: GameKind) {
    const state = stateOf(k);
    if (!import.meta.client || state.started) return;
    state.started = true;
    if (isLottery(k)) state.period.value = periodOf(k, now.value);
    void refreshGame(k).then(() => watchRound(k));
    setInterval(() => void loadRound(k).catch(() => {}), 15_000);
    setInterval(() => void Promise.all([loadConfig(), loadGame(k), loadHistory(k)]).catch(() => {}), 30_000);
    // The watchers live in their own scope so they outlive the component that
    // first showed the game.
    effectScope(true).run(() => {
      if (!isLottery(k)) return reportGuesses(state);
      // A new round starts every UTC day or hour (cluster time).
      watch(now, (ms) => {
        const period = periodOf(k, ms);
        if (period !== state.period.value) {
          state.period.value = period;
          void refreshGame(k);
          void watchRound(k);
        }
      });
    });
  }
  watch(kind, start, { immediate: true });

  const lottery = computed(() => isLottery(kind.value));
  const round = computed(() => s.value.round.value);
  const tickets = computed(() => s.value.tickets.value);
  const owners = computed(() => new Set(tickets.value.map((t) => t.data.owner)));
  const countries = computed(() => new Set(tickets.value.map((t) => countryFromBytes(t.data.country)).filter(Boolean)));
  const myTickets = computed(() => tickets.value.filter((t) => t.data.owner === wallet.value));
  const gameData = computed(() => s.value.game.value?.data ?? null);
  const ticketPrice = computed(() => round.value?.data.ticketPrice ?? gameData.value?.ticketPrice ?? null);
  const feeBps = computed(() => round.value?.data.feeBps ?? gameData.value?.feeBps ?? 0);
  const maxNumber = computed(() => round.value?.data.maxNumber ?? config.value?.data.maxNumber ?? fallbackMax);
  /** What the last draw of this game left; it joins the pot of the next round drawn. */
  const carry = computed(() => gameData.value?.carry ?? 0n);
  /** The round's tickets plus the carry: what the winner will share. */
  const pot = computed(() => (round.value?.data.pot ?? 0n) + carry.value);
  const prize = computed(() => prizeFor(pot.value));
  const takenNumbers = computed(() => new Set(tickets.value.map((t) => t.data.number)));
  /** Guess: guesses already checked, guesses waiting for the next check, and numbers not tried yet. */
  const checked = computed(() => round.value?.data.checked ?? 0);
  const unchecked = computed(() => (round.value?.data.ticketCount ?? 0) - checked.value);
  const numbersLeft = computed(() => maxNumber.value + 1 - checked.value);
  /**
   * Lotteries: the share of the numbers closer to yours than to anyone else's.
   * Guess: the chance that your guesses waiting for a check hold the number.
   */
  const myChance = computed(() => {
    if (!myTickets.value.length) return null;
    if (lottery.value) {
      const mine = new Set(myTickets.value.map((ticket) => ticket.data.number));
      return winShare([...takenNumbers.value], mine, maxNumber.value);
    }
    const waiting = myTickets.value.filter((ticket) => ticket.data.index >= checked.value).length;
    return waiting / numbersLeft.value;
  });

  const past = computed(() => {
    const period = s.value.period.value;
    return s.value.rounds.value.filter((r) => period === null || r.data.period < period);
  });
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

  async function after(k: GameKind) {
    await Promise.all([loadRound(k), loadGame(k), loadHistory(k), refreshBalance()]).catch(() => {});
  }

  /** Buys `number` in the round on sale, never paying more than the price shown. */
  async function buy(number: number, country: string | null) {
    const k = kind.value;
    const period = s.value.period.value;
    const price = ticketPrice.value;
    if (!wallet.value || price === null || period === null) return null;
    busy.value = true;
    try {
      const signature = await run(
        t('tx.buying', { number: formatNumber(number) }),
        () =>
          client.solucky.instructions
            .buyTicket({
              buyer: client.payer,
              kind: k,
              period,
              number,
              country: countryToBytes(country),
              maxPrice: price,
            })
            .sendTransaction(),
        t(isLottery(k) ? 'tx.bought' : 'guess.bought', { number: formatNumber(number) }),
      );
      await after(k);
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
    throw new Error(t('tx.slowSlot'));
  }

  async function winningTicket(target: Account<Round>) {
    const { kind: k, winningIndex, winningNumber } = target.data;
    if (!isLottery(k)) return fetchTicketByIndex(client.rpc, target.address, winningIndex, programAddress);
    const [address] = await findTicketPda({ round: target.address, number: winningNumber }, { programAddress });
    const ticket = await client.solucky.accounts.ticket.fetchMaybe(address, { commitment: 'confirmed' });
    return ticket.exists ? ticket : null;
  }

  /**
   * Takes a round as far as it can go: close a finished lottery round (or seal
   * the unchecked guesses), draw it, and pay the winner, as needed.
   */
  async function settle(target: Account<Round>) {
    if (!wallet.value) return;
    busy.value = true;
    const k = target.data.kind as GameKind;
    const label = roundTitle(k, target.data.period);
    const ix = client.solucky.instructions;
    try {
      let current = target;
      const reload = async () => {
        current = await client.solucky.accounts.round.fetch(current.address, { commitment: 'confirmed' });
      };

      if (current.data.status === RoundStatus.Closed) {
        if (await isPinnedSlotExpired(client.rpc, current.data.targetSlot)) {
          if (
            !(await run(t('tx.repin', { day: label }), () =>
              ix.closeRound({ round: current.address }).sendTransaction(),
            ))
          )
            return;
          await reload();
        }
      }
      if (current.data.status === RoundStatus.Open) {
        if (
          !(await run(t(isLottery(k) ? 'tx.closing' : 'guess.sealing', { day: label }), () =>
            ix.closeRound({ round: current.address }).sendTransaction(),
          ))
        )
          return;
        await reload();
      }
      if (current.data.status === RoundStatus.Closed) {
        await waitForSlot(current.data.targetSlot);
        const [game] = await findGamePda({ kind: k }, { programAddress });
        if (
          !(await run(t('tx.drawing', { day: label }), () =>
            ix.drawRound({ round: current.address, game }).sendTransaction(),
          ))
        )
          return;
        await reload();
      }
      if (current.data.status === RoundStatus.Drawn) {
        const winner = await winningTicket(current);
        if (!winner) throw new Error(t('tx.noWinner'));
        await run(
          t('tx.paying', { day: label }),
          () =>
            ix
              .claimPrize({ round: current.address, ticket: winner.address, owner: winner.data.owner })
              .sendTransaction(),
          t('tx.paid', { amount: formatSol(current.data.payout), day: label }),
        );
      }
    } catch (cause) {
      toast.add({ title: t('tx.settleFailed', { day: label }), description: friendlyError(cause, t), color: 'error' });
    } finally {
      busy.value = false;
      await after(k);
    }
  }

  /** The connected wallet's tickets from this game's settled rounds, whose rent can be returned. */
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
        if (!(await run(t('tx.reclaiming'), () => client.sendTransaction(batch)))) break;
      }
    } finally {
      busy.value = false;
      await after(kind.value);
    }
  }

  return {
    kind,
    lottery,
    config: computed(() => config.value),
    configMissing: computed(() => configMissing.value || s.value.gameMissing.value),
    period: computed(() => s.value.period.value),
    round,
    tickets,
    rounds: computed(() => s.value.rounds.value),
    loading: computed(() => s.value.loading.value),
    error: computed(() => s.value.error.value),
    busy: computed(() => busy.value),
    players: computed(() => owners.value.size),
    countries: computed(() => countries.value.size),
    myTickets,
    myChance,
    ticketPrice,
    feeBps,
    maxNumber,
    carry,
    pot,
    prize,
    takenNumbers,
    checked,
    unchecked,
    numbersLeft,
    settled,
    pending,
    totals,
    refresh: () => refreshGame(kind.value),
    buy,
    settle,
    reclaimable,
    reclaim,
  };
}
