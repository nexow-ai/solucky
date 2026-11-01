import {
  fetchAllMaybeGame,
  fetchRoundHeader,
  findGamePda,
  findRoundPda,
  GAME_SLUGS,
  type GameKind,
  isLottery,
  periodOf,
} from '@solucky/client';

const pots = shallowRef<(bigint | null)[]>(GAME_SLUGS.map(() => null));
let timer: ReturnType<typeof setInterval> | undefined;

/**
 * The pot of every game's round on sale, carry included, refreshed once a
 * minute: for the play page's game switcher. Light on the RPC: the three game
 * accounts in one call, then each round's fields without its numbers. The
 * page's own game has a live pot in `useLottery`; prefer that one.
 */
export function useGamePots() {
  if (import.meta.client && !timer) {
    const { client, programAddress } = useSolana();
    const now = useNow();
    const load = async () => {
      if (document.visibilityState === 'hidden') return;
      try {
        const kinds = GAME_SLUGS.map((_, kind) => kind as GameKind);
        const addresses = await Promise.all(kinds.map(async (kind) => (await findGamePda({ kind }, { programAddress }))[0]));
        const games = await fetchAllMaybeGame(client.rpc, addresses, { commitment: 'confirmed' });
        pots.value = await Promise.all(
          kinds.map(async (kind, i) => {
            const game = games[i];
            if (!game?.exists) return null;
            const period = isLottery(kind) ? periodOf(kind, now.value) : game.data.currentRound;
            const [address] = await findRoundPda({ kind, period }, { programAddress });
            const round = await fetchRoundHeader(client.rpc, address);
            return (round.exists ? round.data.pot : 0n) + game.data.carry;
          }),
        );
      } catch {
        // The switcher shows the pots it already has; the next minute tries again.
      }
    };
    void load();
    timer = setInterval(load, 60_000);
  }
  return readonly(pots);
}
