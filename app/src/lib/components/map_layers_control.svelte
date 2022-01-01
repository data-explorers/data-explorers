<script>
  import { LayerControl } from '$lib/vendor/svelte-leaflet';
  import { getMapTiles } from '$lib/mapUtils';

  export let country;

  let tiles = getMapTiles();

  let baseLayers = {
    Street: tiles.OpenStreetMap,
    Minimal: tiles.GBIFGeyser,
    Terrain: tiles.StamenTerrain
  };
  if (country === 'USA') {
    baseLayers['Satellite'] = tiles.USGSImagery;
  }
</script>

<LayerControl baseLayersData={baseLayers} />
