<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, CircleMarker } from '$lib/vendor/svelte-leaflet';
  import { getMapTiles } from '$lib/mapUtils';

  export let taxon;
  export let project;
  export let observations;
  let tiles;
  let osm;
  let inatGrid;
  let inatTaxonRange;
  let showRangeMap = true;
  let showAllInat = true;
  let showObservations = true;

  $: {
    tiles = getMapTiles(taxon.taxon_id);
    osm = tiles.OpenStreetMap;
    inatGrid = tiles.InatGrid;
    inatTaxonRange = tiles.InatTaxonRange;
  }

  let mapOptions = {
    latitude: project.latitude,
    longitude: project.longitude,
    zoom: 1,
    center: [project.latitude, project.longitude]
  };
</script>

<h3>Taxon Range</h3>

<label class="cursor-pointer mr-3">
  <input
    type="checkbox"
    class="mr-1"
    bind:checked={showObservations}
    on:click={() => (showObservations = !showObservations)}
  />project observations
</label>
<label class="cursor-pointer mr-3">
  <input
    type="checkbox"
    class="mr-1"
    bind:checked={showAllInat}
    on:click={() => (showAllInat = !showAllInat)}
  />all iNaturalist observations
</label>
<label class="cursor-pointer mr-3">
  <input
    type="checkbox"
    class="mr-1"
    bind:checked={showRangeMap}
    on:click={() => (showRangeMap = !showRangeMap)}
  />range map
</label>

<div class="mt-4" style="width: 50%; height: 400px;">
  <LeafletMap options={mapOptions}>
    <TileLayer url={osm.url} options={osm.options} />
    {#if showRangeMap}
      <TileLayer url={`${inatTaxonRange.url}?color=%23feb24c`} options={inatTaxonRange.options} />
    {/if}
    {#if showAllInat}
      <TileLayer url={`${inatGrid.url}&color=%23f03b20`} options={inatGrid.options} />
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

<p>Note: Range maps are only available for some species.</p>
<p>
  Taxon range and observation data are from <a
    class="external-link"
    href="https://www.inaturalist.org/">iNaturalist</a
  >.
</p>
