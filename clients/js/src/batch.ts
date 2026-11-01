import {
  type Address,
  AccountRole,
  type Instruction,
  type ReadonlyUint8Array,
  type TransactionSigner,
} from '@solana/kit';

import { findRoundPda, findTicketPda, getBuyTicketsInstructionAsync, SOLUCKY_PROGRAM_ADDRESS } from './generated';

/**
 * Most numbers one `buy_tickets` transaction carries. Each number adds its
 * 32-byte ticket address and 5 bytes to a transaction capped at 1232 bytes;
 * 20 leaves room for the compute budget instructions a wallet may add.
 */
export const MAX_TICKETS_PER_TRANSACTION = 20;

/** `list` in runs of at most `size`, in order. */
export function chunk<T>(list: readonly T[], size = MAX_TICKETS_PER_TRANSACTION): T[][] {
  const runs: T[][] = [];
  for (let i = 0; i < list.length; i += size) runs.push(list.slice(i, i + size));
  return runs;
}

/**
 * A `buy_tickets` instruction with its ticket accounts, one per number, in
 * the same order. With `session`, `buyer` must be the session's key: the
 * session pays and its owner gets the tickets.
 */
export async function getBuyTicketsWithTicketsInstruction(
  input: {
    buyer: TransactionSigner;
    session?: Address;
    kind: number;
    period: number;
    numbers: readonly number[];
    country: ReadonlyUint8Array;
    maxPrice: bigint;
  },
  { programAddress = SOLUCKY_PROGRAM_ADDRESS }: { programAddress?: Address } = {},
): Promise<Instruction> {
  const [round] = await findRoundPda({ kind: input.kind, period: input.period }, { programAddress });
  const tickets = await Promise.all(
    input.numbers.map(async (number) => (await findTicketPda({ round, number }, { programAddress }))[0]),
  );
  const instruction = await getBuyTicketsInstructionAsync(
    {
      buyer: input.buyer,
      session: input.session,
      round,
      kind: input.kind,
      period: input.period,
      numbers: [...input.numbers],
      country: input.country,
      maxPrice: input.maxPrice,
    },
    { programAddress },
  );
  return {
    ...instruction,
    accounts: [...instruction.accounts, ...tickets.map((address) => ({ address, role: AccountRole.WRITABLE }))],
  };
}
