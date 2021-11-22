export async function fetchInatTaxa(taxonName, projectTaxa) {
  let apiBase = 'https://api.inaturalist.org/v1/taxa?q=';
  let url = `${apiBase}${taxonName}`;
  let response = await fetch(url);
  if (response.ok) {
    let results = await response.json();
    if (results && results.results.length > 0) {
      let result = results.results[0];

      let existsInProject = projectTaxa.filter((taxon) => taxon.taxon_id == result.id).length > 0;

      return {
        common_name: result.preferred_common_name,
        scientific_name: result.name,
        taxon_id: result.id,
        exists_in_project: existsInProject,
        rank: result.rank,
        iconic_taxon_name: result.iconic_taxon_name,
        image: result.default_photo && result.default_photo.square_url
      };
    } else {
      return {};
    }
  }
}

export async function fetchGlobi(taxonName, interaction) {
  let apiBase = 'https://api.globalbioticinteractions.org/taxon';
  let url = `${apiBase}/${taxonName}/${interaction}`;
  let response = await fetch(url);
  if (response.ok) {
    let results = await response.json();
    if (results && results.data.length > 0) {
      return results.data[0][2];
    }
  }
  return [];
}

export async function formatInteractions(
  taxonName,
  interaction,
  projectTaxa,
  interactionLimit = 3
) {
  let taxa = [];
  let names = await fetchGlobi(taxonName, interaction);
  names = names.splice(0, interactionLimit);
  if (names) {
    taxa = await Promise.all(names.map(async (name) => await fetchInatTaxa(name, projectTaxa)));
  }
  return taxa;
}
