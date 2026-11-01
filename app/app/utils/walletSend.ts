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
  assertIsTransactionWithBlockhashLifetime,
  compileTransaction,
  createTransactionPlanExecutor,
  estimateAndSetResourceLimitsFactory,
  estimateResourceLimitsFactory,
  getBase58Decoder,
  getSignatureFromTransaction,
  getSolanaErrorFromTransactionError,
  isSolanaError,
  isTransactionModifyingSigner,
  isTransactionPartialSigner,
  isTransactionSendingSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageLifetimeUsingBlockhash,
  signature,
  signTransactionMessageWithSigners,
  SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED,
  SolanaError,
  type Signature,
  type TransactionSigner,
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
    const c = client as T & {
      rpc: StatusRpc & {
        getLatestBlockhash: () => {
          send: (config?: { abortSignal?: AbortSignal }) => Promise<{
            value: Parameters<typeof setTransactionMessageLifetimeUsingBlockhash>[0];
          }>;
        };
      };
      rpcSubscriptions: Parameters<typeof sendAndConfirmTransactionFactory>[0]['rpcSubscriptions'];
    };

    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
      rpc: c.rpc as unknown as Parameters<typeof sendAndConfirmTransactionFactory>[0]['rpc'],
      rpcSubscriptions: c.rpcSubscriptions,
    });
    const estimateResourceLimits = estimateResourceLimitsFactory({
      rpc: c.rpc as unknown as Parameters<typeof estimateResourceLimitsFactory>[0]['rpc'],
    });
    const estimateAndSetResourceLimits = estimateAndSetResourceLimitsFactory(async (message, config) => {
      const estimate = await estimateResourceLimits(message, config);
      return { ...estimate, computeUnitLimit: withComputeUnitMargin(estimate.computeUnitLimit) };
    });

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
        await sendAndConfirmTransaction(signedTransaction, {
          commitment: 'confirmed',
          ...executorConfig,
        });
        return context as typeof context & { signature: Signature };
      },
    });

    return transactionPlanSendingExecutor(executor)(client as never) as T;
  };
}
