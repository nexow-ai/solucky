/**
 * Where the page stands, for the header's game tabs and links: on a game's
 * own page (`home`: `/`, `/hourly`, `/guess`), at a game's table or one of
 * its rounds (`play`), or anywhere else (`null`: the legal pages). The game
 * itself is `useGame()`.
 */
export function usePageSection() {
  const route = useRoute();
  const baseName = useRouteBaseName();
  return computed<'home' | 'play' | null>(() => {
    const name = String(baseName(route) ?? '');
    if (name === 'game') return 'home';
    if (name === 'play-game' || name.startsWith('rounds-')) return 'play';
    return null;
  });
}
