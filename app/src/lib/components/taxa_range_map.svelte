<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, CircleMarker } from 'svelte-leafletjs';
  import { tileLayerOptions, getMapTiles } from '$lib/mapUtils';

  export let taxon;
  export let project;
  export let observations;
  let tiles;
  let osm;
  let osmOptions;
  let inatGrid;
  let inatGridOptions;
  let inatTaxonRange;
  let inatTaxonRangeOptions;
  let showRangeMap = true;
  let showAllInat = true;
  let showObservations = true;

  $: {
    tiles = getMapTiles(taxon.taxon_id);
    osm = tiles.osm;
    osmOptions = { ...tileLayerOptions, attribution: osm.attribution };

    inatGrid = tiles.inatGrid;
    inatGridOptions = { ...tileLayerOptions, attribution: inatGrid.attribution };

    inatTaxonRange = tiles.inatTaxonRange;
    inatTaxonRangeOptions = { ...tileLayerOptions, attribution: inatTaxonRange.attribution };
  }

  let mapOptions = {
    latitude: project.latitude,
    longitude: project.longitude,
    zoom: 4,
    center: [project.latitude, project.longitude]
  };
</script>

<label class="cursor-pointer mr-3">
  <input
    type="checkbox"
    class="mr-1"
    checked
    on:click={() => (showObservations = !showObservations)}
  />project observations
</label>
<label class="cursor-pointer mr-3">
  <input type="checkbox" class="mr-1" checked on:click={() => (showAllInat = !showAllInat)} />all
  iNaturalist observations
</label>
<label class="cursor-pointer mr-3">
  <input
    type="checkbox"
    class="mr-1"
    checked
    on:click={() => (showRangeMap = !showRangeMap)}
  />range map
</label>

<div class="mt-4" style="width: 65%; height: 400px;">
  <LeafletMap options={mapOptions}>
    <TileLayer url={osm.url} options={osmOptions} />
    {#if showRangeMap}
      <TileLayer url={`${inatTaxonRange.url}?color=%23feb24c`} options={inatTaxonRangeOptions} />
    {/if}
    {#if showAllInat}
      <TileLayer url={`${inatGrid.url}&color=%23f03b20`} options={inatGridOptions} />
    {/if}
    {#if showObservations}
      {#each observations as observation}
        <CircleMarker
          latLng={[observation.latitude, observation.longitude]}
          radius={10}
          color={mapOptions.defaultColor}
          fillColor={mapOptions.defaultColor}
        />
      {/each}
    {/if}
  </LeafletMap>
</div>
