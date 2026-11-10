import { notifyDraw } from '../../utils/notify';
import { parseDraw, sameSecret } from '../../utils/push';

/**
 * A crank outside the site reports a round it has just drawn (scripts/lib.ts,
 * `reportDraw`), with the push secret; every browser that follows the game is
 * told the result. The site's own crank (server/tasks/crank.ts) notifies
 * without this request.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.public.vapidKey || !config.vapidPrivateKey || !config.pushSecret) throw createError({ statusCode: 404 });
  if (!(await sameSecret(getRequestHeader(event, 'authorization'), `Bearer ${config.pushSecret}`))) {
    throw createError({ statusCode: 401 });
  }
  const draw = parseDraw(await readBody(event));
  if (!draw) throw createError({ statusCode: 400, statusMessage: 'Not a draw' });
  return notifyDraw(draw);
});
