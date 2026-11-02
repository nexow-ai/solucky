/** What a search through the numbers in play looks at in each ticket. */
export interface TicketFields {
  number: number;
  owner: string;
  /** The country's name in the page's language ("Private" when hidden). */
  country: string;
}

/** The zeros of the decimal digits a keyboard of the app's languages may type, besides 0–9. */
const ZEROS = [0x0660, 0x06f0, 0x0966, 0x0e50, 0xff10];

/** `٤٢`, `४२`, `๔๒` or `４２` → `42`; any other character stays. */
function asciiDigits(text: string): string {
  return text.replace(/\p{Nd}/gu, (digit) => {
    const code = digit.codePointAt(0)!;
    const zero = ZEROS.find((z) => code >= z && code <= z + 9);
    return zero === undefined ? digit : String(code - zero);
  });
}

/** Lower case without accents, so `cote d'ivoire` finds Côte d’Ivoire. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').replace(/[’‘`]/g, "'").toLowerCase();
}

/**
 * The items the query finds. A query of digits (group separators and spaces
 * left out, so `1 234` and `1,234` work) finds the numbers that start with
 * them, the exact number first; any other query finds the wallets and the
 * countries that contain it. An empty query finds everything. The order is
 * otherwise kept.
 */
export function searchTickets<T>(items: readonly T[], query: string, fields: (item: T) => TicketFields): T[] {
  const text = asciiDigits(query.normalize('NFKC')).trim();
  if (!text) return [...items];

  const digits = text.replace(/[\s.,'’_]/g, '');
  if (/^\d+$/.test(digits)) {
    const exact: T[] = [];
    const partial: T[] = [];
    for (const item of items) {
      const number = String(fields(item).number);
      if (number === String(Number(digits))) exact.push(item);
      else if (number.startsWith(digits)) partial.push(item);
    }
    return [...exact, ...partial];
  }

  const needle = fold(text);
  return items.filter((item) => {
    const { owner, country } = fields(item);
    return owner.toLowerCase().includes(needle) || fold(country).includes(needle);
  });
}
