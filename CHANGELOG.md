# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-20

A rewrite of the 2022 prototype into a self-contained, verifiable product. Nothing is shared with the old deployment: it uses a new program address and a new client.

### Added

- Anchor 1.2 program that holds each day's pot in the round account and settles it on-chain: `buy_ticket`, `close_round`, `draw_round`, `claim_prize`, `collect_fee`, `close_ticket`, plus `initialize` (upgrade authority only) and `update_config`.
- Draw from a slot hash pinned in the future, mixed with every purchase; the round stores the inputs so anyone can recompute it. A new slot can only be pinned once SlotHashes proves the old one is out of reach.
- Winners are paid by `claim_prize` and the fee by a separate `collect_fee`, so the treasury can never hold up a payout. Buyers pass a `max_price`, and tickets cost at least 0.001 SOL so every prize can be paid.
- Unit tests and LiteSVM integration tests for every instruction and failure path.
- `@solucky/client`, a Codama-generated `@solana/kit` client with query, time, country, error and draw-verification helpers.
- Neon city landing: animated skyline, synthwave sun and grid floor, digit rain, live ticket ticker and HUD cards, with the dark theme by default.
- Nuxt 4 + Nuxt UI app with a landing page, the three-panel game, round pages with an in-browser draw check, Wallet Standard support, live updates, dark and light themes, sounds, and `/api/price` and `/api/geo` routes. Deploys to Cloudflare Workers or Node.
- Operator scripts: `admin` (init, status, config changes), `crank` (settles finished rounds), `localnet` (loads the program into a local Surfpool, no CLI or deploy keypair needed) and `e2e` (full local round).
- CI for the program, client and app, an end-to-end round on Surfpool played by the scripts and by Playwright in a real browser, Dependabot, and an optional scheduled crank workflow.
- `monitor` script and workflow: alerts (exit code, Slack or Discord webhook) when a round is left unsettled after midnight or the crank runs low.
- Verifiable builds in Anchor's pinned Docker image (`bun run program:build:verifiable`), and a Release workflow that attaches the binary, its hash and the IDL to each `v*` release.
- Faster pages on mobile: number formatters are created once instead of on every clock tick, Nuxt UI only ships CSS for the components in use, the Node server serves precompressed static files, and the wallet button and live pot load after first paint.
- Production security headers for the app (CSP, frame blocking, HSTS and more), also written to Cloudflare's `_headers`.
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
