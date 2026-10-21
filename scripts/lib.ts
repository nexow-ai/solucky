/**
 * Shared setup for the operator scripts: an RPC client signed by a local
 * keypair, with the S☉Lucky program plugin installed.
 *
 * Environment:
 *   SOLANA_RPC_URL       RPC endpoint (default: devnet)
 *   SOLANA_KEYPAIR       path to a keypair JSON file (default: ~/.config/solana/id.json)
 *   SOLANA_KEYPAIR_JSON  the keypair's byte array itself, for CI secrets; wins over the file
 *   SOLUCKY_PROGRAM_ID   program address (default: the address in the IDL)
 */
import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  address,
  createClient,
  createKeyPairSignerFromBytes,
  type KeyPairSigner,
  type TransactionSigner,
} from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { payer } from '@solana/kit-plugin-signer';
import { SOLUCKY_PROGRAM_ADDRESS, soluckyProgram } from '@solucky/client';

export const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const PROGRAM_ADDRESS = process.env.SOLUCKY_PROGRAM_ID
  ? address(process.env.SOLUCKY_PROGRAM_ID)
  : SOLUCKY_PROGRAM_ADDRESS;

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

export function log(message: string): void {
  console.log(`${new Date().toISOString()}  ${message}`);
}
