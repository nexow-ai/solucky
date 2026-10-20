<div align="center">

<img src="app/public/logo.png" alt="" width="96" />

# S☉Lucky

**A daily lottery on Solana. Pick a number, and the whole pot goes to one ticket at midnight UTC.**

Every ticket, every lamport of the pot and every draw lives on-chain, where anyone can check it.

[![CI](https://github.com/nexow-ai/solucky/actions/workflows/ci.yml/badge.svg)](https://github.com/nexow-ai/solucky/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Anchor 1.2](https://img.shields.io/badge/Anchor-1.2-9945FF)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82)

A product of [Nexow, Inc.](https://nexow.studio)

</div>

---

## How it works

Each UTC day is a **round**. Players buy **tickets** at a fixed price, each carrying a number from 0 to 1 000 000 000. A number can only be sold once per round. Every ticket has the same chance of winning: your odds are your tickets divided by all tickets sold that day.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Open: first ticket of the day
    Open --> Closed: close_round, after 00:00 UTC
    Closed --> Drawn: draw_round, once the pinned slot is produced
    Closed --> Closed: close_round again if the pinned slot expired
    Drawn --> Settled: claim_prize pays winner and treasury
    Settled --> [*]
```

1. **Buy.** `buy_ticket` moves the ticket price from the player to the day's round account and mixes the purchase into the round's entropy. The first ticket of the day opens the round.
2. **Close.** After midnight UTC anyone can call `close_round`. It pins a slot 8 slots in the future, whose hash nobody knows yet.
3. **Draw.** Once that slot exists, anyone can call `draw_round`. The program reads the slot's hash from the SlotHashes sysvar and computes `randomness = sha256(entropy ‖ slot_hash ‖ slot ‖ round)`. The winning ticket is purchase number `u64(randomness[0..8]) mod ticket_count`.
4. **Pay.** Anyone can call `claim_prize`. The pot minus the house fee goes to the winning ticket's owner, and the fee to the treasury. Nobody else can receive it.
5. **Reclaim.** After the payout, players can close their tickets to get the account rent back. The round account stays on-chain as the public record of the day.

A bot (the **crank**, `bun run crank`) does steps 2–4 right after midnight, and any player can do them from the History panel of the app. Each step only costs network fees.

## Fairness and trust

| Guarantee | Enforced by |
| --- | --- |
| The pot can only go to the winner and the fee to the treasury | `claim_prize` checks the ticket, its owner and the configured treasury |
| The operator cannot withdraw a pot or stop it from being paid | No such instruction exists; pausing only blocks new tickets. The authority can only change where future fees go |
| The fee is at most 10%, and price or fee changes never affect a round already selling | `MAX_FEE_BPS`, and each round copies the price and fee when it opens |
| Only the program's upgrade authority can create the config | `initialize` checks the program data account |
| Anyone can finish a round | `close_round`, `draw_round` and `claim_prize` need no special signer |
| Anyone can check the draw | The round stores the entropy, slot, slot hash and randomness; the app recomputes them in the browser |

**Known limits.** The randomness comes from a slot hash pinned in the future, so nobody knows it when the round closes. The leader of that slot could still influence it, but only by skipping their own block, which hands the draw to the next produced slot. If nobody draws within the ~500 slots the sysvar remembers (~3 minutes), `close_round` pins a fresh slot; a running crank makes that window irrelevant. For large real-money pots, swap in a verifiable randomness oracle such as Switchboard On-Demand or ORAO VRF: the draw logic is one function in [`draw_round.rs`](programs/solucky/src/instructions/draw_round.rs). Upgradeable programs are only as trustworthy as their upgrade authority, so consider a multisig or making the program immutable once it is stable.

## Repository layout

```
programs/solucky/   Anchor program (Rust), with unit and LiteSVM integration tests
idl/                The program's IDL, committed so the client can be regenerated without Rust
clients/js/         @solucky/client: Codama-generated @solana/kit client plus helpers
app/                Nuxt 4 + Nuxt UI app: landing page, game, round pages, /api/price, /api/geo
scripts/            Operator scripts: admin (config), crank (settle rounds), e2e (local end-to-end)
.github/workflows/  CI, and an optional scheduled crank
```

## Requirements

- [Bun](https://bun.sh) 1.2 or later, and Node.js 22.22 or later
- To build and deploy the program: [Rust](https://rustup.rs) (the pinned toolchain installs itself), the [Solana CLI](https://docs.anza.xyz/cli/install) (Agave) **4.x** (tested with 4.3.2; older CLIs cannot deploy SBPF v3 programs), and [Anchor](https://www.anchor-lang.com/docs/installation) 1.2.1 (`avm install 1.2.1 && avm use 1.2.1`)
- For local end-to-end runs: [Surfpool](https://github.com/txtx/surfpool), whose clock can jump past midnight

## Quick start

```bash
bun install
bun run dev          # http://localhost:3000, against devnet
```

The app talks to the program on the cluster set in `app/.env` (see [`app/.env.example`](app/.env.example)). Until the program is deployed and initialized there, the game shows "The lottery is not set up on this cluster yet".

### Run the whole stack locally

```bash
bun run program:build                       # anchor build, copy the IDL, regenerate the client
surfpool start --offline --no-deploy --airdrop "$(solana address)"
solana program deploy -u localhost --use-rpc \
  --program-id target/deploy/solucky-keypair.json target/deploy/solucky.so
SOLANA_RPC_URL=http://127.0.0.1:8899 bun run admin init --treasury <ADDRESS>
SOLANA_RPC_URL=http://127.0.0.1:8899 bun run e2e      # optional: buy, jump past midnight, settle, verify
NUXT_PUBLIC_CLUSTER=localnet bun run dev
```

The program address in the code, `8uiVKnUeC7L4KG93MWvfhRoJkprdAUZ3eg3nzzKfowq2`, belongs to a keypair that Nexow keeps out of the repository. On a fresh clone, `anchor build` creates a new `target/deploy/solucky-keypair.json`; run `anchor keys sync` and `bun run program:build` once to switch the code, IDL and client to your own address. Keep that keypair backed up and never commit it.

## Deploying

1. **Program.** Build, then deploy with the wallet that should be the upgrade authority:
   ```bash
   bun run program:build
   solana program deploy -u devnet --program-id target/deploy/solucky-keypair.json target/deploy/solucky.so
   ```
2. **Config.** As the upgrade authority, create the config. Fund the treasury with at least ◎0.001 first, so it can receive small fees:
   ```bash
   SOLANA_RPC_URL=https://api.devnet.solana.com bun run admin init --treasury <ADDRESS> --price 0.1 --fee-bps 500
   bun run admin status
   ```
   Later changes: `bun run admin set --price 0.2`, `--fee-bps 300`, `--treasury <ADDRESS>`, `--authority <ADDRESS>`, `--pause`, `--resume`.
3. **App.** `bun run deploy` builds for Cloudflare Workers and deploys with [`app/wrangler.jsonc`](app/wrangler.jsonc). Set the cluster, and preferably a dedicated RPC endpoint, as `NUXT_PUBLIC_*` variables there. `bun run build` produces a Node server in `app/.output` instead.
4. **Crank.** Run `bun run crank` from cron shortly after 00:00 UTC, `bun run crank --watch` as a service, or enable [`.github/workflows/crank.yml`](.github/workflows/crank.yml) with the repository variable `SOLUCKY_CRANK_ENABLED=true`, the variable `SOLANA_RPC_URL` and the secret `SOLANA_KEYPAIR_JSON`. Use a dedicated, lightly funded keypair: the crank never needs authority.

## Configuration

**App** (`app/.env`, or the host's environment; all public):

| Variable | Default | Meaning |
| --- | --- | --- |
| `NUXT_PUBLIC_CLUSTER` | `devnet` | `mainnet`, `devnet`, `testnet` or `localnet`; also picks the wallet chain |
| `NUXT_PUBLIC_RPC_URL` | public endpoint | RPC endpoint. Use a provider in production: public endpoints are rate-limited |
| `NUXT_PUBLIC_RPC_WS_URL` | from the RPC URL | Websocket endpoint, if different |
| `NUXT_PUBLIC_PROGRAM_ID` | from the IDL | Program address |
| `NUXT_PUBLIC_SITE_URL` | empty | Public URL of the site, set at build time for absolute social-card links |
| `NUXT_PUBLIC_TWITTER_URL`, `NUXT_PUBLIC_DISCORD_URL` | empty | Footer links, hidden when empty |

**Scripts** (`admin`, `crank`, `e2e`):

| Variable | Default | Meaning |
| --- | --- | --- |
| `SOLANA_RPC_URL` | devnet | RPC endpoint |
| `SOLANA_KEYPAIR` | `~/.config/solana/id.json` | Signer keypair file |
| `SOLANA_KEYPAIR_JSON` | — | The keypair's byte array, for CI secrets |
| `SOLUCKY_PROGRAM_ID` | from the IDL | Program address |

## Program reference

| Instruction | Who | What |
| --- | --- | --- |
| `initialize(ticket_price, fee_bps, max_number)` | upgrade authority | Creates the config |
| `update_config(update)` | config authority | Changes the authority, treasury, price, fee, number range or pause flag |
| `buy_ticket(day, number, country)` | any player | Buys `number` in today's round |
| `close_round` | anyone | Ends a finished round and pins the draw slot |
| `draw_round` | anyone | Picks the winning ticket |
| `claim_prize` | anyone | Pays the winner and the treasury |
| `close_ticket` | ticket owner | Returns a settled round's ticket rent |

Accounts are PDAs: `Config` (`"config"`), `Round` (`"round"`, day as u32 LE) and `Ticket` (`"ticket"`, round, number as u32 LE). Days count from the Unix epoch in UTC. A ticket's country is an ISO 3166-1 alpha-2 code, or two zero bytes when the player keeps it private. Error codes start at 6000; see [`error.rs`](programs/solucky/src/error.rs).

## Development

```bash
bun run program:test   # program unit + LiteSVM integration tests (needs target/deploy/solucky.so)
bun run test:js        # client and app unit tests
bun run typecheck
bun run lint           # ESLint, and Clippy with warnings as errors
bun run format         # Prettier and rustfmt
bun run check          # everything CI runs, except the program build
```

After changing the program, run `bun run program:build`: it rebuilds the program, copies the IDL to `idl/` and regenerates `clients/js/src/generated`. Never edit generated files by hand. CI fails if the committed IDL or client is stale.

## Security

Report vulnerabilities privately; see [SECURITY.md](SECURITY.md). Before version 1.0.0 this repository contained credentials and a keypair in plain text. They are gone from the code but remain in the git history of this public repository, so treat all of them as compromised.

## Legal

Lotteries and gambling are regulated in most countries. The public app runs on devnet with test SOL. Running S☉Lucky with real money is the operator's responsibility: check the licences you need, restrict access where it is not allowed, and only let adults play.

## License

[MIT](LICENSE) © 2022–2026 Nexow, Inc. · [nexow.studio](https://nexow.studio)
