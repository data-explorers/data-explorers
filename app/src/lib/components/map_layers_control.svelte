<script>
  import { LayerControl } from '$lib/vendor/svelte-leaflet';
  import { getMapTiles } from '$lib/mapUtils';

  export let country;
  export let project;

  let tiles = getMapTiles();
  let overlays = [];
  if (project && project.map_layers) {
    overlays = project.map_layers;
  }

  let baseLayers = {
    Street: tiles.OpenStreetMap,
    Minimal: tiles.GBIFGeyser,
    Terrain: tiles.StamenTerrain
  };
  if (country === 'USA') {
    baseLayers['Satellite'] = tiles.USGSImagery;
  }
  baseLayers['None'] = { url: '', options: {} };
</script>

<LayerControl baseLayersData={baseLayers} overlayLayersData={overlays} />
