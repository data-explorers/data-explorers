<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer, Circle, Popup } from 'svelte-leafletjs';
  import MyPopup from '$lib/components/map_popup_observation.svelte';
  import { onMount } from 'svelte';
  import { radiusZoom, tileLayerOptions, tileUrl } from '$lib/mapUtils';

  export let mapOptions;
  export let groupedObservations;
  export let timeSpanHistory;
  export let showDemoMapLayer;
  export let taxaHistory;

  let leafletMap;
  let zoomLevel = 0;
  let circleRadius = 1;
  let taxaCount = 0;

  // make certain variables reactive so they change values when user zooms
  // in and out of map
  $: if (leafletMap) {
    zoomLevel = leafletMap.getMap().getZoom();
    circleRadius = radiusZoom(zoomLevel);
  }
  let coordinates = [];

  $: if (taxaHistory.length > 0) {
    coordinates = [];
    taxaCount = taxaHistory.length;
    let temp = taxaHistory.map((t) => t.observations);
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp[i].length; j++) {
        coordinates.push([temp[i][j].latitude, temp[i][j].longitude]);
      }
    }

    leafletMap.getMap().fitBounds(coordinates);
  }

  onMount(() => {
    if (coordinates.length > 0) {
      leafletMap.getMap().fitBounds(coordinates);
    }

    leafletMap.getMap().on('zoomend', function () {
      zoomLevel = leafletMap.getMap().getZoom();
      circleRadius = radiusZoom(zoomLevel);
    });
  });
</script>

<div style="width: 100%; height: 600px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />

    {#if Array.isArray(groupedObservations)}
      {#each groupedObservations as obs}
        <Circle
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={obs.color}
          fillColor={obs.fillColor}
        >
          <MyPopup observation={obs} />
        </Circle>
      {/each}
    {:else}
      {#each [...groupedObservations] as [key, observations]}
        {#each observations as obs}
          {#if timeSpanHistory[key]}
            <Circle
              latLng={[obs.latitude, obs.longitude]}
              radius={circleRadius}
              color={obs.color}
              fillColor={obs.fillColor}
            >
              <MyPopup observation={obs} />
            </Circle>
          {/if}
        {/each}
      {/each}
    {/if}
  </LeafletMap>
</div>
