import {
  type Address,
  getAddressEncoder,
  type GetAccountInfoApi,
  getU64Encoder,
  type ReadonlyUint8Array,
  type Rpc,
} from '@solana/kit';
import { fetchSysvarSlotHashes } from '@solana/sysvars';

/**
 * Recomputes a round's randomness the way `draw_round` does:
 * `sha256(entropy || slot_hash || slot (u64 LE) || round address)`.
 * Anyone can run it with the entropy, slot hash and draw slot stored in the round.
 */
export async function computeRandomness(input: {
  entropy: ReadonlyUint8Array;
  slotHash: ReadonlyUint8Array;
  slot: bigint;
  round: Address;
}): Promise<Uint8Array> {
  const parts = [
    input.entropy,
    input.slotHash,
    getU64Encoder().encode(input.slot),
    getAddressEncoder().encode(input.round),
  ];
  const data = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    data.set(part, offset);
    offset += part.length;
  }
  return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
}

function firstU64(randomness: ReadonlyUint8Array): bigint {
  return new DataView(randomness.buffer, randomness.byteOffset, 8).getBigUint64(0, true);
}

/** A lottery's random number: the first 8 bytes as a u64 LE, modulo `maxNumber + 1`. */
export function drawnNumber(randomness: ReadonlyUint8Array, maxNumber: number): number {
  return Number(firstU64(randomness) % BigInt(maxNumber + 1));
}

/** The lottery winner: the number closest to `target`; a tie goes to the lower number. */
export function closestNumber(numbers: readonly number[], target: number): number | null {
  let best: number | null = null;
  for (const n of numbers) {
    const d = Math.abs(n - target);
    const bestD = best === null ? Infinity : Math.abs(best - target);
    if (d < bestD || (d === bestD && n < best!)) best = n;
  }
  return best;
}

/**
 * Chance that a lottery's draw lands closest to one of `mine`: the share of
 * the numbers 0 to `maxNumber` that are closer to them than to any other
 * ticket (a tie goes to the lower number, like the program).
 */
export function winShare(numbers: readonly number[], mine: ReadonlySet<number>, maxNumber: number): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  let owned = 0;
  sorted.forEach((n, i) => {
    if (!mine.has(n)) return;
    const prev = sorted[i - 1];
    const next = sorted[i + 1];
    const lo = prev === undefined ? 0 : Math.floor((prev + n) / 2) + 1;
    const hi = next === undefined ? maxNumber : Math.floor((n + next) / 2);
    owned += hi - lo + 1;
  });
  return owned / (maxNumber + 1);
}

/**
 * Checks a sealed batch of Guess tickets like `draw_round`: `checked` guesses
 * were already wrong, so the number is one of the `maxNumber + 1 - checked`
 * numbers left. Returns the purchase index of the guess that found it, or
 * `null` when the batch missed.
 */
export function guessOutcome(
  randomness: ReadonlyUint8Array,
  checked: number,
  sealedCount: number,
  maxNumber: number,
): number | null {
  const r = firstU64(randomness) % BigInt(maxNumber + 1 - checked);
  return r < BigInt(sealedCount - checked) ? checked + Number(r) : null;
}

/**
 * True when SlotHashes no longer reaches `targetSlot`, so the round can never
 * be drawn from it and `close_round` may pin a new slot. Mirrors the program.
 */
export async function isPinnedSlotExpired(rpc: Rpc<GetAccountInfoApi>, targetSlot: bigint): Promise<boolean> {
  const entries = await fetchSysvarSlotHashes(rpc, { commitment: 'confirmed' });
  const oldest = entries.at(-1);
  return oldest !== undefined && oldest.slot > targetSlot;
}
