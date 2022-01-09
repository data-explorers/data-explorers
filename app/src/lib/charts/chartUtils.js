import vegaEmbed from 'vega-embed';
import { getMonthName } from '$lib/mapUtils';
import { modulo, range } from '$lib/miscUtils';
import { groupObservationsbyTime } from '$lib/dataUtils';

function generateTimeSpanCounts(
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
      .filter((o) => taxon.observationIds.includes(o.id))
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

export function setupExploreDataAllChart(spec, inactiveOpacity, taxaHistory, observations) {
  let ids = observations.map((o) => o.id);
  let chartData = taxaHistory.map((t) => {
    return {
      xValue: t.taxon_name,
      yValue: t.observationIds.filter((id) => ids.includes(id)).length,
      group: '',
      color: t.taxon_name,
      label: t.taxa_count,
      opacity: t.active ? 1 : inactiveOpacity
    };
  });

  spec['data']['values'] = chartData;
  spec['height'] = 200;
  // legend
  spec['encoding']['x']['axis'] = null;
  spec['encoding']['color']['scale'] = {
    domain: taxaHistory.map((t) => t.taxon_name),
    range: taxaHistory.map((t) => t.color)
  };
  spec['encoding']['color']['title'] = null;

  return spec;
}

export function setupExploreDataMonthChart(
  spec,
  inactiveOpacity,
  taxaHistory,
  timeSpanHistory,
  observations,
  project
) {
  if (!Array.isArray(observations)) {
    let obs = [];
    observations.forEach((values, key) => {
      obs = obs.concat(values);
    });
    observations = obs;
  }
  let chartData = [];
  let monthlyCountsPerTaxon = generateTimeSpanCounts(
    'month',
    observations,
    taxaHistory,
    timeSpanHistory,
    inactiveOpacity,
    project
  );

  for (let month in monthlyCountsPerTaxon) {
    let monthData = monthlyCountsPerTaxon[month];
    for (let taxonId in monthData) {
      let taxonData = monthData[taxonId];
      chartData.push({
        xValue: month === 'unknown' ? month : getMonthName(month),
        yValue: taxonData['count'],
        group: taxonData['taxon_name'],
        color: taxonData['color'],
        opacity: taxonData['opacity']
      });
    }
  }

  spec['data']['values'] = chartData;
  // ensure the charts are in the same order as the taxa filters
  spec['facet']['sort'] = taxaHistory.map((t) => t.taxon_name);
  // hide legend
  spec['spec']['layer'][0]['encoding']['color']['scale'] = null;

  return spec;
}

export function setupExploreDataYearChart(
  spec,
  inactiveOpacity,
  taxaHistory,
  timeSpanHistory,
  observations,
  project
) {
  if (!Array.isArray(observations)) {
    let obs = [];
    observations.forEach((values, key) => {
      obs = obs.concat(values);
    });
    observations = obs;
  }
  let chartData = [];
  let yearlyCountsPerTaxon = generateTimeSpanCounts(
    'year',
    observations,
    taxaHistory,
    timeSpanHistory,
    inactiveOpacity,
    project
  );

  for (let year in yearlyCountsPerTaxon) {
    let yearData = yearlyCountsPerTaxon[year];
    for (let taxonId in yearData) {
      let taxonData = yearData[taxonId];
      chartData.push({
        xValue: year,
        yValue: taxonData['count'],
        group: taxonData['taxon_name'],
        color: taxonData['color'],
        opacity: taxonData['opacity']
      });
    }
  }

  spec['data']['values'] = chartData;
  // ensure the charts are in the same order as the taxa filters
  spec['facet']['sort'] = taxaHistory.map((t) => t.taxon_name);
  // hide legend
  spec['spec']['layer'][0]['encoding']['color']['scale'] = null;

  return spec;
}

export function drawChart(spec, chartSelector) {
  vegaEmbed(chartSelector, spec, { actions: false })
    .then((result) => {})
    .catch(console.warn);
}
