import { formatTaxonDisplayName } from '$lib/formatUtils';

export const fetchTaxonByName = (taxa, taxonName) => {
  return new Promise((resolve, reject) => {
    let results = [];
    if (taxonName.length > 2) {
      // search by common name
      results = taxa.filter((taxon) => {
        if (taxon.common_name) {
          return taxon.common_name.toLowerCase().includes(taxonName.toLowerCase());
        }
      });

      // search by scientific name
      if (results.length === 0) {
        results = taxa.filter((taxon) => {
          if (taxon.scientific_name) {
            return taxon.scientific_name.toLowerCase().includes(taxonName.toLowerCase());
          }
        });
      }

      // createdata for suggestion menu
      results = results.map((t) => {
        return {
          value: t.taxon_id,
          label: formatTaxonDisplayName(t)
        };
      });
    }
    resolve(results);
  });
};
