const STORAGE_KEY = 'solucky:country';
const country = ref<string | null>(null);
let loaded = false;

/**
 * The country shown next to the player's tickets. It starts from the visitor's
 * country as seen by the host (no third-party lookup) and the player can change
 * it or keep it private.
 */
export function useCountry() {
  if (import.meta.client && !loaded) {
    loaded = true;
    let saved: string | null | undefined;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      saved = raw === null ? undefined : raw === '' ? null : raw;
    } catch {
      saved = undefined;
    }
    if (saved !== undefined) {
      country.value = saved;
    } else {
      $fetch<{ country: string | null }>('/api/geo')
        .then((data) => (country.value = data.country))
        .catch(() => {});
    }
  }

  function set(code: string | null) {
    country.value = code;
    try {
      localStorage.setItem(STORAGE_KEY, code ?? '');
    } catch {
      // Applied for this visit only.
    }
  }

  return { country: readonly(country), set };
}
