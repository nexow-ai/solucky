import { errorReason } from '@solucky/client';

import { defaultRoute, otherRoute, type SendRoute, setSendRoute, signatureOf } from '../utils/walletSend';

/** What `run` hands the sender: abort it when the player gives up waiting for the wallet. */
export interface SendConfig {
  abortSignal: AbortSignal;
}

/**
 * Runs a transaction with progress, success and error toasts.
 * Returns the signature, or `null` when it failed or was cancelled.
 *
 * The progress toast has a Cancel button: a wallet that never shows its
 * prompt (or never answers) would otherwise keep the page busy until a reload.
 * When the wallet fails inside its own extension ("Unexpected error"), the
 * error toast offers the other way to send (the wallet signs and sends, or it
 * only signs and the app sends), and `run` settles once the player chose.
 */
export function useTransaction() {
  const toast = useToast();
  const { t } = useI18n();
  const { client, explorer, clusterLabel, isMainnet } = useSolana();
  const cluster = { label: clusterLabel, mainnet: isMainnet };

  function payer() {
    try {
      return client.payer;
    } catch {
      return null;
    }
  }

  /**
   * `success` may be worked out once the transaction landed; `pending`
   * replaces the "confirm in your wallet" line when no wallet prompt comes.
   */
  async function run(
    label: string,
    send: (config: SendConfig) => Promise<{ context: { signature: string } }>,
    success?: string | (() => string),
    route?: SendRoute,
    pending?: string,
  ): Promise<string | null> {
    const controller = new AbortController();
    const via = route ?? defaultRoute(payer());
    setSendRoute(controller.signal, via);
    const progress = toast.add({
      title: label,
      description: pending ?? t('tx.confirm'),
      icon: 'i-lucide-loader-circle',
      color: 'neutral',
      duration: 0,
      close: false,
      ui: { icon: 'animate-spin' },
      actions: [
        {
          label: t('tx.cancel'),
          color: 'neutral',
          variant: 'outline',
          closeOnClick: false,
          onClick: () => controller.abort(),
        },
      ],
    });
    try {
      const { context } = await abortable(send({ abortSignal: controller.signal }), controller.signal);
      toast.update(progress.id, {
        title: (typeof success === 'function' ? success() : success) ?? t('tx.done', { label }),
        description: undefined,
        icon: 'i-lucide-circle-check',
        color: 'success',
        duration: 8_000,
        close: true,
        ui: { icon: '' },
        actions: [
          {
            label: t('tx.view'),
            icon: 'i-lucide-external-link',
            color: 'neutral',
            variant: 'outline',
            to: explorer('tx', context.signature),
            target: '_blank',
          },
        ],
      });
      return context.signature;
    } catch (error) {
      const cancelled = controller.signal.aborted || isUserRejection(error);
      if (!cancelled) console.error(error);
      // A transaction that failed on-chain or never confirmed still has a page.
      const signature = cancelled ? null : signatureOf(error);
      const retry = !cancelled && errorReason(error).kind === 'wallet-failed' ? otherRoute(payer(), via) : null;
      return await new Promise<string | null>((resolve) => {
        let settled = false;
        const settle = (value: Promise<string | null> | null) => {
          if (settled) return;
          settled = true;
          resolve(value);
        };
        toast.update(progress.id, {
          title: cancelled ? t('tx.cancelled', { label }) : t('tx.failed', { label }),
          description: controller.signal.aborted ? t('tx.abandoned') : friendlyError(error, t, cluster),
          icon: cancelled ? 'i-lucide-circle-x' : 'i-lucide-triangle-alert',
          color: cancelled ? 'neutral' : 'error',
          // The player needs time to read the advice and pick the other way.
          duration: retry ? 20_000 : 8_000,
          close: true,
          ui: { icon: '' },
          actions: [
            ...(signature
              ? [
                  {
                    label: t('tx.view'),
                    icon: 'i-lucide-external-link',
                    color: 'neutral' as const,
                    variant: 'outline' as const,
                    to: explorer('tx', signature),
                    target: '_blank',
                  },
                ]
              : []),
            ...(retry
              ? [
                  {
                    label: t('tx.otherWay'),
                    icon: 'i-lucide-refresh-cw',
                    color: 'primary' as const,
                    variant: 'solid' as const,
                    onClick: () => settle(run(label, send, success, retry, pending)),
                  },
                ]
              : []),
          ],
          'onUpdate:open': (open: boolean) => {
            if (!open) settle(null);
          },
        });
        if (!retry) settle(null);
      });
    }
  }

  return { run };
}

/**
 * Settles as soon as `signal` aborts, even if `promise` never does: a wallet
 * may ignore the abort and keep its request open.
 */
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(signal.reason);
    if (signal.aborted) return onAbort();
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
  });
}
