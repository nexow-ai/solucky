import { describe, expect, it } from 'vitest';

import { ticketWatcher } from '../app/utils/feed';

const t = (address: string) => ({ address });

describe('ticket watcher', () => {
  it('treats the tickets already there as the baseline', () => {
    const fresh = ticketWatcher();
    expect(fresh([t('a'), t('b')], 100)).toEqual([]);
  });

  it('returns each new ticket once', () => {
    const fresh = ticketWatcher();
    fresh([t('a')], 100);
    expect(fresh([t('a'), t('b')], 100)).toEqual([t('b')]);
    expect(fresh([t('a'), t('b')], 100)).toEqual([]);
    expect(fresh([t('a'), t('b'), t('c'), t('d')], 100)).toEqual([t('c'), t('d')]);
  });

  it('starts a new baseline on a new day', () => {
    const fresh = ticketWatcher();
    fresh([t('a')], 100);
    expect(fresh([t('x')], 101)).toEqual([]);
    expect(fresh([t('x'), t('y')], 101)).toEqual([t('y')]);
  });
});
