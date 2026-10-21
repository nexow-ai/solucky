import { ensureWalletCluster } from '../utils/ensureCluster';

/**
 * Runs a transaction with progress, success and error toasts.
 * Returns the signature, or `null` when it failed or was cancelled.
 */
export function useTransaction() {
  const toast = useToast();
  const { t } = useI18n();
  const { explorer, cluster } = useSolana();

  async function run(
    label: string,
    send: () => Promise<{ context: { signature: string } }>,
    success?: string,
  ): Promise<string | null> {
    const pending = toast.add({
      title: label,
      description: t('tx.confirm'),
      icon: 'i-lucide-loader-circle',
      color: 'neutral',
      duration: 0,
      close: false,
      ui: { icon: 'animate-spin' },
    });
    try {
      await ensureWalletCluster(cluster);
      const { context } = await send();
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
      toast.update(pending.id, {
        title: isUserRejection(error) ? t('tx.cancelled', { label }) : t('tx.failed', { label }),
        description: friendlyError(error, t),
        icon: isUserRejection(error) ? 'i-lucide-circle-x' : 'i-lucide-triangle-alert',
        color: isUserRejection(error) ? 'neutral' : 'error',
        duration: 8_000,
        close: true,
        ui: { icon: '' },
      });
      if (!isUserRejection(error)) console.error(error);
      return null;
    }
  }

  return { run };
}
