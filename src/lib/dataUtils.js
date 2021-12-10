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
