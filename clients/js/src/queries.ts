import {
  type Account,
  type Address,
  type Base58EncodedBytes,
  type Commitment,
  type EncodedAccount,
  getBase58Decoder,
  type GetAccountInfoApi,
  type GetProgramAccountsApi,
  type MaybeAccount,
  parseBase64RpcAccount,
  type ReadonlyUint8Array,
  type Rpc,
} from '@solana/kit';

import {
  decodeRound,
  decodeTicket,
  getRoundDiscriminatorBytes,
  getRoundSize,
  getTicketDiscriminatorBytes,
  getTicketSize,
  type Round,
  SOLUCKY_PROGRAM_ADDRESS,
  type Ticket,
} from './generated';
import type { GameKind } from './time';

/** Byte offsets of `Ticket` fields, after the 8-byte discriminator. */
export const TICKET_OFFSETS = { round: 8, owner: 40, number: 72, index: 76 } as const;

/** Byte offsets of `Round` fields: `fee_collected` is the last one before the bump. */
export const ROUND_OFFSETS = { kind: 8, feeCollected: 222 } as const;

type ProgramAccountsRpc = Rpc<GetProgramAccountsApi>;
type Filter = { dataSize: bigint } | { memcmp: { offset: bigint; bytes: Base58EncodedBytes; encoding: 'base58' } };

function memcmp(offset: number, bytes: ReadonlyUint8Array | Address): Filter {
  const encoded = typeof bytes === 'string' ? bytes : getBase58Decoder().decode(bytes);
  return { memcmp: { offset: BigInt(offset), bytes: encoded as Base58EncodedBytes, encoding: 'base58' } };
}

function u32(value: number): Uint8Array {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, true);
  return bytes;
}

async function programAccounts<T extends object>(
  rpc: ProgramAccountsRpc,
  filters: Filter[],
  decode: (account: EncodedAccount) => Account<T>,
  programAddress: Address,
  length?: number,
): Promise<Account<T>[]> {
  const dataSlice = length === undefined ? undefined : { offset: 0, length };
  const accounts = await rpc
    .getProgramAccounts(programAddress, { encoding: 'base64', filters, dataSlice, withContext: false })
    .send();
  return accounts.map(({ pubkey, account }) => decode(parseBase64RpcAccount(pubkey, account)));
}

function ticketFilters(...extra: Filter[]): Filter[] {
  return [{ dataSize: BigInt(getTicketSize()) }, memcmp(0, getTicketDiscriminatorBytes()), ...extra];
}

/** Every ticket still open on-chain for a round, in purchase order. */
export async function fetchRoundTickets(
  rpc: ProgramAccountsRpc,
  round: Address,
  programAddress: Address = SOLUCKY_PROGRAM_ADDRESS,
): Promise<Account<Ticket>[]> {
  const tickets = await programAccounts(
    rpc,
    ticketFilters(memcmp(TICKET_OFFSETS.round, round)),
    decodeTicket,
    programAddress,
  );
  return tickets.sort((a, b) => a.data.index - b.data.index);
}

/** Every ticket a wallet still holds, across rounds. */
export async function fetchOwnerTickets(
  rpc: ProgramAccountsRpc,
  owner: Address,
  programAddress: Address = SOLUCKY_PROGRAM_ADDRESS,
): Promise<Account<Ticket>[]> {
  return programAccounts(rpc, ticketFilters(memcmp(TICKET_OFFSETS.owner, owner)), decodeTicket, programAddress);
}

/** The ticket bought at position `index` of a round, if it still exists. */
export async function fetchTicketByIndex(
  rpc: ProgramAccountsRpc,
  round: Address,
  index: number,
  programAddress: Address = SOLUCKY_PROGRAM_ADDRESS,
): Promise<Account<Ticket> | null> {
  const [ticket] = await programAccounts(
    rpc,
    ticketFilters(memcmp(TICKET_OFFSETS.round, round), memcmp(TICKET_OFFSETS.index, u32(index))),
    decodeTicket,
    programAddress,
  );
  return ticket ?? null;
}

/**
 * Every round ever played, of one game or of all, newest first. Lottery
 * rounds store their numbers after their fields, which can weigh megabytes,
 * so only the fields are downloaded; see `roundNumbers`.
 */
export async function fetchRounds(
  rpc: ProgramAccountsRpc,
  kind?: GameKind,
  programAddress: Address = SOLUCKY_PROGRAM_ADDRESS,
): Promise<Account<Round>[]> {
  const filters = [memcmp(0, getRoundDiscriminatorBytes())];
  if (kind !== undefined) filters.push(memcmp(ROUND_OFFSETS.kind, Uint8Array.of(kind)));
  const rounds = await programAccounts(rpc, filters, decodeRound, programAddress, getRoundSize());
  return rounds.sort((a, b) => b.data.period - a.data.period);
}

/**
 * The rounds that still need a step: every round whose fee is not collected
 * yet. That covers the rounds on sale, closed, drawn, and settled with the
 * fee waiting (a round with no fee is marked collected when it is paid).
 * Newest first, like `fetchRounds`, without downloading the settled history.
 */
export async function fetchPendingRounds(
  rpc: ProgramAccountsRpc,
  programAddress: Address = SOLUCKY_PROGRAM_ADDRESS,
): Promise<Account<Round>[]> {
  const filters = [memcmp(0, getRoundDiscriminatorBytes()), memcmp(ROUND_OFFSETS.feeCollected, Uint8Array.of(0))];
  const rounds = await programAccounts(rpc, filters, decodeRound, programAddress, getRoundSize());
  return rounds.sort((a, b) => b.data.period - a.data.period);
}

/**
 * A round's fields without the sorted numbers a lottery round stores after
 * them (4 bytes a ticket, up to 4 MB): what a page polls.
 */
export async function fetchRoundHeader(
  rpc: Rpc<GetAccountInfoApi>,
  round: Address,
  { commitment = 'confirmed' }: { commitment?: Commitment } = {},
): Promise<MaybeAccount<Round>> {
  const { value } = await rpc
    .getAccountInfo(round, { encoding: 'base64', commitment, dataSlice: { offset: 0, length: getRoundSize() } })
    .send();
  return value
    ? { ...decodeRound(parseBase64RpcAccount(round, value)), exists: true }
    : { address: round, exists: false };
}

/** The sorted numbers a lottery round stores after its fields, from the account's full data. */
export function roundNumbers(data: ReadonlyUint8Array): number[] {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const numbers: number[] = [];
  for (let at = getRoundSize(); at + 4 <= data.byteLength; at += 4) numbers.push(view.getUint32(at, true));
  return numbers;
}
