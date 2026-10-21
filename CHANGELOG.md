# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

Three games instead of one. Every account layout changes, so this version needs a new deployment and a new `initialize`; rounds and tickets of 1.0 are not readable by it.

### Added

- Three games, each with its own ticket price and house fee (`Game` accounts, `set_game`): the **daily lottery**, an **hourly lottery**, and **Guess the number**, whose rounds have no end time and last until a guess finds the round's number.
- Guess the number is provably fair: nobody holds the number. New guesses are sealed into a batch and checked by `draw_round` a few seconds later; a batch of `k` guesses with `R` numbers not tried yet holds the number with odds `k/R`, the same as a number hidden when the round opened. Sales stop once the batch's pinned slot exists, sealed guesses keep the entropy they were sealed with, and a re-pinned check keeps the same guesses.
- The highest ticket number is a setting: `SOLUCKY_MAX_NUMBER` (scripts, written to the config by `admin init` and `localnet`) and `NUXT_PUBLIC_MAX_NUMBER` (app, until the config loads), both 21 000 000 by default. A root `.env.example` lists the scripts' settings.
- `bun run admin game <daily|hourly|guess> --price --fee-bps`, and `admin status` shows every game.
- The play page has a game switcher (`/play/daily`, `/play/hourly`, `/play/guess`), the landing page a Games section, and round pages live at `/rounds/<game>/<round>`. Guess shows the numbers not tried yet, the guesses waiting for a check, a "Check now" button, and a toast when your guess is checked.
- The win chance shown in the lotteries is the share of the number range closer to your numbers than to anyone else's (`winShare` in the client).

- The app in 20 languages: English, Spanish, French, German, Italian, Portuguese (Brazil), Dutch, Turkish, Russian, Ukrainian, Arabic, Hebrew, Hindi, Thai, Vietnamese, Indonesian, Chinese (Simplified and Traditional), Japanese and Korean. Every page, toast, error and legal page is translated, under `/<code>/` paths with `hreflang` alternates. The header has a language menu, the footer links every language, and a visitor whose browser prefers another language is offered it once. Arabic and Hebrew are laid out right to left.
- Dollars, percentages, durations, dates and country names follow the page's language; program errors are explained in it.
- A test that checks every dictionary against English: keys, placeholders, plural forms, message syntax.

### Changed

- **The winner is the closest number.** A lottery draw picks a random number from 0 to the highest number, and the ticket closest to it wins (a tie goes to the lower number), instead of a random ticket. Lottery rounds keep their numbers sorted in the round account, so the program finds the winner by binary search and the browser can recheck it.
- **80% to the winner, the rest carries over.** The winner gets 80% of the pot; the house fee comes out of the other 20% (capped at 20% instead of 10%) and what is left joins the pot of the game's next round drawn. `draw_round` splits the pot; `claim_prize` pays the stored payout.
- Tickets cost at least ◎0.002 (was ◎0.001), so 80% of the smallest pot can always be paid.
- `Round` is `["round", kind, period]`: `day` becomes `period` (days, hours or the Guess round number) and the round copies the highest number when it opens. `initialize` only takes the highest number; price and fee moved to `set_game`. `WrongDay` is now `WrongRound`, and `RoundFull`, `NothingToCheck`, `BatchSealed` and `InvalidGame` are new errors.
- The crank and the monitor handle every game, oldest round first, and the backup crank workflow runs every half hour.
- The Cookies & storage page and the Privacy Policy list a fifth local-storage setting, `solucky:lang`, the language the visitor chose. Still no cookies.

## [1.0.0] - 2026-10-20

A rewrite of the 2022 prototype into a self-contained, verifiable product. Nothing is shared with the old deployment: it uses a new program address and a new client.

### Added

- Anchor 1.2 program that holds each day's pot in the round account and settles it on-chain: `buy_ticket`, `close_round`, `draw_round`, `claim_prize`, `collect_fee`, `close_ticket`, plus `initialize` (upgrade authority only) and `update_config`.
- Draw from a slot hash pinned in the future, mixed with every purchase; the round stores the inputs so anyone can recompute it. A new slot can only be pinned once SlotHashes proves the old one is out of reach.
- Winners are paid by `claim_prize` and the fee by a separate `collect_fee`, so the treasury can never hold up a payout. Buyers pass a `max_price`, and tickets cost at least 0.001 SOL so every prize can be paid.
- Unit tests and LiteSVM integration tests for every instruction and failure path.
- `@solucky/client`, a Codama-generated `@solana/kit` client with query, time, country, error and draw-verification helpers.
- Solar dial landing: a live dial of the UTC day (the sun at the current time, today's tickets placed by purchase time and number, the pot, the countdown and the round's entropy), a corona that flares when tickets land, a day timeline, a draw receipt that recomputes the last settled draw in the browser, a live ticket ticker and LED-style numerals, with the dark theme by default.
- Nuxt 4 + Nuxt UI app with a landing page, the three-panel game, round pages with an in-browser draw check, Wallet Standard support, live updates, dark and light themes, sounds, and `/api/price` and `/api/geo` routes. Deploys to Cloudflare Workers or Node.
- Operator scripts: `admin` (init, status, config changes), `crank` (settles finished rounds), `localnet` (loads the program into a local Surfpool, no CLI or deploy keypair needed) and `e2e` (full local round).
- CI for the program, client and app, an end-to-end round on Surfpool played by the scripts and by Playwright in a real browser, Dependabot, and an optional scheduled crank workflow.
- `monitor` script and workflow: alerts (exit code, Slack or Discord webhook) when a round is left unsettled after midnight or the crank runs low.
- Verifiable builds in Anchor's pinned Docker image (`bun run program:build:verifiable`), and a Release workflow that attaches the binary, its hash and the IDL to each `v*` release.
- Faster pages on mobile: number formatters are created once instead of on every clock tick, Nuxt UI only ships CSS for the components in use, the Node server serves precompressed static files, and the wallet button and live pot load after first paint.
- Production security headers for the app (CSP, frame blocking, HSTS and more), also written to Cloudflare's `_headers`.
- Legal pages under `/legal`, linked from the footer: legal notice, Terms of Service, Privacy Policy, Cookies & storage (no cookies; the four local-storage settings) and Responsible play.
- README, security policy, contributing guide and MIT license.

### Changed

- Tickets cost a configurable price (0.1 SOL by default) instead of a hard-coded 1 SOL sent to a personal wallet.
- The landing page is rendered per request instead of prerendered, so runtime settings such as `NUXT_PUBLIC_CLUSTER` apply on every page.
- Countries come from the host's edge headers and can be changed or kept private, instead of a third-party IP lookup with an API key in the client.

### Removed

- The Express + Socket.IO server and its PostgreSQL tables, which built SQL from client input.
- The Vue CLI client and the `web` landing page, including the unused NFT artwork (about 1 GB).
- Deprecated wallet adapters (Sollet, Slope and others) and `@project-serum/anchor`.
- Every committed secret. They remain in the git history; see [SECURITY.md](SECURITY.md).

[1.0.0]: https://github.com/nexow-ai/solucky/releases/tag/v1.0.0
