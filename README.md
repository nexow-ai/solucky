<div align="center">

<img src="app/public/logo.png" alt="" width="96" />

# S☉Lucky

**A daily lottery on Solana. Pick a number, and the whole pot goes to one ticket at midnight UTC.**

Every ticket, every lamport of the pot and every draw lives on-chain, where anyone can check it. In 20 languages.

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
    Drawn --> Settled: claim_prize pays the winner
    Settled --> [*]: collect_fee pays the treasury
```

1. **Buy.** `buy_ticket` moves the ticket price from the player to the day's round account and mixes the purchase into the round's entropy. The first ticket of the day opens the round. The buyer passes the price they were shown and never pays more.
2. **Close.** After midnight UTC anyone can call `close_round`. It pins a slot 8 slots in the future, whose hash nobody knows yet.
3. **Draw.** Once that slot exists, anyone can call `draw_round`. The program reads the slot's hash from the SlotHashes sysvar and computes `randomness = sha256(entropy ‖ slot_hash ‖ slot ‖ round)`. The winning ticket is purchase number `u64(randomness[0..8]) mod ticket_count`.
4. **Pay.** Anyone can call `claim_prize`. The pot minus the house fee goes to the winning ticket's owner, and nobody else can receive it. Anyone can then call `collect_fee` to send the fee to the treasury; the two steps are separate so the treasury can never hold up a winner.
5. **Reclaim.** After the payout, players can close their tickets to get the account rent back. The round account stays on-chain as the public record of the day.

A bot (the **crank**, `bun run crank`) does steps 2–4 right after midnight, and any player can close, draw and pay from the History panel of the app. Each step only costs network fees.

## Fairness and trust

| Guarantee | Enforced by |
| --- | --- |
| The pot can only go to the winner and the fee to the treasury | `claim_prize` checks the ticket and its owner; `collect_fee` checks the configured treasury |
| The operator cannot withdraw a pot or stop it from being paid | No such instruction exists; pausing only blocks new tickets, and the winner's payout never touches the treasury. The authority can only change where fees go |
| The fee is at most 10%, and price or fee changes never affect a round already selling | `MAX_FEE_BPS`, and each round copies the price and fee when it opens |
| A buyer never pays more than the price they saw | `buy_ticket` takes a `max_price` |
| Prizes can always be paid, even to an empty wallet | Tickets cost at least 0.001 SOL, so a prize is always above the rent-exempt minimum |
| Only the program's upgrade authority can create the config | `initialize` checks the program data account |
| Anyone can finish a round | `close_round`, `draw_round` and `claim_prize` need no special signer |
| Anyone can check the draw | The round stores the entropy, slot, slot hash and randomness; the app recomputes them in the browser |

**Known limits.** This draw is fair against players, not against validators:

- The randomness comes from the hash of a slot pinned a few slots in the future, so nobody can predict it when the round closes. But the slot hash is a bank hash, which depends on the block's contents: the leader of that slot can try different blocks and publish a favourable one, or skip it (leaders produce 4 slots in a row, and the next leader can fork a block out). A validator who also closes the round can aim the pinned slot at its own leader slots.
- Once the pinned slot exists, anyone can compute the result before drawing. The draw stays possible while SlotHashes still holds that slot (about 512 slots, ~3.5 minutes), and `close_round` only pins a new slot once SlotHashes proves the old one is out of reach. A player who closes a round and dislikes the result could still withhold the draw and hope nobody else draws in time. Run the crank continuously (`bun run crank --watch --interval 10`) so every round is drawn within seconds.
- For real-money pots, replace the draw with a verifiable randomness oracle such as Switchboard On-Demand or ORAO VRF. The draw logic is one function in [`draw_round.rs`](programs/solucky/src/instructions/draw_round.rs).
- An upgradeable program is only as trustworthy as its upgrade authority. Consider a multisig, or making the program immutable once it is stable.

## Repository layout

```
programs/solucky/   Anchor program (Rust), with unit and LiteSVM integration tests
idl/                The program's IDL, committed so the client can be regenerated without Rust
clients/js/         @solucky/client: Codama-generated @solana/kit client plus helpers
app/                Nuxt 4 + Nuxt UI app: landing page, game, round pages, /api/price, /api/geo, in 20 languages (app/i18n)
scripts/            Operator scripts: admin (config), crank (settle rounds), e2e (local end-to-end)
.github/workflows/  CI, and an optional scheduled crank
```

## Requirements

- [Bun](https://bun.sh) 1.2 or later, and Node.js 22.22 or later
- To build the program: [Rust](https://rustup.rs) (the pinned toolchain installs itself), [Anchor](https://www.anchor-lang.com/docs/installation) 1.2.1 (`avm install 1.2.1 && avm use 1.2.1`) and the [Solana CLI](https://docs.anza.xyz/cli/install) (Agave) for `cargo build-sbf`
- To deploy to devnet or mainnet: the Solana CLI **4.x** (tested with 4.3.2; older CLIs cannot deploy SBPF v3 programs)
- To run everything locally: [Surfpool](https://github.com/txtx/surfpool) 1.6 or later. Its cheatcodes load the program without the Solana CLI or a deploy keypair, and move the clock past midnight

## Quick start

```bash
bun install
bun run dev          # http://localhost:3000, against devnet
```

The app talks to the program on the cluster set in `app/.env` (see [`app/.env.example`](app/.env.example)). Until the program is deployed and initialized there, the game shows "The lottery is not set up on this cluster yet".

### Run the whole stack locally

```bash
bun run program:build        # anchor build, copy the IDL, regenerate the client
surfpool start --offline --no-deploy

