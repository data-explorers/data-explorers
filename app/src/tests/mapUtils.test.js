import { getMonthName } from '$lib/mapUtils';

describe('getMonthName', () => {
  test('returns the short month name for a given Date object month', () => {
    expect(getMonthName(0)).toEqual('Jan');
    expect(getMonthName(1)).toEqual('Feb');
    expect(getMonthName(11)).toEqual('Dec');
    expect(getMonthName(12)).toEqual('Jan');
  });

  test('returns the short month name string integers', () => {
    expect(getMonthName('0')).toEqual('Jan');
    expect(getMonthName('12')).toEqual('Jan');
  });

  test('returns the short month name for decimal with zero', () => {
    expect(getMonthName(0.0)).toEqual('Jan');
    expect(getMonthName(12.0)).toEqual('Jan');
  });

  test('returns original value for invalid Date object month', () => {
    expect(getMonthName('bad')).toEqual('bad');
    expect(getMonthName('0 bad')).toEqual('0 bad');
    expect(getMonthName('0.0 bad')).toEqual('0.0 bad');
    expect(getMonthName(0.1)).toEqual(0.1);
    expect(getMonthName('0.0')).toEqual('0.0');
  });
});
