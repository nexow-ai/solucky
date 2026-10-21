/**
 * Gets a local Surfpool ready for the app, without the Solana CLI or the
 * program's deploy keypair:
 *
 *   surfpool start --offline --no-deploy
 *   bun run localnet --fund <your wallet address>
 *   NUXT_PUBLIC_CLUSTER=localnet bun run dev
 *
 * Loads `target/deploy/solucky.so`, creates the config and the three games if
 * needed, and funds the given wallets with 10 SOL each.
 */
import { parseArgs } from 'node:util';

import { address } from '@solana/kit';

import { clientFor, log, PROGRAM_ADDRESS, RPC_URL } from './lib';
import { assertLocalRpc, fund, localOperator, prepareLocalnet, SOL } from './surfnet';

const { values: args } = parseArgs({
  options: { fund: { type: 'string', multiple: true, default: [] } },
});

assertLocalRpc();
const operator = await localOperator();
const config = await prepareLocalnet(operator);
const client = clientFor(operator);
for (const wallet of args.fund) {
  await fund(client, address(wallet), 10n * SOL);
  log(`funded ${wallet} with ◎10`);
}
log(`ready: program ${PROGRAM_ADDRESS} on ${RPC_URL}, numbers 0 to ${config.data.maxNumber}`);
