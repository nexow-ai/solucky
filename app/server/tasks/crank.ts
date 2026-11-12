import { address, createClient, createKeyPairSignerFromBytes, type MicroLamports } from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { payer } from '@solana/kit-plugin-signer';
import {
  type GameKind,
  type Round,
  rpcEndpoint,
  settleRounds,
  SOLUCKY_PROGRAM_ADDRESS,
  soluckyProgram,
} from '@solucky/client';

import { notifyDraw } from '../utils/notify';
import { CLUSTER_RPC } from '../utils/rpc';

/** How long one run keeps settling: Cloudflare starts the next one a minute later. */
const RUN_MS = 50_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The site's own crank, run every minute (`scheduledTasks` in nuxt.config.ts,
 * a Cron Trigger in wrangler.jsonc): for about 50 seconds it settles the
 * finished lottery rounds and checks new Guess guesses, every 3 seconds while
 * something is due and every 10 otherwise, and notifies the players who
 * follow a drawn game. It signs with `NUXT_CRANK_KEYPAIR` (a secret: the byte
 * array of a lightly funded key that only pays network fees), and does
 * nothing without it.
 */
export default defineTask({
  meta: { name: 'crank', description: 'Settle finished rounds and check new guesses' },
  async run() {
    const config = useRuntimeConfig();
    if (!config.crankKeypair) return { result: 'off: no NUXT_CRANK_KEYPAIR' };

    // Nuxt parses a JSON array in an environment variable into an array.
    const key: unknown = config.crankKeypair;
    const bytes = (Array.isArray(key) ? key : JSON.parse(String(key))) as number[];
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(bytes));
    const { public: site } = config;
    // A provider's URL with its token stays on the server; the site's own
    // public endpoint and the cluster's are the fallbacks.
    const endpoint = config.rpcUpstream
      ? { rpcUrl: config.rpcUpstream }
      : site.rpcUrl
        ? rpcEndpoint({ url: site.rpcUrl, wsUrl: site.rpcWsUrl, token: site.rpcToken, tokenIn: 'path' })
        : { rpcUrl: CLUSTER_RPC[site.cluster] ?? CLUSTER_RPC.devnet! };
    const priorityFee = BigInt(config.crankPriorityFee || 0);
    const programAddress = site.programId ? address(site.programId) : SOLUCKY_PROGRAM_ADDRESS;
    const client = createClient()
      .use(payer(signer))
      .use(
        solanaRpc({
          rpcUrl: endpoint.rpcUrl,
          transactionConfig: {
            version: 0,
            ...(priorityFee > BigInt(0) && { microLamportsPerComputeUnit: priorityFee as MicroLamports }),
          },
        }),
      )
      .use(soluckyProgram({ programAddress }));

    const log = (message: string) => console.log(`crank: ${message}`);
    const onDraw = async ({ kind, period, drawnNumber, winningNumber, payout }: Round) => {
      const sent = await notifyDraw({ kind: kind as GameKind, period, drawnNumber, winningNumber, payout });
      if (sent) log(`notifications ${JSON.stringify(sent)}`);
    };

    const deadline = Date.now() + RUN_MS;
    let passes = 0;
    while (Date.now() < deadline) {
      const due = await settleRounds(client, { programAddress, log, onDraw }).catch((error: unknown) => {
        log(`pass failed: ${error instanceof Error ? error.message : String(error)}`);
        return 0;
      });
      passes++;
      await sleep(due > 0 ? 3_000 : 10_000);
    }
    return { result: `${passes} passes as ${signer.address}` };
  },
});
