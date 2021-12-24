<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer } from 'svelte-leafletjs';
  import { tileLayerOptions, getMapTiles } from '$lib/mapUtils';

  export let taxon;
  export let project;
  let tiles;
  let osm;
  let osmOptions;
  let inatGrid;
  let inatGridOptions;
  let inatTaxonRange;
  let inatTaxonRangeOptions;

  $: {
    tiles = getMapTiles(taxon.taxon_id);
    osm = tiles.osm;
    osmOptions = { ...tileLayerOptions, attribution: osm.attribution };

    inatGrid = tiles.inatGrid;
    inatGridOptions = { ...tileLayerOptions, attribution: inatGrid.attribution };
  }

  let mapOptions = {
    latitude: project.latitude,
    longitude: project.longitude,
    zoom: 4,
    center: [project.latitude, project.longitude]
  };
</script>

<div style="width: 65%; height: 400px;">
  <LeafletMap options={mapOptions}>
    <TileLayer url={osm.url} options={osmOptions} />
    <TileLayer url={inatGrid.url} options={inatGridOptions} />
  </LeafletMap>
</div>
