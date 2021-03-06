export function formatTaxonDisplayName(
  taxon,
  includeStyle = false,
  isHeading = false,
  includeRank = false
) {
  let fullName = [];
  if (includeRank) {
    fullName.push(`${taxon.rank}: `);
  }
  if (taxon.common_name) {
    fullName.push(toTitleCase(taxon.common_name));
  }
  if (taxon.scientific_name) {
    if (includeStyle) {
      if (isHeading) {
        fullName.push(
          `<span class="text-2xl text-gray-400 font-normal">(${taxon.scientific_name})</span>`
        );
      } else {
        fullName.push(`<span class="text-gray-400">(${taxon.scientific_name})</span>`);
      }
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

export function toTitleCase(str) {
  // https://stackoverflow.com/a/196991, https://stackoverflow.com/a/38084535
  return str
    .split(' ')
    .map((txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    .join(' ');
}
