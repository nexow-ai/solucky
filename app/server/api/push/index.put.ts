import { parseGames, parseLocale, parseSubscription, type PushRecord, recordKey } from '../../utils/push';

/**
 * Sets the games a browser gets draw notifications for, in its language. No
 * games deletes what we keep for it. Nothing else is stored: no wallet, no IP.
 */
export default defineEventHandler(async (event) => {
  if (!useRuntimeConfig(event).public.vapidKey) throw createError({ statusCode: 404 });
  const body = await readBody<Record<string, unknown> | null>(event);
  const subscription = parseSubscription(body?.subscription);
  const games = parseGames(body?.games);
  if (!subscription || !games) throw createError({ statusCode: 400, statusMessage: 'Not a push subscription' });

  const storage = useStorage<PushRecord>('push');
  const key = await recordKey(subscription.endpoint);
  if (games.length) await storage.setItem(key, { subscription, games, locale: parseLocale(body?.locale) });
  else await storage.removeItem(key);
  return { games };
});
