import { range, convertObjectsToMap } from '$lib/miscUtils';

describe('range', () => {
  test('returns array of integers from first value to second value when given 2 integers', () => {
    expect(range(0, 3)).toEqual([0, 1, 2, 3]);
    expect(range(1, 3)).toEqual([1, 2, 3]);
  });

  test('returns array of integers from zero to first value when given one integer', () => {
    expect(range(3)).toEqual([0, 1, 2, 3]);
  });
});

describe('convertObjectsToMap', () => {
  test('returns a map with objects grouped by a given object key', () => {
    let objects = [
      { a: 2, b: 'a' },
      { a: 3, b: 'b' },
      { a: 2, b: 'c' },
      { a: 1, b: 'd' }
    ];
    let expected = new Map();
    expected.set(2, [
      { a: 2, b: 'a' },
      { a: 2, b: 'c' }
    ]);
    expected.set(3, [{ a: 3, b: 'b' }]);
    expected.set(1, [{ a: 1, b: 'd' }]);

    let results = convertObjectsToMap(objects, 'a');

    expect(results).toEqual(expected);

    let iterator = results.keys();
    expect(iterator.next().value).toEqual(2);
    expect(iterator.next().value).toEqual(3);
    expect(iterator.next().value).toEqual(1);
  });
});
