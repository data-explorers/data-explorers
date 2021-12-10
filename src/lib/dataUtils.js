import { formatTaxonDisplayName } from '$lib/formatUtils';
import { getDateRange, groupByMap } from '$lib/miscUtils';

export const fetchTaxaByName = (taxa, keyword) => {
  // find taxa whose common name or scientific name matches the keyword
  return new Promise((resolve, _reject) => {
    let results = [];
    // search by common name
    results = taxa.filter((taxon) => {
      if (taxon.common_name) {
        return taxon.common_name.toLowerCase().includes(keyword.toLowerCase());
      }
    });

    // search by scientific name
    if (results.length === 0) {
      results = taxa.filter((taxon) => {
        if (taxon.scientific_name) {
          return taxon.scientific_name.toLowerCase().includes(keyword.toLowerCase());
        }
      });
    }

    // create data for suggestion menu
    results = results.map((t) => {
      return {
        id: t.taxon_id,
        label: formatTaxonDisplayName(t)
      };
    });

    resolve(results);
  });
};

export const fecthObservationsByTaxonId = (observations, taxonId, color) => {
  // return all observations for a taxonId
  return observations
    .filter((o) => o.taxon_id === taxonId)
    .map((o) => {
      let dateObj = o.time_observed_at && new Date(o.time_observed_at);
      let month = o.time_observed_at ? dateObj.getMonth() : 'unknown';
      let year = o.time_observed_at ? dateObj.getFullYear() : 'unknown';

      return {
        ...o,
        month,
        year,
        color: color,
        fillColor: color
      };
    });
};

export function getObservationsDateRange(allObservations) {
  // return all dates between first and last observations
  let dates = allObservations
    .filter((o) => o.time_observed_at)
    .map((o) => o.time_observed_at)
    .sort();
  let firstDate = dates[0];
  let lastDate = dates[dates.length - 1];
  return getDateRange(firstDate, lastDate);
}

export function getDateSliderValues(availableDates) {
  return [0, availableDates.length - 1];
}

export function sortObservationsNewestFirst(a, b) {
  return new Date(b.time_observed_at) - new Date(a.time_observed_at);
}

export function sortObservationsOldestFirst(a, b) {
  return new Date(a.time_observed_at) - new Date(b.time_observed_at);
}

export function sortObservationsNewestMonthFirst(a, b) {
  return (
    new Date(b.time_observed_at).getMonth() - new Date(a.time_observed_at).getMonth() ||
    new Date(b.time_observed_at) - new Date(a.time_observed_at)
  );
}

export function sortObservationsOldestMonthFirst(a, b) {
  return (
    new Date(a.time_observed_at).getMonth() - new Date(b.time_observed_at).getMonth() ||
    new Date(a.time_observed_at) - new Date(b.time_observed_at)
  );
}

export function sortObservations(observations, orderByValue, groupByValue) {
  let validObservations = observations.filter((o) => o.time_observed_at);
  let invalidObservations = observations.filter((o) => !o.time_observed_at);
  let temp;

  if (orderByValue === 'oldest') {
    if (groupByValue === 'month') {
      temp = validObservations.sort(sortObservationsOldestMonthFirst);
    } else {
      temp = validObservations.sort(sortObservationsOldestFirst);
    }
  } else {
    if (groupByValue === 'month') {
      temp = validObservations.sort(sortObservationsNewestMonthFirst);
    } else {
      temp = validObservations.sort(sortObservationsNewestFirst);
    }
  }

  if (invalidObservations.length > 0) {
    temp = temp.concat(invalidObservations);
  }

  return temp;
}

export function createGroupObservations(observations, groupByValue) {
  // use Map instead of Object because Map retains insertion order of the keys
  let groups = new Map();
  let validObservations = observations.filter((o) => o.time_observed_at);

  if (groupByValue === 'month') {
    groups = groupByMap(
      validObservations.map((o) => {
        return { ...o, month: new Date(o.time_observed_at).getMonth() };
      }),
      'month'
    );
  } else if (groupByValue === 'year') {
    groups = groupByMap(
      validObservations.map((o) => {
        return { ...o, year: new Date(o.time_observed_at).getFullYear() };
      }),
      'year'
    );
  } else {
    return observations;
  }

  let invalidObservations = observations.filter((o) => !o.time_observed_at);
  if (invalidObservations.length > 0) {
    groups.set('unknown', invalidObservations);
  }
  return groups;
}
