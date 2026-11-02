import { describe, expect, it } from 'vitest';

import { formatNumber } from '../app/utils/format';
import { searchTickets, type TicketFields } from '../app/utils/ticketSearch';

const tickets: TicketFields[] = [
  { number: 1234, owner: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', country: 'Spain' },
  { number: 12, owner: 'GC81aQ2bWgq8p7y5AbXk4RrJvNfhA3ksdT9uLmZcPeQx', country: 'Côte d’Ivoire' },
  { number: 41234, owner: '2BksWnYq3Hj8Tr6fUu1PLw9eCzKmVaD4ogxRbNiS5EtF', country: 'Private' },
  { number: 120, owner: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', country: 'Japan' },
  { number: 7, owner: 'JCupkDLWkQtsqMJe1Hd3vbLxWyGTn5aH7rRXo2iNcB8s', country: 'Spain' },
];
const numbers = (query: string) => searchTickets(tickets, query, (t) => t).map((t) => t.number);

describe('searchTickets', () => {
  it('finds everything for an empty query', () => {
    expect(numbers('')).toEqual([1234, 12, 41234, 120, 7]);
    expect(numbers('   ')).toEqual([1234, 12, 41234, 120, 7]);
  });

  it('finds the numbers that start with the digits, the exact one first', () => {
    expect(numbers('12')).toEqual([12, 1234, 120]);
    expect(numbers('1234')).toEqual([1234]);
    expect(numbers('99')).toEqual([]);
  });

  it('reads group separators, leading zeros and other scripts’ digits', () => {
    expect(numbers('1,234')).toEqual([1234]);
    expect(numbers('1 234')).toEqual([1234]);
    expect(numbers(formatNumber(1234))).toEqual([1234]);
    expect(numbers('41.234')).toEqual([41234]);
    expect(numbers('007')).toEqual([7]);
    expect(numbers('١٢٠')).toEqual([120]);
    expect(numbers('१२')).toEqual([12, 1234, 120]);
    expect(numbers('４１')).toEqual([41234]);
  });

  it('finds wallets by any part of the address, in any case', () => {
    expect(numbers('7xKX')).toEqual([1234]);
    expect(numbers('gc81a')).toEqual([12]);
    expect(numbers('NcB8s')).toEqual([7]);
  });

  it('finds countries by name, without accents', () => {
    expect(numbers('spain')).toEqual([1234, 7]);
    expect(numbers("cote d'ivoire")).toEqual([12]);
    expect(numbers('PRIV')).toEqual([41234]);
  });

  it('keeps the original order and does not change the list', () => {
    const copy = [...tickets];
    expect(searchTickets(tickets, 'a', (t) => t)).not.toBe(tickets);
    expect(tickets).toEqual(copy);
  });
});
