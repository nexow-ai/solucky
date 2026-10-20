import { type Address, getAddressEncoder, getU64Encoder, type ReadonlyUint8Array } from '@solana/kit';

/**
 * Recomputes a round's randomness the way `draw_round` does:
 * `sha256(entropy || slot_hash || slot (u64 LE) || round address)`.
 * Anyone can run it against the round account and the slot's block hash.
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
