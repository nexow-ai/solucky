/**
 * TypeScript client for the S☉Lucky program, built on @solana/kit.
 *
 * `./generated` is produced by Codama from idl/solucky.json (`bun run codegen`);
 * the other modules are hand-written helpers.
 *
 * Copyright (c) 2022-2026 Nexow, Inc. (https://nexow.studio). MIT License.
 */
export * from './generated';
export * from './country';
export * from './draw';
export * from './errors';
export * from './queries';
export * from './time';

/** Lamports in one SOL. */
export const LAMPORTS_PER_SOL = 1_000_000_000n;

/** Lamports as a SOL number, for display. */
export function lamportsToSol(lamports: bigint | number): number {
  return Number(lamports) / Number(LAMPORTS_PER_SOL);
}

/** Share of the pot paid to the treasury, rounded down like the program. */
export function feeFor(pot: bigint, feeBps: number): bigint {
  return (pot * BigInt(feeBps)) / 10_000n;
}

/** The winner's 80% of a pot, rounded down like the program. */
export function prizeFor(pot: bigint): bigint {
  return (pot * 8_000n) / 10_000n;
}

/** What a pot leaves for the game's next round: the 20% minus the house fee. */
export function carryFor(pot: bigint, feeBps: number): bigint {
  return pot - prizeFor(pot) - feeFor(pot, feeBps);
}
