export function formatRawObservations(observations) {
  return observations.map((o) => {
    return {
      ...o,
      id: Number(o.id),
      latitude: Number(o.latitude),
      longitude: Number(o.longitude),
      taxon_id: Number(o.taxon_id),
      coordinates_obscured: o.coordinates_obscured === 'True'
    };
  });
}

export function formatRawTaxa(taxa) {
  return taxa.map((t) => {
    return {
      ...t,
      id: Number(t.id),
      observations_count: Number(t.observations_count),
      parent_id: Number(t.parent_id),
      taxa_count: Number(t.taxa_count),
      taxon_id: Number(t.taxon_id)
    };
  });
}
