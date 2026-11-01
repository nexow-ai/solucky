import { ensureWalletCluster } from '../utils/ensureCluster';

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
 */
export function useTransaction() {
  const toast = useToast();
  const { t } = useI18n();
  const { explorer, cluster } = useSolana();

  async function run(
    label: string,
    send: (config: SendConfig) => Promise<{ context: { signature: string } }>,
    success?: string,
  ): Promise<string | null> {
    const controller = new AbortController();
    const pending = toast.add({
      title: label,
      description: t('tx.confirm'),
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
      await ensureWalletCluster(cluster);
      const { context } = await abortable(send({ abortSignal: controller.signal }), controller.signal);
      toast.update(pending.id, {
        title: success ?? t('tx.done', { label }),
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
      toast.update(pending.id, {
        title: cancelled ? t('tx.cancelled', { label }) : t('tx.failed', { label }),
        description: controller.signal.aborted ? t('tx.abandoned') : friendlyError(error, t),
        icon: cancelled ? 'i-lucide-circle-x' : 'i-lucide-triangle-alert',
        color: cancelled ? 'neutral' : 'error',
        duration: 8_000,
        close: true,
        ui: { icon: '' },
        actions: [],
      });
      if (!cancelled) console.error(error);
      return null;
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
