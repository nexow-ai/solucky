/**
 * Operator commands for the program's config and its three games.
 *
 *   bun run admin status
 *   bun run admin init --treasury <address> [--price 0.1] [--fee-bps 500] [--max-number <n>]
 *   bun run admin set [--max-number <n>] [--treasury <address>] [--authority <address>] [--pause | --resume]
 *   bun run admin game <daily|hourly|guess> [--price <SOL>] [--fee-bps <n>]
 *
 * `init` must be signed by the program's upgrade authority; it opens the
 * three games at the same price and fee, with numbers from 0 to --max-number
 * (default: SOLUCKY_MAX_NUMBER). `game` changes one game's price or fee for
 * the rounds it opens next.
 */
import { parseArgs } from 'node:util';

import { address } from '@solana/kit';
import {
  describeError,
  findConfigPda,
  findRoundPda,
  GAME_SLUGS,
  gameFromSlug,
  isLottery,
  LAMPORTS_PER_SOL,
  lamportsToSol,
  periodOf,
  RoundStatus,
} from '@solucky/client';

import {
  createSoluckyClient,
  gamePda,
  GAMES,
  initialize,
  log,
  MAX_NUMBER,
  PROGRAM_ADDRESS,
  roundLabel,
  RPC_URL,
} from './lib';

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
  log(`numbers     0 – ${c.maxNumber.toLocaleString('en-US')}`);
  log(`sales       ${c.paused ? 'PAUSED' : 'open'}`);

  for (const kind of GAMES) {
    const game = await client.solucky.accounts.game.fetchMaybe(await gamePda(kind));
    if (!game.exists) {
      log(`${GAME_SLUGS[kind].padEnd(11)} not open: run \`bun run admin game ${GAME_SLUGS[kind]} --price <SOL>\``);
      continue;
    }
    const g = game.data;
    const period = isLottery(kind) ? periodOf(kind) : g.currentRound;
    const [roundAddress] = await findRoundPda({ kind, period }, { programAddress: PROGRAM_ADDRESS });
    const round = await client.solucky.accounts.round.fetchMaybe(roundAddress);
    const label = roundLabel({ kind, period });
    log(
      `${GAME_SLUGS[kind].padEnd(11)} ◎${lamportsToSol(g.ticketPrice)} a ticket, ${g.feeBps / 100}% fee, ` +
        `◎${lamportsToSol(g.carry)} carried over; ` +
        (round.exists
          ? `${label}: ${round.data.ticketCount} tickets, ◎${lamportsToSol(round.data.pot)} pot, ${RoundStatus[round.data.status]}`
          : `${label}: no tickets yet`),
    );
  }
}

async function init() {
  if (!args.treasury) throw new Error('--treasury is required');
  const treasury = address(args.treasury);
  const { value: treasuryBalance } = await client.rpc.getBalance(treasury).send();
  if (treasuryBalance === 0n) {
    log('Warning: the treasury has no SOL. Fund it with at least ◎0.001 so it can receive small fees.');
  }
  const signature = await initialize(client, {
    treasury,
    maxNumber: integer(args['max-number'], 'max-number') ?? MAX_NUMBER,
    ticketPrice: solToLamports(args.price ?? '0.1'),
    feeBps: integer(args['fee-bps'], 'fee-bps') ?? 500,
  });
  log(`Initialized: ${signature.context.signature}`);
}

async function set() {
  if (args.pause && args.resume) throw new Error('Use either --pause or --resume');
  const result = await client.solucky.instructions
    .updateConfig({
      authority: client.payer,
      authorityArg: args.authority ? address(args.authority) : null,
      treasury: args.treasury ? address(args.treasury) : null,
      maxNumber: integer(args['max-number'], 'max-number') ?? null,
      paused: args.pause ? true : args.resume ? false : null,
    })
    .sendTransaction();
  log(`Updated: ${result.context.signature}`);
}

async function game() {
  const kind = gameFromSlug(positionals[1] ?? '');
  if (kind === null) throw new Error(`Name a game: ${GAME_SLUGS.join(', ')}`);
  const current = await client.solucky.accounts.game.fetchMaybe(await gamePda(kind));
  const ticketPrice = args.price ? solToLamports(args.price) : current.exists ? current.data.ticketPrice : null;
  const feeBps = integer(args['fee-bps'], 'fee-bps') ?? (current.exists ? current.data.feeBps : 500);
  if (ticketPrice === null) throw new Error('--price is required to open a game');
  const result = await client.solucky.instructions
    .setGame({ authority: client.payer, kind, ticketPrice, feeBps })
    .sendTransaction();
  log(`Updated ${GAME_SLUGS[kind]}: ${result.context.signature}`);
}

const commands: Record<string, () => Promise<void>> = { status, init, set, game };
const run = commands[command];
if (!run) {
  console.error(`Unknown command "${command}". Use status, init, set or game.`);
  process.exit(1);
}
try {
  await run();
  if (command !== 'status') await status();
} catch (error) {
  console.error(`Error: ${describeError(error)}`);
  process.exit(1);
}
