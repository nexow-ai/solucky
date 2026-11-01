/**
 * Where the browser keeps quick-buy keys: IndexedDB, which stores a
 * `CryptoKeyPair` as it is. The private key is created non-extractable, so
 * not even the page can read its bytes; it can only sign with it.
 */
const DB_NAME = 'solucky';
const STORE = 'session-keys';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, use: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = use(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

/** The quick-buy key saved under `id`, or `null`. */
export async function loadSessionKey(id: string): Promise<CryptoKeyPair | null> {
  const found = await withStore<CryptoKeyPair | undefined>('readonly', (store) => store.get(id));
  return found ?? null;
}

export async function saveSessionKey(id: string, keyPair: CryptoKeyPair): Promise<void> {
  await withStore('readwrite', (store) => store.put(keyPair, id));
}

export async function deleteSessionKey(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id));
}

/** One key per cluster, program and wallet. */
export function sessionKeyId(cluster: string, program: string, owner: string): string {
  return `${cluster}:${program}:${owner}`;
}
