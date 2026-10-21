# AGENTS.md

Guidance for AI coding agents working in this repository. Humans: see [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## Project

S☉Lucky, a daily lottery on Solana by Nexow, Inc. (nexow.studio). Monorepo with bun workspaces:

- `programs/solucky`: Anchor 1.2.1 program (Rust). Host toolchain pinned in `rust-toolchain.toml`; SBF builds use Anchor's platform-tools and SBPF v3.
- `idl/solucky.json`: committed IDL, source of the generated client.
- `clients/js`: `@solucky/client`. `src/generated` is Codama output (never edit); the other files in `src` are hand-written.
- `app`: Nuxt 4 + Nuxt UI 4 + Tailwind 4. Kit client and wallet in `app/app/composables/useSolana.ts` and `useWallet.ts`; game state in `useLottery.ts`. 20 languages with @nuxtjs/i18n: the list in `app/i18n/languages.ts`, the words in `app/i18n/locales/` (`en.ts` is the source and the type).
- `scripts`: bun scripts `admin`, `crank`, `monitor`, `localnet`, `e2e` sharing `lib.ts`, `settle.ts` and `surfnet.ts` (Surfpool cheatcodes, local only).

## Commands

- `bun install`; `bun run dev` (app on devnet)
- `bun run program:build` (anchor build + IDL copy + codegen), `bun run program:test`
- `bun run test:js`, `bun run test:browser` (Playwright; needs Surfpool, `localnet` and `bun run build`), `bun run typecheck`, `bun run lint`, `bun run format`
- `bun run check` runs what CI runs, except the program build and the e2e
- Local chain: `surfpool start --offline --no-deploy`, then `SOLANA_RPC_URL=http://127.0.0.1:8899 bun run localnet` and `bun run e2e`

## Rules

- Program changes need tests, then `bun run program:build`; commit the IDL and generated client with them.
- User-facing text goes in `app/i18n/locales/en.ts` and every other dictionary, never in a component; `bun run test:js` checks they match. English stays the default at the root (the Playwright tests read English). Use logical classes (`ps-`, `text-end`) so right-to-left pages mirror.
- Use Nuxt UI components and semantic colors (`text-muted`, `bg-elevated`…), never raw Tailwind palette colors. The brand gradient is the `text-lucky` / `bg-lucky` utilities in `main.css`.
- Kit transactions use version 0 (`transactionConfig: { version: 0 }`): many wallets cannot sign version 1 yet.
- Time on-chain is the cluster clock: scripts read the Clock sysvar, the app syncs `useNow` with it.
- Never commit keypairs, `.env` files or RPC keys. Everything under `NUXT_PUBLIC_*` reaches the browser.
- Facts only in user-facing copy: no invented numbers, partners or guarantees beyond what the program enforces.
- Conventional Commits; no co-author trailers or agent attributions in commits or pull requests. Do not commit or open pull requests unless asked.
