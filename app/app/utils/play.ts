/** A game's table: the daily lottery at `/play` (its canonical address), the others at `/play/<slug>`. */
export function playPath(slug: string): string {
  return slug === 'daily' ? '/play' : `/play/${slug}`;
}

/** A game's own page: the daily lottery's is the site's home (`/`), the others are at `/<slug>`. */
export function homePath(slug: string): string {
  return slug === 'daily' ? '/' : `/${slug}`;
}
