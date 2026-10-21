import { OPERATOR } from '../../../app/utils/legal';
import { drawMessage, parseDraw, type PushRecord, sameSecret } from '../../utils/push';
import { sendPush } from '../../utils/webpush';

/**
 * The crank reports a round it has just drawn (scripts/lib.ts, `reportDraw`),
 * with the push secret; every browser that follows the game is told the
 * result. Subscriptions their push service no longer knows are deleted.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { vapidKey } = config.public;
  if (!vapidKey || !config.vapidPrivateKey || !config.pushSecret) throw createError({ statusCode: 404 });
  if (!(await sameSecret(getRequestHeader(event, 'authorization'), `Bearer ${config.pushSecret}`))) {
    throw createError({ statusCode: 401 });
  }
  const draw = parseDraw(await readBody(event));
  if (!draw) throw createError({ statusCode: 400, statusMessage: 'Not a draw' });

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
});
