import { formatTaxonDisplayName } from '$lib/formatUtils';

export const fetchTaxaByName = (taxa, keyword) => {
  // find taxa whose common name or scientific name matches the keyword
  return new Promise((resolve, reject) => {
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

export function sortObservationsNewestFirst(a, b) {
  return new Date(b.time_observed_at) - new Date(a.time_observed_at);
}

export function sortObservationsOldestFirst(a, b) {
  return new Date(a.time_observed_at) - new Date(b.time_observed_at);
}

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

