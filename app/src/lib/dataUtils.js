import { formatTaxonDisplayName } from '$lib/formatUtils';
import { getDateRange, convertObjectsToMap } from '$lib/miscUtils';
import { speciesRanks } from '$lib/data/constants';
export const fetchTaxaByName = (taxa, keyword) => {
  // find taxa whose common name or scientific name matches the keyword
  return new Promise((resolve, _reject) => {
    keyword = keyword.toLowerCase();
    let results = [];
    let selectedIds = [];

    // search common names
    taxa.forEach((taxon) => {
      if (taxon.common_name) {
        if (
          new RegExp('\\b' + keyword).test(taxon.common_name.toLowerCase()) &&
          !selectedIds.includes(taxon.taxon_id)
        ) {
          results.push({
            taxon_id: Number(taxon.taxon_id),
            common_name: taxon.common_name,
            scientific_name: taxon.scientific_name,
            taxa_count: taxon.taxa_count,
            image_url: taxon.image_url,
            rank: taxon.rank
          });
          selectedIds.push(taxon.taxon_id);
        }
      }
    });

    // search scientific names
    taxa.forEach((taxon) => {
      if (taxon.scientific_name) {
        if (
          new RegExp('\\b' + keyword).test(taxon.scientific_name.toLowerCase()) &&
          !selectedIds.includes(taxon.taxon_id)
        ) {
          results.push({
            taxon_id: Number(taxon.taxon_id),
            common_name: taxon.common_name,
            scientific_name: taxon.scientific_name,
            taxa_count: taxon.taxa_count,
            image_url: taxon.image_url
          });
          selectedIds.push(taxon.taxon_id);
        }
      }
    });

    results.sort(
      (a, b) => b.observations_count - a.observations_count || b.taxa_count - a.taxa_count
    );

    // create data for suggestion menu
    results = results.map((taxon) => {
      return {
        ...taxon,
        label: formatTaxonDisplayName(taxon)
      };
    });

    resolve(results);
  });
};

export const fetchObservationsByTaxonId = (observations, taxonId, color) => {
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

export function logTime(message) {
  console.log(new Date().toUTCString(), message);
}

export function groupObservationsbyTime(observations, timeSpanValue) {
  // groups an array of observations by time period.
  // use Map instead of Object because Map retains insertion order of the keys
  let groups = new Map();
  let validObservations = [];
  let invalidObservations = [];
  observations.forEach((o) => {
    o.time_observed_at ? validObservations.push(o) : invalidObservations.push(o);
  });

  if (timeSpanValue === 'month') {
    groups = convertObjectsToMap(
      validObservations.map((o) => {
        return { ...o, month: new Date(o.time_observed_at).getMonth() };
      }),
      'month'
    );
  } else if (timeSpanValue === 'year') {
    groups = convertObjectsToMap(
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

export function countObservations(observations) {
  if (Array.isArray(observations)) {
    return new Set(observations.map((o) => o['id'])).size;
  } else {
    let uniqueIds = new Set();
    observations.forEach((values, key) => {
      values.forEach((o) => uniqueIds.add(o['id']));
    });
    return uniqueIds.size;
  }
}

export function countSpecies(observations, limitToSpecies = false) {
  return getSpecies(observations, limitToSpecies).length;
}

export function getSpecies(observations, limitToSpecies = false) {
  if (Array.isArray(observations)) {
    let uniqueTaxa = {};
    if (limitToSpecies) {
      observations = observations.filter((o) => speciesRanks.includes(o.rank));
    }
    observations
      .forEach((o) => {
        uniqueTaxa[o.taxon_id] = { taxon_id: o.taxon_id, name: formatTaxonDisplayName(o, true), rank: o.rank };
      });

    return Object.values(uniqueTaxa);
  } else {
    let uniqueTaxa = {};
    observations.forEach((values, key) => {
      if (limitToSpecies) {
        values = values.filter((o) => speciesRanks.includes(o.rank));
      }
      values.forEach((o) => {
        uniqueTaxa[o.taxon_id] = {
          taxon_id: o.taxon_id,
          name: formatTaxonDisplayName(o, true, false, true),
          rank: o.rank
        };
      });
    });
    return Object.values(uniqueTaxa);
  }
}

export function countObservers(observations, limitToSpecies = false) {
  return getObservers(observations, limitToSpecies).length;
}

export function getObservers(observations, limitToSpecies = false) {
  if (Array.isArray(observations)) {
    let uniqueObservers = new Set();
    if (limitToSpecies) {
      observations = observations.filter((o) => speciesRanks.includes(o.rank));
    }
    observations.forEach((o) => {
      uniqueObservers.add(o.user_login);
    });
    return [...uniqueObservers];
  } else {
    let uniqueObservers = new Set();
    observations.forEach((values, key) => {
      if (limitToSpecies) {
        values = values.filter((o) => speciesRanks.includes(o.rank));
      }
      values.forEach((o) => {
        uniqueObservers.add(o.user_login);
      });
    });
    return [...uniqueObservers];
  }
}

export function getObservationsSelected(groupedObservations, timeSpanHistory) {
  let observations;

  // if no time spans filters
  if (Object.keys(timeSpanHistory).length === 0) {
    observations = [...groupedObservations];
    // filter groupedObservations by spans filters
  } else {
    observations = new Map();
    groupedObservations.forEach((value, key) => {
      if (timeSpanHistory[key]) {
        observations.set(key, value);
      }
    });
  }

  return observations;
}

export function getObservedSpecies(taxa, taxon) {
  return taxa
    .filter((t) => speciesRanks.includes(t.rank))
    .filter((t) => t.observations_count > 0)
    .filter((t) => t.taxon_ids.split('|').includes('' + taxon.taxon_id));
}

export function updateTimeSpans(e, timeSpanHistory) {
  let targetFilter = e.target.dataset['filter'];
  targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);

  // update filters
  timeSpanHistory[targetFilter] = !timeSpanHistory[targetFilter];
  return timeSpanHistory;
}
