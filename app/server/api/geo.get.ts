/**
 * The visitor's country, as already known by the host's edge network. Used
 * only to pre-fill the country shown next to a ticket; the player can change
 * it or keep it private. No IP address is stored or sent anywhere.
 */
import { countryFromHeaders } from '../utils/live';

export default defineEventHandler((event) => {
  setResponseHeader(event, 'cache-control', 'private, no-store');
  return { country: countryFromHeaders((name) => getRequestHeader(event, name)) };
});
