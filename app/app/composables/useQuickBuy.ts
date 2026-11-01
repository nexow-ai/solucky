import { type Address, createSignerFromKeyPair, generateKeyPair, type KeyPairSigner } from '@solana/kit';
import {
  fetchMaybeSession,
  findSessionPda,
  getCloseSessionInstructionAsync,
  getOpenSessionInstructionAsync,
  getSessionSize,
  getTransferSolInstruction,
  sessionBudget,
} from '@solucky/client';

import { deleteSessionKey, loadSessionKey, saveSessionKey, sessionKeyId } from '../utils/keyStore';
import { sendInstructionSets } from '../utils/walletSend';

/** What the quick-buy key holds for network fees: ◎0.01, a few thousand purchases. */
export const KEY_FLOAT = 10_000_000n;
/**
 * Below this, the key could not open a new round: it fronts the round's rent
 * (◎0.0025) until the session pays it back in the same transaction.
 */
export const KEY_LOW = 4_000_000n;
/** The network fee of a transaction with one signature and no priority fee. */
const BASE_FEE = 5_000n;

export interface QuickSession {
  address: Address;
  delegate: Address;
  /** Cluster time, in milliseconds. */
  expiresAt: number;
  lamports: bigint;
}

const key = shallowRef<KeyPairSigner | null>(null);
const session = shallowRef<QuickSession | null>(null);
const keyLamports = ref<bigint | null>(null);
const sessionRent = ref<bigint | null>(null);
/** False when this browser cannot keep a key (no IndexedDB or no Ed25519 in WebCrypto). */
const supported = ref(true);
let loadedFor: string | null = null;
let started = false;

/**
 * Quick buy: one wallet approval opens a session with a budget for a key
 * this browser keeps, and that key then buys tickets for the wallet with no
 * prompt. The program lets the key spend the budget only on tickets owned by
 * the wallet, and closing the session sends everything back to the wallet.
 */
