<script>
  import 'leaflet/dist/leaflet.css';
  import {
    LeafletMap,
    CircleMarker,
    Popup,
    Rectangle,
    ScaleControl,
    LayerControl
  } from '$lib/vendor/svelte-leaflet';
  import MyPopup from '$lib/components/map_popup_observation.svelte';
  import { onMount } from 'svelte';
  import { getMapTiles, scaleControlOptions } from '$lib/mapUtils';

  export let mapOptions;
  export let groupedObservations;
  export let timeSpanHistory;
  export let showDemoMapLayer;
  export let projectPath;
  // export let taxaHistory;
  export let country;

  let leafletMap;
  let circleRadius = 7;

  // let coordinates = [];

  // $: if (taxaHistory.length > 0) {
  //   coordinates = [];
  //   let temp = taxaHistory.map((t) => t.observations);
  //   for (let i = 0; i < temp.length; i++) {
  //     for (let j = 0; j < temp[i].length; j++) {
  //       coordinates.push([temp[i][j].latitude, temp[i][j].longitude]);
  //     }
  //   }

  //   leafletMap.getMap().fitBounds(coordinates);
  // }

  let demoPolygon = [
    [0, 0],
    [0, 0]
  ];
  let scaleControl;
  let tiles = getMapTiles();
  let baseLayers = {
    Street: tiles.OpenStreetMap,
    Minimal: tiles.GBIFGeyser,
    Terrain: tiles.StamenTerrain
  };
  if (country === 'USA') {
    baseLayers['Satellite'] = tiles.USGSImagery;
  }

  onMount(() => {
    // if (coordinates.length > 0) {
    //   leafletMap.getMap().fitBounds(coordinates);
    // }

    let east = leafletMap.getMap().getBounds().getEast();
    let west = leafletMap.getMap().getBounds().getWest();
    let north = leafletMap.getMap().getBounds().getNorth();
    let south = leafletMap.getMap().getBounds().getSouth();
    var width =
      leafletMap.getMap().getBounds().getEast() - leafletMap.getMap().getBounds().getWest();
    var height =
      leafletMap.getMap().getBounds().getNorth() - leafletMap.getMap().getBounds().getSouth();
    demoPolygon = [
      [north - height * 0.3, east - width * 0.3],
      [south + height * 0.3, west + width * 0.3]
    ];
  });
</script>

<div style="width: 100%; height: 600px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    {#if Array.isArray(groupedObservations)}
      {#each groupedObservations as obs}
        <CircleMarker
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={obs.color}
          fillColor={obs.fillColor}
        >
          <MyPopup observation={obs} {projectPath} />
        </CircleMarker>
      {/each}
    {:else}
      {#each [...groupedObservations] as [key, observations]}
        {#each observations as obs}
          {#if timeSpanHistory[key]}
            <CircleMarker
              latLng={[obs.latitude, obs.longitude]}
              radius={circleRadius}
              color={obs.color}
              fillColor={obs.fillColor}
            >
              <MyPopup observation={obs} {projectPath} />
            </CircleMarker>
          {/if}
        {/each}
      {/each}
    {/if}
    {#if showDemoMapLayer}
      <Rectangle latLngBounds={demoPolygon} color="#777" fillColor="#777">
        <Popup>Demo map layer</Popup>
      </Rectangle>
    {/if}
    <ScaleControl bind:this={scaleControl} position="bottomleft" options={scaleControlOptions} />
    <LayerControl baseLayersData={baseLayers} />
  </LeafletMap>
</div>
