export function formatTaxonDisplayName(taxon, includeStyle) {
  let fullName = [];
  if (taxon.common_name) {
    fullName.push(taxon.common_name);
  }
  if (taxon.scientific_name) {
    if (includeStyle) {
      fullName.push(`<span class="text-gray-400">(${taxon.scientific_name})</span>`);
    } else {
      fullName.push(`(${taxon.scientific_name})`);
    }
  }
  return fullName.join(' ');
}

export function truncate(text, limit = 30) {
  if (text.length > limit) {
    text = `${text.slice(0, limit)}...`;
  }

  return text;
}

export function pluralize(word, count) {
  let customPlural = {
    class: 'classes',
    species: 'species',
    genus: 'genera',
    family: 'families',
    taxon: 'taxa'
  };
  if (Number(count) === 1) {
    return `${count} ${word}`;
  } else {
    if (customPlural[word]) {
      return `${count} ${customPlural[word]}`;
    } else {
      return `${count} ${word}s`;
    }
  }
}
