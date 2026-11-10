/**
 * Settling rounds from the operator scripts: the shared logic in
 * `@solucky/client` (settle.ts), signed by the operator keypair, with each
 * draw reported to the app for the draw notifications.
 */
import { settleRounds as settle } from '@solucky/client';

import { log, PROGRAM_ADDRESS, reportDraw, type SoluckyClient } from './lib';

export { isDue, needsWork } from '@solucky/client';

/**
 * One pass over every round that can move, one step each. Returns how many
 * rounds were due at the start of the pass (0 means everything is settled
 * and every guess checked).
 */
export function settleRounds(client: SoluckyClient): Promise<number> {
  return settle(client, { programAddress: PROGRAM_ADDRESS, log, onDraw: reportDraw });
}
