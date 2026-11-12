/**
 * Send transactions through the wallet's `signAndSendTransaction` when the
 * connected payer exposes it, and through `signTransaction` plus the app's RPC
 * otherwise, or when the player asks for the other way after a failure.
 *
 * Phantom recommends signing and sending in one step: when the app broadcasts
 * a transaction Phantom only signed, Phantom warns that it "reverted during
 * simulation" on devnet. But a wallet can fail inside its own extension on
 * either path ("Unexpected error"), so `run` offers the other one.
 */
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  assertIsTransactionWithinSizeLimit,
  compileTransaction,
  createTransactionMessage,
  createTransactionPlanExecutor,
  estimateAndSetResourceLimitsFactory,
  estimateResourceLimitsFactory,
  getBase58Decoder,
  getBase64EncodedWireTransaction,
  getSignatureFromTransaction,
  getSolanaErrorFromTransactionError,
  isSolanaError,
  isTransactionModifyingSigner,
  isTransactionPartialSigner,
  isTransactionSendingSigner,
  type MicroLamports,
  pipe,
  setTransactionMessageComputeUnitPrice,
  setTransactionMessageLifetimeUsingBlockhash,
  signature,
  signTransactionMessageWithSigners,
  SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED,
  SolanaError,
  setTransactionMessageFeePayerSigner,
  type Instruction,
  type Signature,
  type Transaction,
  type TransactionSigner,
  type TransactionWithinSizeLimit,
  type TransactionWithLifetime,
} from '@solana/kit';
import { transactionPlanSendingExecutor } from '@solana/kit-plugin-instruction-plan';

/**
 * The compute unit limit for a simulated cost, with the margin Kit's own
 * executor adds: 10% shrinking to 2% at 500k units, and at least 300 units.
 * Never the exact estimate: Phantom adds a priority-fee instruction before it
 * sends, which then runs out of compute and fails as "Unexpected error".
 */
export function withComputeUnitMargin(units: number): number {
  const margin = 0.1 - 0.08 * Math.min(units / 500_000, 1);
  return Math.min(1_400_000, units + Math.max(300, Math.ceil(units * margin)));
}

/**
 * How a transaction reaches the cluster: `wallet` asks the wallet to sign and
 * send it, `app` asks the wallet only to sign and sends it through the app's RPC.
 */
export type SendRoute = 'wallet' | 'app';

// Kit only hands the executor the abort signal of a send, so a send's route
// rides on it: `run` creates one signal per attempt.
const routes = new WeakMap<AbortSignal, SendRoute>();

/** Sends the transaction that uses `signal` by `route`, whatever the wallet prefers. */
export function setSendRoute(signal: AbortSignal, route: SendRoute) {
  routes.set(signal, route);
}

/** The route a payer takes when nothing asks for another one. */
export function defaultRoute(payer: TransactionSigner | null): SendRoute {
  return payer && isTransactionSendingSigner(payer) ? 'wallet' : 'app';
}

/** The route to offer after `route` failed, if the payer can take it. */
export function otherRoute(payer: TransactionSigner | null, route: SendRoute): SendRoute | null {
  if (!payer) return null;
  if (route === 'wallet')
    return isTransactionModifyingSigner(payer) || isTransactionPartialSigner(payer) ? 'app' : null;
  return isTransactionSendingSigner(payer) ? 'wallet' : null;
}

type StatusRpc = {
  getSignatureStatuses: (signatures: Signature[]) => {
    send: (config?: { abortSignal?: AbortSignal }) => Promise<{
      value: readonly ({ confirmationStatus?: string | null; err?: unknown } | null)[];
    }>;
  };
  getBlockHeight: (config?: { commitment?: 'confirmed' }) => {
    send: (config?: { abortSignal?: AbortSignal }) => Promise<bigint>;
  };
};

/**
 * Waits until the cluster confirms `sig`, throwing the transaction's own error
 * if it landed but failed, and a block-height error once its blockhash expired
 * without it landing. Polls, so it works without a websocket.
 */
