/**
 * Spots tickets that just landed. The first list seen for a day is the
 * baseline (tickets already bought when the page opened); after that, each
 * call returns only the tickets it has not seen before. A new day starts a
 * new baseline.
 */
export function ticketWatcher() {
  const seen = new Set<string>();
  let day: number | null = null;

  return function fresh<T extends { address: string }>(list: readonly T[], today: number): T[] {
    if (day !== today) {
      day = today;
      seen.clear();
      for (const ticket of list) seen.add(ticket.address);
      return [];
    }
    const added = list.filter((ticket) => !seen.has(ticket.address));
    for (const ticket of added) seen.add(ticket.address);
    return added;
  };
}
