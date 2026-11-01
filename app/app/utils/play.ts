/** A game's table: the daily lottery at `/play` (its canonical address), the others at `/play/<slug>`. */
export function playPath(slug: string): string {
  return slug === 'daily' ? '/play' : `/play/${slug}`;
}
