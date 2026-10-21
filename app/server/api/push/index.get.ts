import { type PushRecord, recordKey } from '../../utils/push';

/** The games a browser gets draw notifications for: `?endpoint=` its push subscription's. */
export default defineEventHandler(async (event) => {
  const { endpoint } = getQuery(event);
  if (typeof endpoint !== 'string') throw createError({ statusCode: 400, statusMessage: 'Missing endpoint' });
  const record = await useStorage<PushRecord>('push').getItem(await recordKey(endpoint));
  return { games: record?.games ?? [] };
});
