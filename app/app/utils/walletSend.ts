/**
 * Prefer the wallet's `solana:signAndSendTransaction` when available.
 *
 * Kit's default RPC executor always uses `signTransaction` then submits via
 * the app RPC. Phantom often fails that path on Devnet with a generic
 * "Unexpected error"; signing and sending inside the wallet is more reliable.
 */
import { transactionPlanSendingExecutor } from '@solana/kit-plugin-instruction-plan';
import {
  assertIsTransactionWithBlockhashLifetime,
  createTransactionPlanExecutor,
  estimateAndSetResourceLimitsFactory,
  estimateResourceLimitsFactory,
  getBase58Decoder,
  getSignatureFromTransaction,
  isTransactionMessageWithSingleSendingSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  signature,
  signTransactionMessageWithSigners,
  type Signature,
} from '@solana/kit';

async function confirmSignature(
  rpc: {
    getSignatureStatuses: (
      signatures: Signature[],
    ) => { send: (config?: { abortSignal?: AbortSignal }) => Promise<{ value: ({ confirmationStatus?: string | null } | null)[] }> };
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

/** Replaces `client.sendTransaction` with a wallet-aware sender. */
export function walletAwareSend() {
  return <T extends object>(client: T): T => {
    const c = client as T & {
      rpc: {
        getLatestBlockhash: () => {
          send: (config?: { abortSignal?: AbortSignal }) => Promise<{ value: Parameters<typeof setTransactionMessageLifetimeUsingBlockhash>[0] }>;
        };
        getSignatureStatuses: (
          signatures: Signature[],
        ) => {
          send: (config?: { abortSignal?: AbortSignal }) => Promise<{ value: ({ confirmationStatus?: string | null } | null)[] }>;
        };
      };
      rpcSubscriptions: Parameters<typeof sendAndConfirmTransactionFactory>[0]['rpcSubscriptions'];
    };

    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
      rpc: c.rpc as unknown as Parameters<typeof sendAndConfirmTransactionFactory>[0]['rpc'],
      rpcSubscriptions: c.rpcSubscriptions,
    });
    const estimateAndSetResourceLimits = estimateAndSetResourceLimitsFactory(
      estimateResourceLimitsFactory({
        rpc: c.rpc as unknown as Parameters<typeof estimateResourceLimitsFactory>[0]['rpc'],
      }),
    );

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

        if (isTransactionMessageWithSingleSendingSigner(prepared)) {
          const signatureBytes = await signAndSendTransactionMessageWithSigners(prepared, executorConfig);
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