export async function confirmSignature(
  rpc: StatusRpc,
  sig: Signature,
  lastValidBlockHeight: bigint,
  { abortSignal, interval = 750 }: { abortSignal?: AbortSignal; interval?: number } = {},
): Promise<void> {
  for (let i = 0; ; i++) {
    abortSignal?.throwIfAborted();
    // Read the height first: a transaction that lands just before its
    // blockhash expires still counts.
    const height = i % 4 === 3 ? await rpc.getBlockHeight({ commitment: 'confirmed' }).send({ abortSignal }) : null;
    const { value } = await rpc.getSignatureStatuses([sig]).send({ abortSignal });
    const status = value[0];
    if (status?.err) throw getSolanaErrorFromTransactionError(status.err as never);
    if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') return;
    if (height !== null && height > lastValidBlockHeight) {
      throw new SolanaError(SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED, {
        currentBlockHeight: height,
        lastValidBlockHeight,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/** The signature of a transaction that failed after the wallet signed it, if any. */
export function signatureOf(error: unknown): Signature | null {
  let current: unknown = error;
  for (let depth = 0; current && depth < 8; depth++) {
    const result = isSolanaError(current)
      ? (current.context as { transactionPlanResult?: { context?: { signature?: Signature } } }).transactionPlanResult
      : undefined;
    if (result?.context?.signature) return result.context.signature;
    current = (current as { cause?: unknown }).cause;
  }
  return null;
}

function payerOf(client: object): TransactionSigner | null {
  try {
    const payer = (client as { payer?: TransactionSigner }).payer;
    return payer ?? null;
  } catch {
    return null;
  }
}

/** Replaces `client.sendTransaction` with a wallet-aware sender. */
export function walletAwareSend() {
  return <T extends object>(client: T): T => {
    const c = client as T & { rpc: BatchRpc };

    const estimateAndSetResourceLimits = resourceLimitsSetter(c.rpc);

    const executor = createTransactionPlanExecutor({
      executeTransactionMessage: async (context, transactionMessage, executorConfig) => {
        executorConfig?.abortSignal?.throwIfAborted();
        const { value: latestBlockhash } = await c.rpc.getLatestBlockhash().send(executorConfig);

        const prepared = await pipe(
          transactionMessage,
          (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
          async (tx) => await estimateAndSetResourceLimits(tx, executorConfig),
        );
        Object.assign(context, { message: prepared });

        const payer = payerOf(client);
        const signal = executorConfig?.abortSignal;
        const route = (signal && routes.get(signal)) ?? defaultRoute(payer);
        if (route === 'wallet' && payer && isTransactionSendingSigner(payer)) {
          const compiled = compileTransaction(prepared);
          const [signatureBytes] = await payer.signAndSendTransactions([compiled], executorConfig);
          if (!signatureBytes) throw new Error('The wallet returned no signature');
          const sig = signature(getBase58Decoder().decode(signatureBytes));
          Object.assign(context, { signature: sig });
          await confirmSignature(c.rpc, sig, latestBlockhash.lastValidBlockHeight, { abortSignal: signal });
          return context as typeof context & { signature: Signature };
        }

        const signedTransaction = await signTransactionMessageWithSigners(prepared, executorConfig);
        assertIsTransactionWithBlockhashLifetime(signedTransaction);
        const sig = getSignatureFromTransaction(signedTransaction);
        Object.assign(context, { transaction: signedTransaction, signature: sig });
        // Sent with a preflight, then confirmed by polling: no websocket needed,
        // so it also works through the app's RPC proxy (server/api/rpc.post.ts).
        await c.rpc
          .sendTransaction(getBase64EncodedWireTransaction(signedTransaction), {
            encoding: 'base64',
            preflightCommitment: 'confirmed',
          })
          .send({ abortSignal: signal });
        await confirmSignature(c.rpc, sig, latestBlockhash.lastValidBlockHeight, { abortSignal: signal });
        return context as typeof context & { signature: Signature };
      },
    });

    return transactionPlanSendingExecutor(executor)(client as never) as T;
  };
}

type BatchRpc = StatusRpc & {
  getLatestBlockhash: () => {
    send: (config?: { abortSignal?: AbortSignal }) => Promise<{
      value: Parameters<typeof setTransactionMessageLifetimeUsingBlockhash>[0];
    }>;
  };
  sendTransaction: (
    wire: ReturnType<typeof getBase64EncodedWireTransaction>,
    config: { encoding: 'base64'; preflightCommitment: 'confirmed' },
  ) => { send: (config?: { abortSignal?: AbortSignal }) => Promise<Signature> };
};

/** Whether `signer` can sign without sending, which lets a wallet approve many transactions at once. */
export function canSignOnly(signer: TransactionSigner | null): boolean {
  return !!signer && (isTransactionModifyingSigner(signer) || isTransactionPartialSigner(signer));
}

/** Signs every transaction in one request to `signer`: one wallet prompt for all of them. */
type Sendable = Transaction & TransactionWithinSizeLimit & TransactionWithLifetime;

async function signAll(
  signer: TransactionSigner,
  transactions: Sendable[],
  config: { abortSignal?: AbortSignal },
): Promise<readonly Transaction[]> {
  if (isTransactionModifyingSigner(signer)) return await signer.modifyAndSignTransactions(transactions, config);
  if (isTransactionPartialSigner(signer)) {
    const dictionaries = await signer.signTransactions(transactions, config);
    return transactions.map((transaction, i) =>
      Object.freeze({
        ...transaction,
        signatures: Object.freeze({ ...transaction.signatures, ...dictionaries[i] }),
      }),
    );
  }
  throw new Error('This wallet cannot sign transactions');
}

/**
 * Sends one transaction per instruction set, all paid by `signer`, and waits
 * until every one is confirmed. Signed in one request (one wallet prompt)
 * unless `route` is `wallet` and the wallet sends them itself; a quick-buy
 * key signs without any prompt. Throws the first failure once all are
 * settled, after the others had their chance to land.
 */
export async function sendInstructionSets(
  rpc: BatchRpc,
  signer: TransactionSigner,
  sets: readonly (readonly Instruction[])[],
  { abortSignal, route }: { abortSignal?: AbortSignal; route?: SendRoute } = {},
): Promise<Signature[]> {
  abortSignal?.throwIfAborted();
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send({ abortSignal });
  const setLimits = resourceLimitsSetter(rpc);
  const messages = await Promise.all(
    sets.map((instructions) =>
      pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(instructions, tx),
        (tx) => setLimits(tx, { abortSignal }),
      ),
    ),
  );
  const transactions = messages.map((message) => {
    const transaction = compileTransaction(message);
    assertIsTransactionWithinSizeLimit(transaction);
    return transaction;
  });
  const via = route ?? (abortSignal && routes.get(abortSignal)) ?? (canSignOnly(signer) ? 'app' : 'wallet');

  let signatures: Signature[];
  if ((via === 'wallet' || !canSignOnly(signer)) && isTransactionSendingSigner(signer)) {
    const sent = await signer.signAndSendTransactions(transactions, { abortSignal });
    signatures = sent.map((bytes) => signature(getBase58Decoder().decode(bytes)));
  } else {
    const signed = await signAll(signer, transactions, { abortSignal });
    signatures = await Promise.all(
      signed.map(async (transaction) => {
        const sig = getSignatureFromTransaction(transaction);
        await rpc
          .sendTransaction(getBase64EncodedWireTransaction(transaction), {
            encoding: 'base64',
            preflightCommitment: 'confirmed',
          })
          .send({ abortSignal });
        return sig;
      }),
    );
  }
  const results = await Promise.allSettled(
    signatures.map((sig) => confirmSignature(rpc, sig, latestBlockhash.lastValidBlockHeight, { abortSignal })),
  );
  const failed = results.find((result) => result.status === 'rejected');
  if (failed) throw failed.reason;
  return signatures;
}

type LimitsRpc = Parameters<typeof estimateResourceLimitsFactory>[0]['rpc'];

/** The priority fee every transaction offers, in micro-lamports per compute unit (`NUXT_PUBLIC_PRIORITY_FEE`). */
let priorityFee = 0n;

/** Sets the priority fee of the transactions sent from now on; 0 sends none. */
export function setPriorityFee(microLamports: bigint) {
  priorityFee = microLamports > 0n ? microLamports : 0n;
}

/**
 * Sets a message's priority fee, if any, then its compute unit limit from a
 * simulation, with Kit's margin (see `withComputeUnitMargin`). A wallet that
 * finds a priority fee already set keeps it rather than adding its own.
 */
function resourceLimitsSetter(rpc: unknown) {
  const estimateResourceLimits = estimateResourceLimitsFactory({ rpc: rpc as LimitsRpc });
  const setLimits = estimateAndSetResourceLimitsFactory(async (message, config) => {
    const estimate = await estimateResourceLimits(message, config);
    return { ...estimate, computeUnitLimit: withComputeUnitMargin(estimate.computeUnitLimit) };
  });
  return <M extends Parameters<typeof setLimits>[0]>(message: M, config?: Parameters<typeof setLimits>[1]) =>
    setLimits(
      priorityFee > 0n
        ? (setTransactionMessageComputeUnitPrice(priorityFee as MicroLamports, message as never) as M)
        : message,
      config,
    );
}
