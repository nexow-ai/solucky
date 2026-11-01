import {
  address,
  AccountRole,
  type AccountMeta,
  type AccountSignerMeta,
  type Address,
  getStructEncoder,
  getU32Encoder,
  getU64Encoder,
  type Instruction,
  type TransactionSigner,
} from '@solana/kit';

/**
 * Quick buy: the owner opens a session for a key their browser keeps, which
 * then buys tickets for the owner, paid from the session, without a wallet
 * prompt. The key pays the network fees from a small float of its own.
 */

/** What a quick-buy session can still spend: the lamports it holds above its rent. */
export function sessionBudget(lamports: bigint, rent: bigint): bigint {
  return lamports > rent ? lamports - rent : 0n;
}

const SYSTEM_PROGRAM_ADDRESS = address('11111111111111111111111111111111');
const TRANSFER = 2;

/** A plain SOL transfer (the System program's `Transfer`). */
export function getTransferSolInstruction(input: {
  source: TransactionSigner;
  destination: Address;
  amount: bigint;
}): Instruction<string, readonly [AccountSignerMeta, AccountMeta]> & { data: Uint8Array } {
  const data = getStructEncoder([
    ['instruction', getU32Encoder()],
    ['amount', getU64Encoder()],
  ]).encode({ instruction: TRANSFER, amount: input.amount }) as Uint8Array;
  return {
    programAddress: SYSTEM_PROGRAM_ADDRESS,
    accounts: [
      { address: input.source.address, role: AccountRole.WRITABLE_SIGNER, signer: input.source },
      { address: input.destination, role: AccountRole.WRITABLE },
    ],
    data,
  };
}
