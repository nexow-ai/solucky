/**
 * Settles finished lottery rounds (close → draw → pay the winner → collect the
 * fee) and checks new Guess guesses (seal → draw → pay a winner).
 *
 *   bun run crank            settle everything due, then exit (for cron)
 *   bun run crank --watch    keep running, checking every --interval seconds
 */
import { parseArgs } from 'node:util';

import { createSoluckyClient, log, PROGRAM_ADDRESS, RPC_URL } from './lib';
import { settleRounds } from './settle';

const { values: args } = parseArgs({
  options: {
    watch: { type: 'boolean', default: false },
    interval: { type: 'string', default: '30' },
    timeout: { type: 'string', default: '600' },
  },
});

const client = await createSoluckyClient();
const interval = Number(args.interval) * 1000;
const deadline = Date.now() + Number(args.timeout) * 1000;
log(`crank on ${RPC_URL} for ${PROGRAM_ADDRESS} as ${client.payer.address}`);

for (;;) {
  const pending = await settleRounds(client);
  if (!args.watch && (pending === 0 || Date.now() > deadline)) {
    log(pending === 0 ? 'every finished round is settled' : `${pending} round(s) still pending, giving up`);
    process.exit(pending === 0 ? 0 : 1);
  }
  // Each pass moves a round one step; the draw needs ~8 slots after the close,
  // so a guess is checked a few seconds after it is bought.
  await Bun.sleep(args.watch && pending === 0 ? interval : 3_000);
}