# in another terminal
export SOLANA_RPC_URL=http://127.0.0.1:8899
bun run localnet --fund <YOUR WALLET ADDRESS>   # load the program, create the config, send you ◎10
bun run e2e                                     # optional: play a full round and check every payout
NUXT_PUBLIC_CLUSTER=localnet bun run dev
```

`localnet` and `e2e` only run against a local RPC. They load `target/deploy/solucky.so` at the program address with your keypair (or a throwaway one) as upgrade authority, and create a config with ◎0.1 tickets and a 5% fee. Point your wallet at `http://127.0.0.1:8899` to play.

The program address in the code, `8uiVKnUeC7L4KG93MWvfhRoJkprdAUZ3eg3nzzKfowq2`, belongs to a keypair that Nexow keeps out of the repository. On a fresh clone, `anchor build` creates a new `target/deploy/solucky-keypair.json`; run `anchor keys sync` and `bun run program:build` once to switch the code, IDL and client to your own address. Keep that keypair backed up and never commit it.

## Deploying

1. **Program.** Make a [verifiable build](#verifiable-builds), then deploy it with the wallet that should be the upgrade authority:
   ```bash
   bun run program:build:verifiable
   solana program deploy -u devnet --program-id target/deploy/solucky-keypair.json target/verifiable/solucky.so
   ```
2. **Config.** As the upgrade authority, create the config (tickets cost at least ◎0.001). Fund the treasury with at least ◎0.001 first, so it can receive small fees:
   ```bash
   SOLANA_RPC_URL=https://api.devnet.solana.com bun run admin init --treasury <ADDRESS> --price 0.1 --fee-bps 500
   bun run admin status
   ```
   Later changes: `bun run admin set --price 0.2`, `--fee-bps 300`, `--treasury <ADDRESS>`, `--authority <ADDRESS>`, `--pause`, `--resume`.
3. **App.** `bun run deploy` builds for Cloudflare Workers and deploys with [`app/wrangler.jsonc`](app/wrangler.jsonc). Set the cluster, and preferably a dedicated RPC endpoint, as `NUXT_PUBLIC_*` variables there. `bun run build` produces a Node server in `app/.output` instead.
4. **Crank.** Run `bun run crank --watch --interval 10` as a service (systemd, a container, a small VM) so rounds are drawn within seconds of midnight. [`.github/workflows/crank.yml`](.github/workflows/crank.yml) is a backup, since scheduled Actions often start minutes late: enable it with the repository variable `SOLUCKY_CRANK_ENABLED=true`, the variable `SOLANA_RPC_URL` and the secret `SOLANA_KEYPAIR_JSON`. Use a dedicated, lightly funded keypair: the crank never needs authority.
5. **Monitoring.** `bun run monitor --crank <CRANK ADDRESS>` exits with an error when a finished round is still unsettled 15 minutes after midnight, or when the crank holds less than ◎0.05; with `ALERT_WEBHOOK_URL` set it also posts to a Slack or Discord webhook. [`.github/workflows/monitor.yml`](.github/workflows/monitor.yml) runs it twice a day once the repository variable `SOLUCKY_MONITOR_ENABLED=true` is set (with the variables `SOLANA_RPC_URL` and `SOLUCKY_CRANK`, and the secret `ALERT_WEBHOOK_URL`); GitHub also emails you when a run fails.

## Verifiable builds

`bun run program:build:verifiable` builds the program inside Anchor's pinned Docker image (`quay.io/ottersec/anchor:v1.2.1`), so the same commit always produces the same bytes, whoever builds it. Deploy `target/verifiable/solucky.so`, not the regular build, so the program on-chain can be traced back to this source.

Every `v*` tag runs the [Release workflow](.github/workflows/release.yml), which makes the same build and attaches `solucky.so`, its SHA-256, its program hash and the IDL to the GitHub release. The program hash ignores the file's trailing zero bytes, as the chain does, so it is the value to compare with a deployment.

To check a deployed program against a commit, rebuild that commit (or download the release's `solucky.so`) and compare hashes with [`solana-verify`](https://github.com/Ellipsis-Labs/solana-verifiable-build):

```bash
git checkout <COMMIT> && bun run program:build:verifiable
solana-verify get-executable-hash target/verifiable/solucky.so
solana-verify get-program-hash -u devnet 8uiVKnUeC7L4KG93MWvfhRoJkprdAUZ3eg3nzzKfowq2   # must print the same hash
```

To show the program as verified in Solana explorers, the upgrade authority can publish the check with `solana-verify verify-from-repo --remote`, passing `--base-image quay.io/ottersec/anchor:v1.2.1` so it builds exactly like `program:build:verifiable`.

## Configuration

**App** (`app/.env`, or the host's environment; all public):

| Variable | Default | Meaning |
| --- | --- | --- |
| `NUXT_PUBLIC_CLUSTER` | `devnet` | `mainnet`, `devnet`, `testnet` or `localnet`; also picks the wallet chain |
| `NUXT_PUBLIC_RPC_URL` | public endpoint | RPC endpoint. Use a provider in production: public endpoints are rate-limited |
| `NUXT_PUBLIC_RPC_WS_URL` | from the RPC URL | Websocket endpoint, if different |
| `NUXT_PUBLIC_PROGRAM_ID` | from the IDL | Program address |
| `NUXT_PUBLIC_SITE_URL` | empty | Public URL of the site, for absolute social-card links |
| `NUXT_PUBLIC_I18N_BASE_URL` | empty | The same URL again, for the hreflang and canonical links of every language |
| `NUXT_PUBLIC_TWITTER_URL`, `NUXT_PUBLIC_DISCORD_URL` | empty | Footer links, hidden when empty |

**Scripts** (`admin`, `crank`, `monitor`, `localnet`, `e2e`):

| Variable | Default | Meaning |
| --- | --- | --- |
| `SOLANA_RPC_URL` | devnet | RPC endpoint |
| `SOLANA_KEYPAIR` | `~/.config/solana/id.json` | Signer keypair file |
| `SOLANA_KEYPAIR_JSON` | — | The keypair's byte array, for CI secrets |
| `SOLUCKY_PROGRAM_ID` | from the IDL | Program address |
| `ALERT_WEBHOOK_URL` | — | `monitor` only: Slack or Discord webhook for alerts |

## Languages

English, Español, Français, Deutsch, Italiano, Português (Brasil), Nederlands, Türkçe, Русский, Українська, العربية, עברית, हिन्दी, ไทย, Tiếng Việt, Bahasa Indonesia, 简体中文, 繁體中文, 日本語 and 한국어: the same twenty as [beenzer.xyz](https://beenzer.xyz).

- **The list** is [`app/i18n/languages.ts`](app/i18n/languages.ts): each language's path code, its `lang` tag, its name in itself, its direction, and the plural forms its messages give. `nuxt.config.ts` reads it for [@nuxtjs/i18n](https://i18n.nuxtjs.org).
- **The words** are in `app/i18n/locales/`, one file per language. `en.ts` is the source and defines the type every other file must match. `bun run test:js` checks that every dictionary has the same keys and the same `{placeholders}` as English, the right number of plural forms, and valid message syntax, and that it is really translated. Messages follow vue-i18n: `{name}` is a value the page fills in (sometimes a link or bold text, rendered with `<i18n-t>`), and ` | ` separates plural forms. The legal pages are translated too, and each translation says the English version applies.
- **Pages** exist in every language: English at the root (`/play`), the others under their code (`/fr/play`, `/ar/play`, `/zh-cn/play`). Each page has `hreflang` alternates and its own `og:locale`; set `NUXT_PUBLIC_I18N_BASE_URL` so they are absolute.
- **Right to left:** Arabic and Hebrew set `dir="rtl"`, and Nuxt UI's components follow. Layout uses logical properties (`ps-`, `ms-`, `text-end`), arrows along the line of reading flip, and the parts that are clocks or numbers stay left to right: the solar dial, the day bar, the countdown, the reels, the keypad, the pot chart, addresses.
- **Type:** Space Grotesk and JetBrains Mono cover Latin and Vietnamese. Cyrillic, Arabic, Hebrew, Devanagari, Thai, Chinese, Japanese and Korean use the faces their systems ship, so nothing is downloaded from anyone else; those scripts drop the Latin letter-spacing (`main.css`).
- **Numbers:** lottery numbers and SOL amounts look the same in every language (`1 000 000 000`, `◎0.1`). Dollars, percentages, durations, dates and country names follow the page's language through `Intl`, with Western digits in Arabic and the Gregorian calendar in Thai. Program errors are translated from their codes (`app/utils/errors.ts`).
- **Choosing:** the globe in the header lists every language in its own name, and the footer links them all. Nothing redirects and no cookie is set: a visitor whose browser prefers another of the languages is offered it once, in that language (`AppLangSuggest.vue`), and the choice is kept in local storage (`solucky:lang`, listed on the Cookies & storage page).

To add a language: add it to `LOCALES` with its plural forms, copy `en.ts` to `<code>.ts` and translate it (keep the keys, `{placeholders}` and plural forms), add its Nuxt UI locale in `app/app/app.vue` and its offer in `app/i18n/suggest.ts`. To change copy, change `en.ts` and every other dictionary with it.

## Program reference

| Instruction | Who | What |
| --- | --- | --- |
| `initialize(ticket_price, fee_bps, max_number)` | upgrade authority | Creates the config |
| `update_config(update)` | config authority | Changes the authority, treasury, price, fee, number range or pause flag |
| `buy_ticket(day, number, country, max_price)` | any player | Buys `number` in today's round, at no more than `max_price` |
| `close_round` | anyone | Ends a finished round and pins the draw slot |
| `draw_round` | anyone | Picks the winning ticket |
| `claim_prize` | anyone | Pays the winner |
| `collect_fee` | anyone | Sends a settled round's fee to the treasury |
| `close_ticket` | ticket owner | Returns a settled round's ticket rent |

Accounts are PDAs: `Config` (`"config"`), `Round` (`"round"`, day as u32 LE) and `Ticket` (`"ticket"`, round, number as u32 LE). Days count from the Unix epoch in UTC. A ticket's country is an ISO 3166-1 alpha-2 code, or two zero bytes when the player keeps it private. Error codes start at 6000; see [`error.rs`](programs/solucky/src/error.rs).

## Development

```bash
bun run program:test   # program unit + LiteSVM integration tests (needs target/deploy/solucky.so)
bun run test:js        # client and app unit tests
bun run test:browser   # Playwright, against a production build on a local Surfpool (see below)
bun run typecheck
bun run lint           # ESLint, and Clippy with warnings as errors
bun run format         # Prettier and rustfmt
bun run check          # everything CI runs, except the program build and the e2e
```

After changing the program, run `bun run program:build`: it rebuilds the program, copies the IDL to `idl/` and regenerates `clients/js/src/generated`. Never edit generated files by hand.

The browser tests drive the real app in Chromium with an injected test wallet: connect, buy a number, settle the round after midnight and check the draw, with no Content Security Policy violations allowed. Run them with Surfpool up and `bun run localnet` done, after `bun run build`.

CI runs three jobs on every push: the program (format, build, Clippy, tests, and a check that the committed IDL matches), the client and app (stale generated code, format, types, lint, tests, Node and Cloudflare builds), and an end-to-end job on Surfpool with the program binary the first job built, which plays a full round with the scripts and then with the browser.

## Security

Report vulnerabilities privately; see [SECURITY.md](SECURITY.md). Production builds of the app send a strict set of security headers (CSP with no third-party scripts, `frame-ancestors 'none'`, HSTS, and others), defined in [`app/nuxt.config.ts`](app/nuxt.config.ts); on Cloudflare, Nitro writes them to `_headers` so static files carry them too. Before version 1.0.0 this repository contained credentials and a keypair in plain text. They are gone from the code but remain in the git history of this public repository, so treat all of them as compromised.

## Legal

Lotteries and gambling are regulated in most countries. The public app runs on devnet with test SOL. Running S☉Lucky with real money is the operator's responsibility: check the licences you need, restrict access where it is not allowed, and only let adults play.

## License

[MIT](LICENSE) © 2022–2026 Nexow, Inc. · [nexow.studio](https://nexow.studio)
