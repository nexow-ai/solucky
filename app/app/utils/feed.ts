/**
 * Spots tickets that just landed. The first list seen for a round is the
 * baseline (tickets already bought when the page opened); after that, each
 * call returns only the tickets it has not seen before. Another round (a new
 * day or hour, or another game) starts a new baseline.
 */
export function ticketWatcher() {
  const seen = new Set<string>();
  let round: string | number | null = null;

  return function fresh<T extends { address: string }>(list: readonly T[], key: string | number): T[] {
    if (round !== key) {
      round = key;
      seen.clear();
      for (const ticket of list) seen.add(ticket.address);
      return [];
    }
    const added = list.filter((ticket) => !seen.has(ticket.address));
    for (const ticket of added) seen.add(ticket.address);
    return added;
  };
}
