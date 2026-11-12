import { OPERATOR } from '../../app/utils/legal';
import { type Draw, drawMessage, type PushRecord } from './push';
import { sendPush } from './webpush';

/**
 * Tells every browser that follows the drawn game the result, and deletes
 * the subscriptions their push service no longer knows. Returns null when
 * the site has no VAPID keys (draw notifications are off).
 */
export async function notifyDraw(draw: Draw) {
  const config = useRuntimeConfig();
  const { vapidKey } = config.public;
  if (!vapidKey || !config.vapidPrivateKey) return null;

  const vapid = { publicKey: vapidKey, privateKey: config.vapidPrivateKey, subject: `mailto:${OPERATOR.email}` };
  const storage = useStorage<PushRecord>('push');
  // ponytail: one request sends to every subscriber at once; move to a queue past a few thousand.
  const results = await Promise.all(
    (await storage.getKeys()).map(async (key) => {
      const record = await storage.getItem(key);
      if (!record?.games.includes(draw.kind)) return 'skipped';
      const message = await drawMessage(draw, record.locale);
      const status = await sendPush(record.subscription, JSON.stringify(message), vapid, {
        ttl: 86_400,
        topic: message.tag,
      }).catch(() => 0);
      if (status === 404 || status === 410) {
        await storage.removeItem(key);
        return 'removed';
      }
      return status >= 200 && status < 300 ? 'sent' : 'failed';
    }),
  );
  const count = (result: string) => results.filter((r) => r === result).length;
  return { sent: count('sent'), removed: count('removed'), failed: count('failed') };
}
