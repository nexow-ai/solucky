# Security policy

Nexow, Inc. maintains S☉Lucky. We take the safety of players' funds seriously.

## Reporting a vulnerability

**Do not open a public issue.** Email **admin@nexow.ai** with the subject `Security report: solucky` and include:

- what is affected (program instruction, app, scripts) and the commit or deployed program address
- the impact, and steps or a proof of concept to reproduce it
- whether and when you plan to disclose it

We aim to acknowledge reports within three business days and to agree on a fix and disclosure timeline with you. Please give us reasonable time to fix an issue before disclosing it, and never test against real players' funds: use devnet or a local validator.

## Scope

- The Solana program in `programs/solucky` (highest priority: anything that moves lamports to the wrong account, blocks a round from settling, or biases the draw)
- The app in `app`, including its `/api` routes
- The operator scripts in `scripts`

## Trust model and known limits

The guarantees and their limits are listed in the README under [Fairness and trust](README.md#fairness-and-trust). In short: pots can only go to the winning ticket's owner and the fee to the treasury; every round can be finished by anyone; the draw uses a slot hash pinned in the future, which the leader of that slot could influence only by skipping their block. The program is upgradeable, so its upgrade authority is trusted until the program is made immutable or handed to a multisig.

## Secrets in the git history

Before version 1.0.0 (October 2026) this public repository contained, in plain text: a Solana keypair (`GANTRxDjP5BoUExWqVLAC9yVhC29dThviuqNmMDdSEF4`), private keys in client code, a PostgreSQL connection string with its password, Twitter API credentials and an IP-lookup API key. Version 1.0.0 removed them from the code, but they remain in the history. All of them are compromised: never reuse them, and revoke any that are still valid.

## Operator hygiene

- Keep `target/deploy/solucky-keypair.json` and the upgrade authority keypair offline and backed up; neither is needed to run the game.
- Give the crank its own lightly funded keypair. It only pays network fees.
- Never put a keypair in `app/.env`: everything in it is shipped to browsers.
