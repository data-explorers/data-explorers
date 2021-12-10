import {
  sortObservationsNewestFirst,
  sortObservationsOldestFirst,
  sortObservations,
  createGroupObservations,
  range,
  setObservationsAndKeys
} from '$lib/dataUtils';

describe('sortObservationsNewestFirst', () => {
  test('sorts observations by newest time_observed_at', () => {
    let observations = [
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-22' }
    ];
    let expected = [
      { time_observed_at: '2020-01-22' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-02' }
    ];

    observations.sort(sortObservationsNewestFirst);

    expect(observations).toEqual(expected);
  });
});

describe('sortObservationsOldestFirst', () => {
  test('sorts observations by oldest time_observed_at', () => {
    let observations = [
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-22' }
    ];
    let expected = [
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-22' }
    ];

    observations.sort(sortObservationsOldestFirst);

    expect(observations).toEqual(expected);
  });
});

describe('sortObservations', () => {
  test('sorts observations by oldest if orderByValue = "oldest"', () => {
    let observations = [
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-22' }
    ];
    let expected = [
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-22' }
    ];

    let results = sortObservations(observations, 'oldest');

    expect(results).toEqual(expected);
  });

  test('puts observations without time_observed_at at the end if orderByValue = "oldest"', () => {
    let observations = [
      { time_observed_at: '2020-01-12' },
      { time_observed_at: undefined },
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-22' }
    ];
    let expected = [
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-22' },
      { time_observed_at: undefined }
    ];

    let results = sortObservations(observations, 'oldest');

    expect(results).toEqual(expected);
  });

  test('sorts observations by newest if orderByValue = "newest"', () => {
    let observations = [
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-22' }
    ];
    let expected = [
      { time_observed_at: '2020-01-22' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-02' }
    ];

    let results = sortObservations(observations, 'newest');

    expect(results).toEqual(expected);
  });

  test('puts observations without time_observed_at at the end if orderByValue = "newest"', () => {
    let observations = [
      { time_observed_at: '2020-01-12' },
      { time_observed_at: undefined },
      { time_observed_at: '2020-01-02' },
      { time_observed_at: '2020-01-22' }
    ];
    let expected = [
      { time_observed_at: '2020-01-22' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-01-02' },
      { time_observed_at: undefined }
    ];

    let results = sortObservations(observations, 'newest');

    expect(results).toEqual(expected);
  });
});

describe('createGroupObservations', () => {
  let observations = [
    { time_observed_at: '2020-03-03' },
    { time_observed_at: '2021-02-12' },
    { time_observed_at: '2020-02-02' },
    { time_observed_at: '2021-03-13' }
  ];

  let observations_without_date = [
    { time_observed_at: '2020-03-03' },
    { time_observed_at: '2021-02-12' },
    { time_observed_at: undefined },
    { time_observed_at: '2020-02-02' },
    { time_observed_at: '2021-03-13' }
  ];

  test('group observations by month if groupByValue is "month"', () => {
    let expected = {
      1: [{ time_observed_at: '2021-02-12' }, { time_observed_at: '2020-02-02' }],
      2: [{ time_observed_at: '2020-03-03' }, { time_observed_at: '2021-03-13' }]
    };

    let results = createGroupObservations(observations, 'month');

    expect(results).toEqual(expected);
  });

  test('puts observations without time_observed_at at the end  if groupByValue is "month"', () => {
    let expected = {
      1: [{ time_observed_at: '2021-02-12' }, { time_observed_at: '2020-02-02' }],
      2: [{ time_observed_at: '2020-03-03' }, { time_observed_at: '2021-03-13' }],
      unknown: [{ time_observed_at: undefined }]
    };

    let results = createGroupObservations(observations_without_date, 'month');

    expect(results).toEqual(expected);
  });

  test('group observations by year if groupByValue is "year"', () => {
    let expected = {
      2020: [{ time_observed_at: '2020-03-03' }, { time_observed_at: '2020-02-02' }],
      2021: [{ time_observed_at: '2021-02-12' }, { time_observed_at: '2021-03-13' }]
    };

    let results = createGroupObservations(observations, 'year');

    expect(results).toEqual(expected);
  });

  test('puts observations without time_observed_at at the end if groupByValue is "year"', () => {
    let expected = {
      2020: [{ time_observed_at: '2020-03-03' }, { time_observed_at: '2020-02-02' }],
      2021: [{ time_observed_at: '2021-02-12' }, { time_observed_at: '2021-03-13' }],
      unknown: [{ time_observed_at: undefined }]
    };

    let results = createGroupObservations(observations_without_date, 'year');

    expect(results).toEqual(expected);
  });
});

describe('sorts and groups observations', () => {
  let rawObservations = [
    { time_observed_at: '2020-03-03' },
    { time_observed_at: '2021-02-12' },
    { time_observed_at: undefined },
    { time_observed_at: '2020-02-02' },
    { time_observed_at: '2021-03-13' }
  ];

  test('returns observations and keys when none groupBy and newest orderBy', () => {
    let groupByValue = 'none';
    let orderByValue = 'newest';
    let expected = [
      { time_observed_at: '2021-03-13' },
      { time_observed_at: '2021-02-12' },
      { time_observed_at: '2020-03-03' },
      { time_observed_at: '2020-02-02' },
      { time_observed_at: undefined }
    ];

    let observations = sortObservations(rawObservations, orderByValue);
    let { groupByKeys, observationsDisplay } = setObservationsAndKeys(
      observations,
      orderByValue,
      groupByValue
    );

    expect(groupByKeys).toEqual([]);
    expect(observationsDisplay).toEqual(expected);
  });

  test('returns observations and keys when none groupBy and oldest orderBy', () => {
    let groupByValue = 'none';
    let orderByValue = 'oldest';
    let expected = [
      { time_observed_at: '2020-02-02' },
      { time_observed_at: '2020-03-03' },
      { time_observed_at: '2021-02-12' },
      { time_observed_at: '2021-03-13' },
      { time_observed_at: undefined }
    ];

    let observations = sortObservations(rawObservations, orderByValue);
    let { groupByKeys, observationsDisplay } = setObservationsAndKeys(
      observations,
      orderByValue,
      groupByValue
    );

    expect(groupByKeys).toEqual([]);
    expect(observationsDisplay).toEqual(expected);
  });

  test('returns observations and keys when month groupBy and newest orderBy', () => {
    let groupByValue = 'month';
    let orderByValue = 'newest';
    let expected = [
      [{ time_observed_at: '2021-03-13' }, { time_observed_at: '2020-03-03' }],
      [{ time_observed_at: '2021-02-12' }, { time_observed_at: '2020-02-02' }],
      [{ time_observed_at: undefined }]
    ];

    let observations = sortObservations(rawObservations, orderByValue);
    let { groupByKeys, observationsDisplay } = setObservationsAndKeys(
      observations,
      orderByValue,
      groupByValue
    );

    expect(groupByKeys).toEqual(['2', '1', 'unknown']);
    expect(observationsDisplay).toEqual(expected);
  });

  test('returns observations and keys when month groupBy and oldest orderBy', () => {
    let groupByValue = 'month';
    let orderByValue = 'oldest';
    let expected = [
      [{ time_observed_at: '2020-02-02' }, { time_observed_at: '2021-02-12' }],
      [{ time_observed_at: '2020-03-03' }, { time_observed_at: '2021-03-13' }],
      [{ time_observed_at: undefined }]
    ];

    let observations = sortObservations(rawObservations, orderByValue);
    let { groupByKeys, observationsDisplay } = setObservationsAndKeys(
      observations,
      orderByValue,
      groupByValue
    );

    expect(groupByKeys).toEqual(['1', '2', 'unknown']);
    expect(observationsDisplay).toEqual(expected);
  });

  test('returns observations and keys when year groupBy and oldest orderBy', () => {
    let groupByValue = 'year';
    let orderByValue = 'oldest';
    let expected = [
      [{ time_observed_at: '2020-02-02' }, { time_observed_at: '2020-03-03' }],
      [{ time_observed_at: '2021-02-12' }, { time_observed_at: '2021-03-13' }],
      [{ time_observed_at: undefined }]
    ];

    let observations = sortObservations(rawObservations, orderByValue);
    let { groupByKeys, observationsDisplay } = setObservationsAndKeys(
      observations,
      orderByValue,
      groupByValue
    );

    expect(groupByKeys).toEqual(['2020', '2021', 'unknown']);
    expect(observationsDisplay).toEqual(expected);
  });

  test('returns observations and keys when year groupBy and newest orderBy', () => {
    let groupByValue = 'year';
    let orderByValue = 'newest';
    let expected = [
      [{ time_observed_at: '2021-03-13' }, { time_observed_at: '2021-02-12' }],
      [{ time_observed_at: '2020-03-03' }, { time_observed_at: '2020-02-02' }],

      [{ time_observed_at: undefined }]
    ];

    let observations = sortObservations(rawObservations, orderByValue);
    let { groupByKeys, observationsDisplay } = setObservationsAndKeys(
      observations,
      orderByValue,
      groupByValue
    );

    expect(groupByKeys).toEqual(['2021', '2020', 'unknown']);
    expect(observationsDisplay).toEqual(expected);
  });
});

describe('range', () => {
  test('returns array of integers from first value to second value when given 2 integers', () => {
    expect(range(0, 3)).toEqual([0, 1, 2, 3]);
    expect(range(1, 3)).toEqual([1, 2, 3]);
  });

  test('returns array of integers from zero to first value when given one integer', () => {
    expect(range(3)).toEqual([0, 1, 2, 3]);
  });
});
