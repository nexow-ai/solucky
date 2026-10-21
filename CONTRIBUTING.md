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

## Program changes

- Every new rule needs a test in `programs/solucky/tests`.
- After changing accounts, instructions, events or errors, run `bun run program:build` and commit the updated `idl/` and `clients/js/src/generated`. Never edit generated code by hand.
- Changing an account layout breaks existing accounts. Plan a migration before shipping one to a cluster with live rounds.

## Security

Report vulnerabilities privately, as described in [SECURITY.md](SECURITY.md).
