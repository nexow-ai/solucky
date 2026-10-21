import {
  type Account,
  type Address,
  type Base58EncodedBytes,
  type EncodedAccount,
  getBase58Decoder,
  type GetProgramAccountsApi,
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

/** Byte offsets of `Ticket` fields, after the 8-byte discriminator. */
export const TICKET_OFFSETS = { round: 8, owner: 40, number: 72, index: 76 } as const;

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
): Promise<Account<T>[]> {
  const accounts = await rpc
    .getProgramAccounts(programAddress, { encoding: 'base64', filters, withContext: false })
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

/** Every round ever played, newest first. */
export async function fetchRounds(
  rpc: ProgramAccountsRpc,
  programAddress: Address = SOLUCKY_PROGRAM_ADDRESS,
): Promise<Account<Round>[]> {
  const rounds = await programAccounts(
    rpc,
    [{ dataSize: BigInt(getRoundSize()) }, memcmp(0, getRoundDiscriminatorBytes())],
    decodeRound,
    programAddress,
  );
  return rounds.sort((a, b) => b.data.day - a.data.day);
}
