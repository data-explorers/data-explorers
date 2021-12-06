<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, Circle } from 'svelte-leafletjs';
  import Popup from '$lib/components/map_popup_observation.svelte';
  import { onMount } from 'svelte';
  import { radiusZoom, tileLayerOptions, tileUrl } from '$lib/mapUtils';

  export let mapOptions;
  export let observations;

  let leafletMap;
  let defaultColor = '#3388ff';

  // set default map values
  mapOptions = {
    center: [mapOptions.latitude || 0, mapOptions.longitude || 0],
    displayType: mapOptions.displayType || 'marker',
    color: mapOptions.color || defaultColor,
    zoom: mapOptions.zoom || 0
  };

  observations = observations.filter((o) => o.latitude && o.longitude);

  let zoomLevel = 0;
  let circleRadius = 1;

  // make certain variables reactive so they chamge values when user zooms
  // in and out of map
  $: if (leafletMap && mapOptions.displayType !== 'marker') {
    zoomLevel = leafletMap.getMap().getZoom();
  }
  $: if (leafletMap && mapOptions.displayType !== 'marker') circleRadius = radiusZoom(zoomLevel);

  onMount(() => {
    leafletMap.getMap().on('zoomend', function () {
      if (mapOptions.displayType !== 'marker') {
        zoomLevel = leafletMap.getMap().getZoom();
        circleRadius = radiusZoom(zoomLevel);
      }
    });
  });
</script>

<div style="width: 100%; height: 600px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    {#each observations as obs}
      <Circle
        latLng={[obs.latitude, obs.longitude]}
        radius={circleRadius}
        color={obs.color}
        fillColor={obs.fillColor}
      >
        <Popup observation={obs} />
      </Circle>
    {/each}
  </LeafletMap>
</div>
