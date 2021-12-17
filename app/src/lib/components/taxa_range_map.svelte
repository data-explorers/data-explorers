<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, Marker } from 'svelte-leafletjs';
  import { tileLayerOptions, getMapTiles } from '$lib/mapUtils';

  export let taxon;
  export let project;

  let mapOptions = {
    latitude: project.latitude,
    longitude: project.longitude,
    zoom: 4,
    center: [project.latitude, project.longitude]
  };
  let tiles = getMapTiles(taxon.taxon_id);
  let osm = tiles.osm;
  let osmOptions = { ...tileLayerOptions, attribution: osm.attribution };

  let inatGrid = tiles.inatGrid;
  let inatGridOptions = { ...tileLayerOptions, attribution: inatGrid.attribution };
  let inatPoint = tiles.inatPoint;
  let inatPointOptions = { ...tileLayerOptions, attribution: inatPoint.attribution };

  let inatRange = tiles.inatTaxonRange;
  let inatRangeOptions = { ...tileLayerOptions, attribution: inatRange.attribution };
</script>

<div style="width: 65%; height: 400px;">
  <LeafletMap options={mapOptions}>
    <TileLayer url={osm.url} options={osmOptions} />
    <TileLayer url={inatGrid.url} options={inatGridOptions} />
  </LeafletMap>
</div>
