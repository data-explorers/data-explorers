<script>
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { LeafletMap, TileLayer, Marker } from 'svelte-leafletjs';
  export let project;
  export let observations;

  const mapOptions = {
    center: [project.latitude, project.longitude],
    zoom: project.zoom
  };
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: '© OpenStreetMap contributors'
  };

  let coordinates = observations.map((o) => [o.latitude, o.longitude]);
  let leafletMap;
  onMount(() => {
    if (coordinates.length > 0) {
      leafletMap.getMap().fitBounds(coordinates);
    }
  });
</script>

<div class="example" style="width: 100%; height: 400px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    <Marker latLng={[project.latitude, project.longitude]} />

    {#each observations as obs}
      <Marker latLng={[obs.latitude, obs.longitude]} />
    {/each}
  </LeafletMap>
</div>
