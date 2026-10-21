/**
 * Shared setup for the operator scripts: an RPC client signed by a local
 * keypair, with the S☉Lucky program plugin installed.
 *
 * Environment:
 *   SOLANA_RPC_URL       RPC endpoint (default: devnet)
 *   SOLANA_KEYPAIR       path to a keypair JSON file (default: ~/.config/solana/id.json)
 *   SOLANA_KEYPAIR_JSON  the keypair's byte array itself, for CI secrets; wins over the file
 *   SOLUCKY_PROGRAM_ID   program address (default: the address in the IDL)
 *   SOLUCKY_MAX_NUMBER   highest ticket number in every game, for `admin init` and `localnet`
 *                        (default: 21000000)
 *
 * Bun reads a `.env` file in the working directory; see `.env.example`.
 */
import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  address,
  type Address,
  createClient,
  createKeyPairSignerFromBytes,
  getAddressEncoder,
  getProgramDerivedAddress,
  type KeyPairSigner,
  type TransactionSigner,
} from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { payer } from '@solana/kit-plugin-signer';
import {
  findGamePda,
  formatPeriod,
  GAME_SLUGS,
  GameKind,
  type Round,
  SOLUCKY_PROGRAM_ADDRESS,
  soluckyProgram,
} from '@solucky/client';

export const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const PROGRAM_ADDRESS = process.env.SOLUCKY_PROGRAM_ID
  ? address(process.env.SOLUCKY_PROGRAM_ID)
  : SOLUCKY_PROGRAM_ADDRESS;

export const MAX_NUMBER = Number(process.env.SOLUCKY_MAX_NUMBER || 21_000_000);
if (!Number.isSafeInteger(MAX_NUMBER) || MAX_NUMBER <= 0 || MAX_NUMBER > 0xffff_ffff) {
  throw new Error(`Invalid SOLUCKY_MAX_NUMBER: ${process.env.SOLUCKY_MAX_NUMBER}`);
}

export const GAMES = [GameKind.Daily, GameKind.Hourly, GameKind.Guess] as const;

/** `daily 2026-10-21`, `hourly 2026-10-21T14`, `guess 3`: how logs name a round. */
export function roundLabel({ kind, period }: Pick<Round, 'kind' | 'period'>): string {
  return `${GAME_SLUGS[kind]} ${formatPeriod(kind, period)}`;
}

export function gamePda(kind: number) {
  return findGamePda({ kind }, { programAddress: PROGRAM_ADDRESS }).then(([address]) => address);
}

export async function loadSigner(): Promise<KeyPairSigner> {
  const inline = process.env.SOLANA_KEYPAIR_JSON;
  const path = (process.env.SOLANA_KEYPAIR || '~/.config/solana/id.json').replace(/^~(?=\/)/, homedir());
  const json =
    inline ||
    (await Bun.file(path)
      .text()
      .catch(() => ''));
  if (!json) {
    throw new Error(`No keypair: set SOLANA_KEYPAIR_JSON or put one at ${join(path)}`);
  }
  return createKeyPairSignerFromBytes(new Uint8Array(JSON.parse(json) as number[]));
}

/** A client that signs and pays with `signer`. */
export function clientFor(signer: TransactionSigner) {
  return (
    createClient()
      .use(payer(signer))
      // Version 0 transactions work on every cluster and RPC provider.
      .use(solanaRpc({ rpcUrl: RPC_URL, transactionConfig: { version: 0 } }))
      .use(soluckyProgram({ programAddress: PROGRAM_ADDRESS }))
  );
}

/** A client that signs with the operator keypair (see the environment above). */
export async function createSoluckyClient() {
  return clientFor(await loadSigner());
}

export type SoluckyClient = ReturnType<typeof clientFor>;

const BPF_LOADER_UPGRADEABLE = address('BPFLoaderUpgradeab1e11111111111111111111111');

/**
 * Creates the config and opens the three games at one price and fee, in one
 * transaction. The client's payer must be the program's upgrade authority.
 */
export async function initialize(
  client: SoluckyClient,
  setup: { treasury: Address; maxNumber: number; ticketPrice: bigint; feeBps: number },
) {
  const [programData] = await getProgramDerivedAddress({
    programAddress: BPF_LOADER_UPGRADEABLE,
    seeds: [getAddressEncoder().encode(PROGRAM_ADDRESS)],
  });
  const ix = client.solucky.instructions;
  return client.sendTransaction([
    await ix.initialize({
      authority: client.payer,
      treasury: setup.treasury,
      programData,
      maxNumber: setup.maxNumber,
    }),
    ...(await Promise.all(
      GAMES.map((kind) =>
        ix.setGame({ authority: client.payer, kind, ticketPrice: setup.ticketPrice, feeBps: setup.feeBps }),
      ),
    )),
  ]);
}

export function log(message: string): void {
  console.log(`${new Date().toISOString()}  ${message}`);
}
