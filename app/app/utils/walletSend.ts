/**
 * Send transactions through the wallet's `signAndSendTransaction` when the
 * connected payer exposes it.
 *
 * Kit's default executor always calls `signTransaction` then submits via the
 * app RPC. Phantom frequently fails that path on Devnet with a generic
 * "Unexpected error". Asking the wallet to sign and send in one step avoids it.
 */
import { transactionPlanSendingExecutor } from '@solana/kit-plugin-instruction-plan';
import {
  assertIsTransactionWithBlockhashLifetime,
  compileTransaction,
  createTransactionPlanExecutor,
  estimateAndSetResourceLimitsFactory,
  estimateResourceLimitsFactory,
  getBase58Decoder,
  getSignatureFromTransaction,
  isTransactionSendingSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageLifetimeUsingBlockhash,
  signature,
  signTransactionMessageWithSigners,
  type Signature,
  type TransactionSigner,
} from '@solana/kit';

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

async function confirmSignature(
  rpc: {
    getSignatureStatuses: (signatures: Signature[]) => {
      send: (config?: {
        abortSignal?: AbortSignal;
      }) => Promise<{ value: ({ confirmationStatus?: string | null } | null)[] }>;
    };
  },
  sig: Signature,
  abortSignal?: AbortSignal,
) {
  for (let i = 0; i < 40; i++) {
    abortSignal?.throwIfAborted();
    const { value } = await rpc.getSignatureStatuses([sig]).send({ abortSignal });
    const status = value[0]?.confirmationStatus;
    if (status === 'confirmed' || status === 'finalized') return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('The wallet sent the transaction, but confirmation timed out. Check the explorer.');
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
      rpc: {
        getLatestBlockhash: () => {
          send: (config?: { abortSignal?: AbortSignal }) => Promise<{
            value: Parameters<typeof setTransactionMessageLifetimeUsingBlockhash>[0];
          }>;
        };
        getSignatureStatuses: (signatures: Signature[]) => {
          send: (config?: { abortSignal?: AbortSignal }) => Promise<{
            value: ({ confirmationStatus?: string | null } | null)[];
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
        if (payer && isTransactionSendingSigner(payer)) {
          const compiled = compileTransaction(prepared);
          const [signatureBytes] = await payer.signAndSendTransactions([compiled], executorConfig);
          if (!signatureBytes) throw new Error('The wallet returned no signature');
          const sig = signature(getBase58Decoder().decode(signatureBytes));
          Object.assign(context, { signature: sig });
          await confirmSignature(c.rpc, sig, executorConfig?.abortSignal);
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
