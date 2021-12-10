import { formatTaxonDisplayName } from '$lib/formatUtils';
import _groupBy from 'lodash.groupby';

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

function getDateRange(startDate, endDate, steps = 1) {
  // return an array of dates between start and end dates
  // https://stackoverflow.com/a/64592438
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }
  return dateArray;
}

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

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => i);
}

export function getDateSliderValues(availableDates) {
  return [0, availableDates.length - 1];
}

function getNumberOfMonthsBetween(dateFrom, dateTo) {
  // https://stackoverflow.com/a/4312956
  let dateObjFrom = new Date(dateFrom);
  let dateObjTo = new Date(dateTo);
  return (
    dateObjFrom.getMonth() -
    dateObjTo.getMonth() +
    12 * (dateObjFrom.getFullYear() - dateObjTo.getFullYear())
  );
}

function getMonthsBetween(dateFrom, dateTo) {
  // https://stackoverflow.com/a/30465299
  var start = dateFrom.split('-');
  var end = dateTo.split('-');
  var startYear = parseInt(start[0]);
  var endYear = parseInt(end[0]);
  var dates = [];

  for (var i = startYear; i <= endYear; i++) {
    var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
    var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
    for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      var month = j + 1;
      var displayMonth = month < 10 ? '0' + month : month;
      dates.push([i, displayMonth, '01'].join('-'));
    }
  }
  return dates;
}

export function sortObservationsNewestFirst(a, b) {
  return new Date(b.time_observed_at) - new Date(a.time_observed_at);
}

export function sortObservationsOldestFirst(a, b) {
  return new Date(a.time_observed_at) - new Date(b.time_observed_at);
}

export function sortObservations(observations, orderByValue) {
  let validObservations = observations.filter((o) => o.time_observed_at);
  let invalidObservations = observations.filter((o) => !o.time_observed_at);
  let temp;

  if (orderByValue === 'oldest') {
    temp = validObservations.sort(sortObservationsOldestFirst);
  } else {
    temp = validObservations.sort(sortObservationsNewestFirst);
  }

  if (invalidObservations.length > 0) {
    temp = temp.concat(invalidObservations);
  }

  return temp;
}

export function getGroupKeys(groupedObject, orderByValue) {
  let keys = [];
  let hasUnknown = false;
  for (let key in groupedObject) {
    key !== 'unknown' ? keys.push(key) : (hasUnknown = true);
  }

  if (orderByValue === 'newest') {
    keys.reverse();
  }

  if (hasUnknown) {
    keys = keys.concat('unknown');
  }

  return keys;
}

export function getGroupValues(groupedObject, orderByValue) {
  let values = [];
  let hasUnknown = false;

  for (let key in groupedObject) {
    key !== 'unknown' ? values.push(groupedObject[key]) : (hasUnknown = true);
  }
  if (orderByValue === 'newest') {
    values = values.reverse();
  }

  if (hasUnknown) {
    values.push(groupedObject['unknown']);
  }
  return values;
}

export function createGroupObservations(observations, groupByValue) {
  let groups;
  let validObservations = observations.filter((o) => o.time_observed_at);
  if (groupByValue === 'month') {
    groups = _groupBy(validObservations, function (o) {
      return new Date(o.time_observed_at).getMonth();
    });
  } else if (groupByValue === 'year') {
    groups = _groupBy(validObservations, function (o) {
      return new Date(o.time_observed_at).getFullYear();
    });
  }

  let invalidObservations = observations.filter((o) => !o.time_observed_at);
  if (invalidObservations.length > 0) {
    groups['unknown'] = invalidObservations;
  }

  return groups;
}

export function setObservationsAndKeys(observations, orderByValue, groupByValue) {
  let processedObs = observations;
  let keys = [];
  if (groupByValue !== 'none') {
    let groups = createGroupObservations(observations, groupByValue);
    keys = getGroupKeys(groups, orderByValue);
    processedObs = getGroupValues(groups, orderByValue);
  }
  return { groupByKeys: keys, observationsDisplay: processedObs };
}
