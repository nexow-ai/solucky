/**
 * The visitor's country, as already known by the host's edge network. Used
 * only to pre-fill the country shown next to a ticket; the player can change
 * it or keep it private. No IP address is stored or sent anywhere.
 */
const HEADERS = ['cf-ipcountry', 'x-vercel-ip-country', 'cloudfront-viewer-country', 'x-country-code'];

export default defineEventHandler((event) => {
  setResponseHeader(event, 'cache-control', 'private, no-store');
  for (const name of HEADERS) {
    const value = getRequestHeader(event, name)?.trim().toUpperCase();
    // Cloudflare uses XX for unknown and T1 for Tor.
    if (value && /^[A-Z]{2}$/.test(value) && value !== 'XX' && value !== 'T1') {
      return { country: value };
    }
  }
  return { country: null };
});
