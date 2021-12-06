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
