<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, Marker } from 'svelte-leafletjs';
  import { getMapTiles } from '$lib/mapUtils';

  export let mapOptions;

  let tile = getMapTiles().OpenStreetMap;
</script>

<div style="width: 100%; height: 400px;">
  <LeafletMap options={mapOptions}>
    <TileLayer url={tile.url} options={tile.options} />
    <Marker latLng={[mapOptions.latitude, mapOptions.longitude]} />
  </LeafletMap>
</div>
