/**
 * Helpers for a local Surfpool network (https://surfpool.run): its cheatcodes
 * load the program without a deploy keypair and move the clock forward.
 * Everything here refuses to run against a remote cluster.
 */
import {
  type Account,
  type Address,
  generateKeyPairSigner,
  getAddressEncoder,
  getProgramDerivedAddress,
  type KeyPairSigner,
  lamports,
} from '@solana/kit';
import { type Config, findConfigPda } from '@solucky/client';

import { clientFor, loadSigner, log, PROGRAM_ADDRESS, RPC_URL, type SoluckyClient } from './lib';

export const SOL = 1_000_000_000n;
const PROGRAM_PATH = new URL('../target/deploy/solucky.so', import.meta.url).pathname;
const BPF_LOADER_UPGRADEABLE = 'BPFLoaderUpgradeab1e11111111111111111111111' as Address;
/** Program bytes per `surfnet_writeProgram` call, well under the RPC size limit. */
const CHUNK = 256 * 1024;

export function assertLocalRpc(): void {
  if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(RPC_URL)) {
    console.error(`Refusing to run against ${RPC_URL}: this only runs on a local Surfpool.`);
    process.exit(1);
  }
}

/** Calls a Surfpool cheatcode (or any JSON-RPC method) on the local RPC. */
export async function surfnet(method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const body = (await response.json()) as { error?: { message: string }; result?: unknown };
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}

/** Moves the cluster clock to `unixMs` (it only moves forward). */
export async function timeTravel(unixMs: number): Promise<void> {
  await surfnet('surfnet_timeTravel', [{ absoluteTimestamp: unixMs }]);
}

export async function fund(client: SoluckyClient, address: Address, amount: bigint): Promise<void> {
  await client.rpc.requestAirdrop(address, lamports(amount)).send();
  for (let i = 0; i < 30; i++) {
    const { value } = await client.rpc.getBalance(address).send();
    if (value >= amount) return;
    await Bun.sleep(500);
  }
}

/** The operator keypair if one is configured, otherwise a fresh funded one. */
export async function localOperator(): Promise<KeyPairSigner> {
  return loadSigner().catch(async () => {
    log('no operator keypair configured; using a throwaway one');
    return generateKeyPairSigner();
  });
}

/**
 * Gets a local Surfpool ready to play: the program from `target/deploy` (with
 * `operator` as upgrade authority) and a config with a funded treasury.
 */
export async function prepareLocalnet(operator: KeyPairSigner): Promise<Account<Config>> {
  const client = clientFor(operator);
  await fund(client, operator.address, 100n * SOL);

  const { value: program } = await client.rpc.getAccountInfo(PROGRAM_ADDRESS, { encoding: 'base64' }).send();
  if (!program) {
    const file = Bun.file(PROGRAM_PATH);
    if (!(await file.exists())) throw new Error('No program build: run `bun run program:build` first');
    const bytes = new Uint8Array(await file.arrayBuffer());
    for (let offset = 0; offset < bytes.length; offset += CHUNK) {
      const chunk = Buffer.from(bytes.subarray(offset, offset + CHUNK)).toString('hex');
      await surfnet('surfnet_writeProgram', [PROGRAM_ADDRESS, chunk, offset, operator.address]);
    }
    log(`loaded ${PROGRAM_PATH} at ${PROGRAM_ADDRESS}, upgrade authority ${operator.address}`);
  }

  const [configAddress] = await findConfigPda({ programAddress: PROGRAM_ADDRESS });
  const existing = await client.solucky.accounts.config.fetchMaybe(configAddress);
  if (existing.exists) return existing;

  const treasury = await generateKeyPairSigner();
  await fund(client, treasury.address, SOL);
  const [programData] = await getProgramDerivedAddress({
    programAddress: BPF_LOADER_UPGRADEABLE,
    seeds: [getAddressEncoder().encode(PROGRAM_ADDRESS)],
  });
  await client.solucky.instructions
    .initialize({
      authority: operator,
      treasury: treasury.address,
      programData,
      ticketPrice: SOL / 10n,
      feeBps: 500,
      maxNumber: 1_000_000_000,
    })
    .sendTransaction();
  log(`initialized the config: ◎0.1 tickets, 5% fee, treasury ${treasury.address}`);
  return client.solucky.accounts.config.fetch(configAddress);
}
