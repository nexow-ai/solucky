const rentPerByte = ref<bigint | null>(null);
let asked = false;

/**
 * The rent of one byte of account data. Rent is linear in an account's size
 * plus 128 bytes, so one lookup prices every account the app creates.
 */
export function useRent() {
  if (import.meta.client && !asked) {
    asked = true;
    const { client } = useSolana();
    client.rpc
      .getMinimumBalanceForRentExemption(0n)
      .send()
      .then((empty) => (rentPerByte.value = empty / 128n))
      .catch(() => (asked = false));
  }
  return { rentPerByte: readonly(rentPerByte) };
}
