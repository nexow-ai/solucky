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

/** Purchase index of the winning ticket: the first 8 bytes as a u64 LE, modulo the ticket count. */
export function winningIndex(randomness: ReadonlyUint8Array, ticketCount: number): number {
  if (ticketCount <= 0) throw new RangeError('A round needs at least one ticket');
  const view = new DataView(randomness.buffer, randomness.byteOffset, 8);
  return Number(view.getBigUint64(0, true) % BigInt(ticketCount));
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
