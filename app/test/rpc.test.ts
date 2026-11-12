import { describe, expect, it } from 'vitest';

import { isRpcCall } from '../server/utils/rpc';

const program = 'JCupk8SMKzCzApb7LbW3LHryrj7ZN9i1sGo6w2cSQLdF';
const call = (method: string, params: unknown[] = []) => ({ jsonrpc: '2.0', id: 1, method, params });

describe('RPC proxy', () => {
  it('forwards the calls the app makes', () => {
    for (const method of ['getAccountInfo', 'getMultipleAccounts', 'getLatestBlockhash', 'sendTransaction']) {
      expect(isRpcCall(call(method), program)).toBe(true);
    }
    expect(isRpcCall(call('simulateTransaction', ['AQ==', { encoding: 'base64' }]), program)).toBe(true);
  });

  it('scans only the program’s own accounts', () => {
    expect(isRpcCall(call('getProgramAccounts', [program, { encoding: 'base64' }]), program)).toBe(true);
    expect(isRpcCall(call('getProgramAccounts', ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA']), program)).toBe(false);
    expect(isRpcCall(call('getProgramAccounts'), program)).toBe(false);
  });

  it('refuses everything else', () => {
    expect(isRpcCall(call('requestAirdrop'), program)).toBe(false);
    expect(isRpcCall(call('getBlock', [1]), program)).toBe(false);
    expect(isRpcCall({ method: 'getSlot' }, program)).toBe(false);
    expect(isRpcCall(null, program)).toBe(false);
  });
});
