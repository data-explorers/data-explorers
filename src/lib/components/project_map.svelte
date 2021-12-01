<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, Marker } from 'svelte-leafletjs';

  export let mapOptions;

  mapOptions['center'] = [mapOptions.latitude || 0, mapOptions.longitude || 0];
  mapOptions['zoom'] = mapOptions.zoom || 1;

  // const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // const tileUrl = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
  // const tileUrl = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
  const tileUrl = 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    // attribution: '© OpenStreetMap contributors'
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  };
</script>

<div style="width: 100%; height: 400px;">
  <LeafletMap options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    <Marker latLng={[mapOptions.latitude, mapOptions.longitude]} />
  </LeafletMap>
</div>
