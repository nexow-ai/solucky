# Contributing

Thanks for helping with S☉Lucky. Setup, commands and architecture are in the [README](README.md).

## Workflow

1. Branch from `dev` with a name like `feat/round-page` or `fix/claim-treasury`.
2. Keep each change focused. A reformat never goes in the same commit as a logic change.
3. Run `bun run check` (and `bun run program:build` first if you touched the program) before opening a pull request into `dev`.
4. Test program changes on a local validator or devnet. Never test with real players' funds.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description`, for example `fix(program): reject duplicate treasury`.

- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`.
- Scopes: `program`, `client`, `app`, `scripts`, `deps`, `ci`, `docs`.
- Dependency updates go in their own `build(deps): …` commit, with the lockfile. Versions are pinned exactly.

## App copy and languages

- Every word on the page comes from `app/i18n/locales/`, never written into a component. Change `en.ts` and every other language with it: `bun run test:js` fails until they match. A translation says the same thing as the English, no more and no less. See [Languages](README.md#languages).
- Use logical classes (`ps-`, `ms-`, `start-`, `text-end`) for anything that follows the line of reading, so Arabic and Hebrew mirror. Clocks, numbers and addresses stay left to right (`dir="ltr"`).
- Before a pull request that touches the app, look at a right-to-left page (`/ar/` or `/he/`) and a CJK one (`/ja/`).

## Program changes

- Every new rule needs a test in `programs/solucky/tests`.
- After changing accounts, instructions, events or errors, run `bun run program:build` and commit the updated `idl/` and `clients/js/src/generated`. Never edit generated code by hand.
- Changing an account layout breaks existing accounts. Plan a migration before shipping one to a cluster with live rounds.

## Security

Report vulnerabilities privately, as described in [SECURITY.md](SECURITY.md).
