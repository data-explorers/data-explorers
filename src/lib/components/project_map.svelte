<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, Marker } from 'svelte-leafletjs';
  import { tileLayerOptions, tileUrl } from '$lib/mapUtils';

  export let mapOptions;
</script>

<div style="width: 100%; height: 400px;">
  <LeafletMap options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    <Marker latLng={[mapOptions.latitude, mapOptions.longitude]} />
  </LeafletMap>
</div>
