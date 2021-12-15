import { formatTaxonDisplayName } from '$lib/formatUtils';
import { getDateRange, groupByMap } from '$lib/miscUtils';

export const fetchTaxaByName = (taxa, keyword) => {
  // find taxa whose common name or scientific name matches the keyword
  return new Promise((resolve, _reject) => {
    keyword = keyword.toLowerCase();
    let results = [];
    let uniqueIds = [];

    // search concatenated common names
    taxa.forEach((taxon) => {
      if (taxon.common_names) {
        let scientific_names = taxon.scientific_names.split('|');
        let taxon_ids = taxon.taxon_ids.split('|');
        let common_names = taxon.common_names.split('|');

        common_names.forEach((common_name, i) => {
          if (
            new RegExp('\\b' + keyword).test(common_name.toLowerCase()) &&
            !uniqueIds.includes(taxon_ids[i])
          ) {
            results.push({
              taxon_id: Number(taxon_ids[i]),
              common_name: common_names[i],
              scientific_name: scientific_names[i],
              count: taxon.count
            });
            uniqueIds.push(taxon_ids[i]);
          }
        });
      }
    });

    // search concatenated scientific names
    taxa.forEach((taxon) => {
      if (taxon.scientific_names) {
        let scientific_names = taxon.scientific_names.split('|');
        let taxon_ids = taxon.taxon_ids.split('|');
        let common_names = taxon.common_names.split('|');

        scientific_names.forEach((scientific_name, i) => {
          if (
            new RegExp('\\b' + keyword).test(scientific_name.toLowerCase()) &&
            !uniqueIds.includes(taxon_ids[i])
          ) {
            results.push({
              taxon_id: Number(taxon_ids[i]),
              common_name: common_names[i],
              scientific_name: scientific_names[i],
              count: taxon.count
            });
            uniqueIds.push(taxon_ids[i]);
          }
        });
      }
    });

    results.sort((a, b) => b.count - a.count);

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
  let results = observations
    .filter((o) => o.taxon_ids)
    .filter((o) => o.taxon_ids.split('|').includes('' + taxonId));

  return results.map((o) => {
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

export function sortObservations(observations, orderByValue, timeSpanValue) {
  let sortedObservations;
  let validObservations = [];
  let invalidObservations = [];
  observations.forEach((o) => {
    o.time_observed_at ? validObservations.push(o) : invalidObservations.push(o);
  });

  if (orderByValue === 'oldest') {
    if (timeSpanValue === 'month') {
      sortedObservations = validObservations.sort(sortObservationsOldestMonthFirst);
    } else {
      sortedObservations = validObservations.sort(sortObservationsOldestFirst);
    }
  } else {
    if (timeSpanValue === 'month') {
      sortedObservations = validObservations.sort(sortObservationsNewestMonthFirst);
    } else {
      sortedObservations = validObservations.sort(sortObservationsNewestFirst);
    }
  }

  if (invalidObservations.length > 0) {
    sortedObservations = sortedObservations.concat(invalidObservations);
  }
  return sortedObservations;
}

function logTime(message) {
  console.log(new Date().toUTCString(), message);
}

export function createGroupObservations(observations, timeSpanValue) {
  // use Map instead of Object because Map retains insertion order of the keys
  let groups = new Map();
  let validObservations = [];
  let invalidObservations = [];
  observations.forEach((o) => {
    o.time_observed_at ? validObservations.push(o) : invalidObservations.push(o);
  });

  if (timeSpanValue === 'month') {
    groups = groupByMap(
      validObservations.map((o) => {
        return { ...o, month: new Date(o.time_observed_at).getMonth() };
      }),
      'month'
    );
  } else if (timeSpanValue === 'year') {
    groups = groupByMap(
      validObservations.map((o) => {
        return { ...o, year: new Date(o.time_observed_at).getFullYear() };
      }),
      'year'
    );
  } else {
    return observations;
  }

  if (invalidObservations.length > 0) {
    groups.set('unknown', invalidObservations);
  }
  return groups;
}
