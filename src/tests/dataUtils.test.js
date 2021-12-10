import {
  sortObservationsNewestFirst,
  sortObservationsOldestFirst,
  sortObservationsNewestMonthFirst,
  sortObservationsOldestMonthFirst,
  sortObservations,
  createGroupObservations
} from '$lib/dataUtils';

describe('sort dates', () => {
  let observations = [
    { time_observed_at: '2020-01-12' },
    { time_observed_at: '2019-02-12' },
    { time_observed_at: '2019-01-12' },
    { time_observed_at: '2020-02-02' },
    { time_observed_at: '2019-01-22' }
  ];

  let observations_null = [
    { time_observed_at: '2020-01-12' },
    { time_observed_at: '2019-02-12' },
    { time_observed_at: null },
    { time_observed_at: '2019-01-12' },
    { time_observed_at: '2020-02-02' },
    { time_observed_at: '2019-01-22' }
  ];

  describe('sortObservationsNewestFirst', () => {
    test('sorts observations by newest time_observed_at', () => {
      let expected = [
        { time_observed_at: '2020-02-02' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-01-12' }
      ];

      observations.sort(sortObservationsNewestFirst);

      expect(observations).toEqual(expected);
    });
  });

  describe('sortObservationsOldestFirst', () => {
    test('sorts observations by oldest time_observed_at', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2020-02-02' }
      ];

      observations.sort(sortObservationsOldestFirst);

      expect(observations).toEqual(expected);
    });
  });

  describe('sortObservationsNewestMonthFirst', () => {
    test('sorts observations by newest time_observed_at', () => {
      let expected = [
        { time_observed_at: '2020-02-02' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-01-12' }
      ];

      observations.sort(sortObservationsNewestMonthFirst);

      expect(observations).toEqual(expected);
    });
  });

  describe('sortObservationsOldestMonthFirst', () => {
    test('sorts observations by oldest time_observed_at', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-02-02' }
      ];

      observations.sort(sortObservationsOldestMonthFirst);

      expect(observations).toEqual(expected);
    });
  });

  describe('sortObservations', () => {
    test('sorts observations when orderBy = "oldest" & groupBy = "none"', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2020-02-02' }
      ];

      let results = sortObservations(observations, 'oldest', 'none');

      expect(results).toEqual(expected);
    });

    test('sorts observations when orderBy = "oldest" & groupBy = "year"', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2020-02-02' }
      ];

      let results = sortObservations(observations, 'oldest', 'year');

      expect(results).toEqual(expected);
    });

    test('sorts observations when orderBy = "oldest" & groupBy = "month"', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-02-02' }
      ];

      let results = sortObservations(observations, 'oldest', 'month');

      expect(results).toEqual(expected);
    });

    test('puts observations with null date at the end when orderBy = "oldest" & groupBy = "none"', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2020-02-02' },
        { time_observed_at: null }
      ];

      let results = sortObservations(observations_null, 'oldest', 'none');

      expect(results).toEqual(expected);
    });

    test('puts observations with null date at the end when orderBy = "oldest" & groupBy = "year"', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2020-02-02' },
        { time_observed_at: null }
      ];

      let results = sortObservations(observations_null, 'oldest', 'year');

      expect(results).toEqual(expected);
    });

    test('puts observations with null date at the end when orderBy = "oldest" & groupBy = "month"', () => {
      let expected = [
        { time_observed_at: '2019-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-02-02' },
        { time_observed_at: null }
      ];

      let results = sortObservations(observations_null, 'oldest', 'month');

      expect(results).toEqual(expected);
    });

    test('puts observations with null date at the end when orderBy = "newest" & groupBy = "none"', () => {
      let expected = [
        { time_observed_at: '2020-02-02' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-01-12' },
        { time_observed_at: null }
      ];

      let results = sortObservations(observations_null, 'newest', 'none');

      expect(results).toEqual(expected);
    });

    test('puts observations with null date at the end when orderBy = "newest" & groupBy = "year"', () => {
      let expected = [
        { time_observed_at: '2020-02-02' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-01-12' },
        { time_observed_at: null }
      ];

      let results = sortObservations(observations_null, 'newest', 'year');

      expect(results).toEqual(expected);
    });

    test('puts observations with null date at the end when orderBy = "newest" & groupBy = "month"', () => {
      let expected = [
        { time_observed_at: '2020-02-02' },
        { time_observed_at: '2019-02-12' },
        { time_observed_at: '2020-01-12' },
        { time_observed_at: '2019-01-22' },
        { time_observed_at: '2019-01-12' },
        { time_observed_at: null }
      ];

      let results = sortObservations(observations_null, 'newest', 'month');

      expect(results).toEqual(expected);
    });
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
    { time_observed_at: null },
    { time_observed_at: '2020-02-02' },
    { time_observed_at: '2021-03-13' }
  ];

  test('group observations by month when groupByValue is "month"', () => {
    let expected = new Map();
    expected.set(1, [
      { month: 1, time_observed_at: '2021-02-12' },
      { month: 1, time_observed_at: '2020-02-02' }
    ]);
    expected.set(2, [
      { month: 2, time_observed_at: '2020-03-03' },
      { month: 2, time_observed_at: '2021-03-13' }
    ]);

    let results = createGroupObservations(observations, 'month');

    expect(results).toEqual(expected);
  });

  test('puts observations with null date at the end when groupByValue is "month"', () => {
    let expected = new Map();
    expected.set(1, [
      { month: 1, time_observed_at: '2021-02-12' },
      { month: 1, time_observed_at: '2020-02-02' }
    ]);
    expected.set(2, [
      { month: 2, time_observed_at: '2020-03-03' },
      { month: 2, time_observed_at: '2021-03-13' }
    ]);
    expected.set('unknown', [{ time_observed_at: null }]);

    let results = createGroupObservations(observations_without_date, 'month');

    expect(results).toEqual(expected);
  });

  test('group observations by year when groupByValue when "year"', () => {
    let expected = new Map();
    expected.set(2020, [
      { year: 2020, time_observed_at: '2020-03-03' },
      { year: 2020, time_observed_at: '2020-02-02' }
    ]);
    expected.set(2021, [
      { year: 2021, time_observed_at: '2021-02-12' },
      { year: 2021, time_observed_at: '2021-03-13' }
    ]);

    let results = createGroupObservations(observations, 'year');

    expect(results).toEqual(expected);
  });

  test('puts observations with null date at the end when groupByValue when "year"', () => {
    let expected = new Map();
    expected.set(2020, [
      { year: 2020, time_observed_at: '2020-03-03' },
      { year: 2020, time_observed_at: '2020-02-02' }
    ]);
    expected.set(2021, [
      { year: 2021, time_observed_at: '2021-02-12' },
      { year: 2021, time_observed_at: '2021-03-13' }
    ]);
    expected.set('unknown', [{ time_observed_at: null }]);

    let results = createGroupObservations(observations_without_date, 'year');

    expect(results).toEqual(expected);
  });
});

