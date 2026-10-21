/**
 * Operator commands for the program's config.
 *
 *   bun run admin status
 *   bun run admin init --treasury <address> [--price 0.1] [--fee-bps 500] [--max-number 1000000000]
 *   bun run admin set [--price <SOL>] [--fee-bps <n>] [--max-number <n>]
 *                     [--treasury <address>] [--authority <address>] [--pause | --resume]
 *
 * `init` must be signed by the program's upgrade authority.
 */
import { parseArgs } from 'node:util';

import { address, getAddressEncoder, getProgramDerivedAddress } from '@solana/kit';
import {
  dayOf,
  describeError,
  findConfigPda,
  findRoundPda,
  formatDay,
  LAMPORTS_PER_SOL,
  lamportsToSol,
  RoundStatus,
} from '@solucky/client';

import { createSoluckyClient, log, PROGRAM_ADDRESS, RPC_URL } from './lib';

const BPF_LOADER_UPGRADEABLE = address('BPFLoaderUpgradeab1e11111111111111111111111');

const { positionals, values: args } = parseArgs({
  allowPositionals: true,
  options: {
    price: { type: 'string' },
    'fee-bps': { type: 'string' },
    'max-number': { type: 'string' },
    treasury: { type: 'string' },
    authority: { type: 'string' },
    pause: { type: 'boolean' },
    resume: { type: 'boolean' },
  },
});

/** `0.1` SOL → 100 000 000 lamports, without floating-point drift. */
function solToLamports(sol: string): bigint {
  const [whole = '0', fraction = ''] = sol.split('.');
  if (!/^\d+$/.test(whole) || !/^\d{0,9}$/.test(fraction)) throw new Error(`Invalid SOL amount: ${sol}`);
  return BigInt(whole) * LAMPORTS_PER_SOL + BigInt(fraction.padEnd(9, '0'));
}

function integer(value: string | undefined, name: string): number | undefined {
  if (value === undefined) return undefined;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Invalid --${name}: ${value}`);
  return n;
}

const client = await createSoluckyClient();
const [configAddress] = await findConfigPda({ programAddress: PROGRAM_ADDRESS });
const command = positionals[0] ?? 'status';

async function status() {
  log(`RPC ${RPC_URL}, program ${PROGRAM_ADDRESS}`);
  const config = await client.solucky.accounts.config.fetchMaybe(configAddress);
  if (!config.exists) {
    log('No config yet: run `bun run admin init --treasury <address>`');
    return;
  }
  const c = config.data;
  log(`authority   ${c.authority}`);
  log(
    `treasury    ${c.treasury} (◎${lamportsToSol(
      await client.rpc
        .getBalance(c.treasury)
        .send()
        .then((r) => r.value),
    )})`,
  );
  log(`ticket      ◎${lamportsToSol(c.ticketPrice)}`);
  log(`fee         ${c.feeBps / 100}%`);
  log(`numbers     0 – ${c.maxNumber.toLocaleString('en-US')}`);
  log(`sales       ${c.paused ? 'PAUSED' : 'open'}`);

  const today = dayOf();
  const [roundAddress] = await findRoundPda({ day: today }, { programAddress: PROGRAM_ADDRESS });
  const round = await client.solucky.accounts.round.fetchMaybe(roundAddress);
  log(
    round.exists
      ? `today       ${formatDay(today)}: ${round.data.ticketCount} tickets, ◎${lamportsToSol(round.data.pot)} pot, ${RoundStatus[round.data.status]}`
      : `today       ${formatDay(today)}: no tickets yet`,
  );
}

async function init() {
  if (!args.treasury) throw new Error('--treasury is required');
  const treasury = address(args.treasury);
  const [programData] = await getProgramDerivedAddress({
    programAddress: BPF_LOADER_UPGRADEABLE,
    seeds: [getAddressEncoder().encode(PROGRAM_ADDRESS)],
  });
  const { value: treasuryBalance } = await client.rpc.getBalance(treasury).send();
  if (treasuryBalance === 0n) {
    log('Warning: the treasury has no SOL. Fund it with at least ◎0.001 so it can receive small fees.');
  }
  const result = await client.solucky.instructions
    .initialize({
      authority: client.payer,
      treasury,
      programData,
      ticketPrice: solToLamports(args.price ?? '0.1'),
      feeBps: integer(args['fee-bps'], 'fee-bps') ?? 500,
      maxNumber: integer(args['max-number'], 'max-number') ?? 1_000_000_000,
    })
    .sendTransaction();
  log(`Initialized: ${result.context.signature}`);
}

async function set() {
  if (args.pause && args.resume) throw new Error('Use either --pause or --resume');
  const result = await client.solucky.instructions
    .updateConfig({
      authority: client.payer,
      authorityArg: args.authority ? address(args.authority) : null,
      treasury: args.treasury ? address(args.treasury) : null,
      ticketPrice: args.price ? solToLamports(args.price) : null,
      feeBps: integer(args['fee-bps'], 'fee-bps') ?? null,
      maxNumber: integer(args['max-number'], 'max-number') ?? null,
      paused: args.pause ? true : args.resume ? false : null,
    })
    .sendTransaction();
  log(`Updated: ${result.context.signature}`);
}

const commands: Record<string, () => Promise<void>> = { status, init, set };
const run = commands[command];
if (!run) {
  console.error(`Unknown command "${command}". Use status, init or set.`);
  process.exit(1);
}
try {
  await run();
  if (command !== 'status') await status();
} catch (error) {
  console.error(`Error: ${describeError(error)}`);
  process.exit(1);
}
