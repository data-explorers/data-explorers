import { formatTaxonDisplayName } from '$lib/formatUtils';
import { getDateRange, groupByMap, range } from '$lib/miscUtils';
import { isObservationInMap } from '$lib/mapUtils';
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
            image_url: taxon.image_url
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

export function generateTimeSpanCounts(
  type,
  observations,
  taxaHistory,
  timeSpanHistory,
  inactiveOpacity,
  project
) {
  if (taxaHistory.length === 0) {
    return {};
  }

  let timePeriodCountsPerTaxon = {};
  let missingPeriods = [];

  function formatDefaultRecord(taxon, timePeriod) {
    return {
      count: 1,
      color: taxon.color,
      taxon_name: taxon.taxon_name,
      opacity: taxon.active && timeSpanHistory[timePeriod] ? 1 : inactiveOpacity
    };
  }

  // create a count of the number of taxa per month
  taxaHistory.forEach((taxon) => {
    observations
      .filter((o) => taxon.observations.includes(o.id))
      .forEach((observation) => {
        let taxonId = Number(taxon.taxon_id);
        let timePeriod = observation[type] == 'unknown' ? 'unknown' : Number(observation[type]);
        if (timePeriodCountsPerTaxon[timePeriod]) {
          // increment count for existing time period and taxon
          if (timePeriodCountsPerTaxon[timePeriod][taxonId]) {
            timePeriodCountsPerTaxon[timePeriod][taxonId]['count'] += 1;
            // add taxon to existing time period
          } else {
            timePeriodCountsPerTaxon[timePeriod][taxonId] = formatDefaultRecord(taxon, timePeriod);
          }
          // add time period and taxon
        } else {
          timePeriodCountsPerTaxon[timePeriod] = {
            [taxonId]: formatDefaultRecord(taxon, timePeriod)
          };
        }
      });
  });

  addMissingTimePeriods(type, timePeriodCountsPerTaxon, missingPeriods, taxaHistory, project);

  return timePeriodCountsPerTaxon;
}

function addMissingTimePeriods(
  type,
  timePeriodCountsPerTaxon,
  missingPeriods,
  taxaHistory,
  project
) {
  // create empty placeholder records for time spans that don't have
  // observations so that the chart will still show the empty time spans

  if (type === 'month') {
    let months = Object.keys(timePeriodCountsPerTaxon).map((m) => Number(m));
    let allMonths = project.observed_months;
    missingPeriods = allMonths.filter((num) => !months.includes(num));
  } else if (type === 'year') {
    let years = Object.keys(timePeriodCountsPerTaxon).map((y) => Number(y));
    let allYears = range(project.observed_years[0], project.observed_years[1]);
    missingPeriods = allYears.filter((year) => !years.includes(year));
  }

  // Create empty placeholder records for the first taxon. All other
  // taxa will also show the empty time spans since we are using faceted charts.
  let taxon = taxaHistory[0];
  missingPeriods.forEach((period) => {
    timePeriodCountsPerTaxon[period] = {};
    timePeriodCountsPerTaxon[period][taxon.taxon_id] = {
      count: 0,
      opacity: 0,
      taxon_name: taxon.taxon_name
    };
  });
}

export function countObservations(observations, field = 'id') {
  if (Array.isArray(observations)) {
    return new Set(observations.map((o) => o[field])).size;
  } else {
    let uniqueIds = new Set();
    observations.forEach((values, key) => {
      values.forEach((o) => uniqueIds.add(o[field]));
    });
    return uniqueIds.size;
  }
}

export function countSpecies(observations) {
  if (Array.isArray(observations)) {
    return new Set(observations.filter((o) => speciesRanks.includes(o.rank)).map((o) => o.taxon_id))
      .size;
  } else {
    let uniqueIds = new Set();
    observations.forEach((values, key) => {
      values.filter((o) => speciesRanks.includes(o.rank)).forEach((o) => uniqueIds.add(o.taxon_id));
    });
    return uniqueIds.size;
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

export function getObservationsDisplay(groupedObservations, useMarkerCluster, map, L) {
  let observations;
  if (Array.isArray(groupedObservations)) {
    observations = groupedObservations.filter((o) => isObservationInMap(o, map, L));
  } else {
    // if we are using marker clusters, flatten groupedObservations into an array
    if (useMarkerCluster) {
      let flatObservations = [];
      groupedObservations.forEach((values, key) => {
        values = values.filter((o) => isObservationInMap(o, map, L));
        flatObservations = flatObservations.concat(values);
      });
      observations = flatObservations;
      // if we are using individual markers, create a new Map
    } else {
      observations = new Map();
      groupedObservations.forEach((values, key) => {
        values = values.filter((o) => isObservationInMap(o, map, L));
        observations.set(key, values);
      });
    }
  }

  return observations;
}