export function useQuickBuy() {
  const { client, cluster, programAddress } = useSolana();
  const { address: wallet, refreshBalance } = useWallet();
  const { run } = useTransaction();
  const { t } = useI18n();
  const now = useNow();

  const keyId = (owner: Address) => sessionKeyId(cluster, programAddress, owner);

  async function refresh() {
    const owner = wallet.value;
    if (!owner) {
      loadedFor = null;
      key.value = null;
      session.value = null;
      keyLamports.value = null;
      return;
    }
    if (loadedFor !== owner) {
      loadedFor = owner;
      key.value = null;
      try {
        const pair = await loadSessionKey(keyId(owner));
        if (wallet.value !== owner) return;
        key.value = pair ? await createSignerFromKeyPair(pair) : null;
      } catch {
        supported.value = false;
      }
    }
    const [address] = await findSessionPda({ owner }, { programAddress });
    const signer = key.value;
    const [account, rent, balance] = await Promise.all([
      fetchMaybeSession(client.rpc, address, { commitment: 'confirmed' }),
      sessionRent.value ?? client.rpc.getMinimumBalanceForRentExemption(BigInt(getSessionSize())).send(),
      signer ? client.rpc.getBalance(signer.address, { commitment: 'confirmed' }).send() : null,
    ]);
    // The player switched wallets meanwhile: that wallet's refresh is the one to keep.
    if (wallet.value !== owner) return;
    sessionRent.value = rent;
    session.value = account.exists
      ? {
          address,
          delegate: account.data.delegate,
          expiresAt: Number(account.data.expiresAt) * 1000,
          lamports: account.lamports,
        }
      : null;
    keyLamports.value = balance?.value ?? null;
  }

  if (import.meta.client && !started) {
    started = true;
    effectScope(true).run(() => {
      watch(wallet, () => void refresh().catch(() => {}), { immediate: true });
    });
    setInterval(() => {
      if (document.visibilityState !== 'hidden' && wallet.value) void refresh().catch(() => {});
    }, 30_000);
  }

  /** The session belongs to this browser's key. */
  const mine = computed(() => !!session.value && !!key.value && session.value.delegate === key.value.address);
  const expired = computed(() => !!session.value && session.value.expiresAt <= now.value);
  const budget = computed(() =>
    session.value && sessionRent.value !== null ? sessionBudget(session.value.lamports, sessionRent.value) : 0n,
  );
  const active = computed(() => mine.value && !expired.value);
  /** A session another browser's key holds (or a key this browser lost). */
  const elsewhere = computed(() => !!session.value && !mine.value);
  const keyLow = computed(() => keyLamports.value === null || keyLamports.value < KEY_LOW);
  /** Fees left in this browser's key while it holds no session: returnable. */
  const stranded = computed(() =>
    !mine.value && keyLamports.value !== null && keyLamports.value > 2n * BASE_FEE ? keyLamports.value : null,
  );

  /** Whether quick buy can pay `cost` (lamports the session spends) right now. */
  function covers(cost: bigint | null): boolean {
    return active.value && !keyLow.value && cost !== null && budget.value >= cost;
  }

  async function ensureKey(owner: Address): Promise<KeyPairSigner> {
    if (key.value) return key.value;
    // Non-extractable: the page can sign with it, never read it.
    const pair = await generateKeyPair();
    await saveSessionKey(keyId(owner), pair);
    key.value = await createSignerFromKeyPair(pair);
    return key.value;
  }

  /**
   * Opens quick buy for `days`, or renews it, adds `deposit` to its budget,
   * or moves it to this browser: one wallet prompt. Tops up the key's fee
   * float when it runs low.
   */
  async function open(deposit: bigint, days: number | null) {
    const owner = wallet.value;
    if (!owner) return null;
    let signer: KeyPairSigner;
    try {
      signer = await ensureKey(owner);
    } catch {
      supported.value = false;
      return null;
    }
    // A minute short of the end the player chose, as the cluster's clock may run ahead of ours.
    const nowSeconds = Math.floor(now.value / 1000);
    const keep = session.value && session.value.expiresAt > now.value + 60_000;
    const expiresAt =
      days === null && keep ? Math.floor(session.value!.expiresAt / 1000) : nowSeconds + (days ?? 7) * 86_400 - 60;
    const sig = await run(
      deposit > 0n ? t('quick.funding', { sol: formatSol(deposit) }) : t('quick.opening'),
      async (config) => {
        const { value: balance } = await client.rpc.getBalance(signer.address, { commitment: 'confirmed' }).send();
        const instructions = [
          await getOpenSessionInstructionAsync(
            { owner: client.payer, delegate: signer.address, expiresAt, deposit },
            { programAddress },
          ),
          ...(balance < KEY_FLOAT / 2n
            ? [
                getTransferSolInstruction({
                  source: client.payer,
                  destination: signer.address,
                  amount: KEY_FLOAT - balance,
                }),
              ]
            : []),
        ];
        return client.sendTransaction(instructions, config);
      },
      t('quick.on'),
    );
    await Promise.all([refresh(), refreshBalance()]).catch(() => {});
    return sig;
  }

  /**
   * Ends quick buy and sends everything back to the wallet: the budget, the
   * session's rent and the key's fee float. This browser's key ends it with
   * no prompt; a session another browser holds needs the wallet.
   */
  async function close() {
    const owner = wallet.value;
    if (!owner || !session.value) return null;
    const signer = key.value;
    let sig: string | null;
    if (signer && mine.value) {
      sig = await run(
        t('quick.closing'),
        async (config) => {
          const { value: balance } = await client.rpc.getBalance(signer.address, { commitment: 'confirmed' }).send();
          const instructions = [
            await getCloseSessionInstructionAsync({ authority: signer, owner }, { programAddress }),
            ...(balance > 2n * BASE_FEE
              ? [getTransferSolInstruction({ source: signer, destination: owner, amount: balance - BASE_FEE })]
              : []),
          ];
          const [signature] = await sendInstructionSets(client.rpc, signer, [instructions], {
            abortSignal: config.abortSignal,
            route: 'app',
          });
          return { context: { signature: signature! } };
        },
        t('quick.off'),
        undefined,
        t('quick.noPrompt'),
      );
    } else {
      sig = await run(
        t('quick.closing'),
        async (config) =>
          client.sendTransaction(
            [await getCloseSessionInstructionAsync({ authority: client.payer, owner }, { programAddress })],
            config,
          ),
        t('quick.off'),
      );
    }
    if (sig && signer && mine.value) await forgetKey(owner);
    await Promise.all([refresh(), refreshBalance()]).catch(() => {});
    return sig;
  }

  /** Sends the fees a key without a session still holds back to the wallet, and forgets the key. */
  async function returnFloat() {
    const owner = wallet.value;
    const signer = key.value;
    if (!owner || !signer || mine.value) return null;
    const sig = await run(
      t('quick.returning'),
      async (config) => {
        const { value: balance } = await client.rpc.getBalance(signer.address, { commitment: 'confirmed' }).send();
        const [signature] = await sendInstructionSets(
          client.rpc,
          signer,
          [[getTransferSolInstruction({ source: signer, destination: owner, amount: balance - BASE_FEE })]],
          { abortSignal: config.abortSignal, route: 'app' },
        );
        return { context: { signature: signature! } };
      },
      t('quick.returned'),
      undefined,
      t('quick.noPrompt'),
    );
    if (sig) await forgetKey(owner);
    await Promise.all([refresh(), refreshBalance()]).catch(() => {});
    return sig;
  }

  async function forgetKey(owner: Address) {
    await deleteSessionKey(keyId(owner)).catch(() => {});
    key.value = null;
    keyLamports.value = null;
  }

  return {
    supported: computed(() => supported.value),
    key: computed(() => key.value),
    session: computed(() => session.value),
    sessionRent: computed(() => sessionRent.value),
    keyLamports: computed(() => keyLamports.value),
    mine,
    expired,
    active,
    elsewhere,
    budget,
    keyLow,
    stranded,
    covers,
    refresh,
    open,
    close,
    returnFloat,
  };
}