describe('sorts and groups observations', () => {
  let rawObservations = [
    { time_observed_at: '2020-01-12' },
    { time_observed_at: '2019-02-12' },
    { time_observed_at: null },
    { time_observed_at: '2019-01-12' },
    { time_observed_at: '2020-02-02' },
    { time_observed_at: '2019-01-22' }
  ];

  test('returns observations when groupBy = "none" & orderBy = "newest"', () => {
    let groupByValue = 'none';
    let orderByValue = 'newest';
    let expected = [
      { time_observed_at: '2020-02-02' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2019-02-12' },
      { time_observed_at: '2019-01-22' },
      { time_observed_at: '2019-01-12' },
      { time_observed_at: null }
    ];

    let observations = sortObservations(rawObservations, orderByValue, groupByValue);
    let groupedObservations = createGroupObservations(observations, groupByValue);

    expect(groupedObservations).toEqual(expected);
  });

  test('returns observations when groupBy = "year" & orderBy = "newest"', () => {
    let groupByValue = 'year';
    let orderByValue = 'newest';
    let expected = new Map();
    expected.set(2020, [
      { year: 2020, time_observed_at: '2020-02-02' },
      { year: 2020, time_observed_at: '2020-01-12' }
    ]);
    expected.set(2019, [
      { year: 2019, time_observed_at: '2019-02-12' },
      { year: 2019, time_observed_at: '2019-01-22' },
      { year: 2019, time_observed_at: '2019-01-12' }
    ]);
    expected.set('unknown', [{ time_observed_at: null }]);

    let observations = sortObservations(rawObservations, orderByValue, groupByValue);
    let groupedObservations = createGroupObservations(observations, groupByValue);

    expect(groupedObservations).toEqual(expected);
  });

  test('returns observations when groupBy = "month" & orderBy = "newest"', () => {
    let groupByValue = 'month';
    let orderByValue = 'newest';
    let expected = new Map();
    expected.set(1, [
      { month: 1, time_observed_at: '2020-02-02' },
      { month: 1, time_observed_at: '2019-02-12' }
    ]);
    expected.set(0, [
      { month: 0, time_observed_at: '2020-01-12' },
      { month: 0, time_observed_at: '2019-01-22' },
      { month: 0, time_observed_at: '2019-01-12' }
    ]);
    expected.set('unknown', [{ time_observed_at: null }]);

    let observations = sortObservations(rawObservations, orderByValue, groupByValue);
    let groupedObservations = createGroupObservations(observations, groupByValue);

    expect(groupedObservations).toEqual(expected);
  });

  test('returns observations when groupBy = "none" & orderBy = "oldest"', () => {
    let groupByValue = 'none';
    let orderByValue = 'oldest';
    let expected = [
      { time_observed_at: '2019-01-12' },
      { time_observed_at: '2019-01-22' },
      { time_observed_at: '2019-02-12' },
      { time_observed_at: '2020-01-12' },
      { time_observed_at: '2020-02-02' },
      { time_observed_at: null }
    ];

    let observations = sortObservations(rawObservations, orderByValue, groupByValue);
    let groupedObservations = createGroupObservations(observations, groupByValue);

    expect(groupedObservations).toEqual(expected);
  });

  test('returns observations when groupBy = "year" & orderBy = "oldest"', () => {
    let groupByValue = 'year';
    let orderByValue = 'oldest';
    let expected = new Map();
    expected.set(2019, [
      { year: 2019, time_observed_at: '2019-01-12' },
      { year: 2019, time_observed_at: '2019-01-22' },
      { year: 2019, time_observed_at: '2019-02-12' }
    ]);
    expected.set(2020, [
      { year: 2020, time_observed_at: '2020-01-12' },
      { year: 2020, time_observed_at: '2020-02-02' }
    ]);
    expected.set('unknown', [{ time_observed_at: null }]);

    let observations = sortObservations(rawObservations, orderByValue, groupByValue);
    let groupedObservations = createGroupObservations(observations, groupByValue);

    expect(groupedObservations).toEqual(expected);
  });

  test('returns observations when groupBy = "month" & orderBy = "oldest"', () => {
    let groupByValue = 'month';
    let orderByValue = 'oldest';
    let expected = new Map();
    expected.set(0, [
      { month: 0, time_observed_at: '2019-01-12' },
      { month: 0, time_observed_at: '2019-01-22' },
      { month: 0, time_observed_at: '2020-01-12' }
    ]);
    expected.set(1, [
      { month: 1, time_observed_at: '2019-02-12' },
      { month: 1, time_observed_at: '2020-02-02' }
    ]);
    expected.set('unknown', [{ time_observed_at: null }]);

    let observations = sortObservations(rawObservations, orderByValue, groupByValue);
    let groupedObservations = createGroupObservations(observations, groupByValue);

    expect(groupedObservations).toEqual(expected);
  });
});
