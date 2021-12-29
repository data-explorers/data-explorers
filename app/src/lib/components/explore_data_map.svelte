<script>
  import 'leaflet/dist/leaflet.css';
  // import pointWithinPolygon from '@turf/points-within-polygon';
  // import {point, points, polygon, polygons} from '@turf/helpers'
  import * as turf from '@turf/turf';
  // import * as L from 'leaflet'
  import {
    LeafletMap,
    CircleMarker,
    Popup,
    Rectangle,
    ScaleControl,
    LayerControl,
    Icon,
    Marker,
    MarkerCluster
  } from '$lib/vendor/svelte-leaflet';
  import MyPopup from '$lib/components/map_popup_observation.svelte';
  import { onMount } from 'svelte';
  import { getMapTiles, scaleControlOptions } from '$lib/mapUtils';
  import { logTime } from '$lib/dataUtils';
import { columnsNotSupportByRowCol } from 'vega-lite/src/log/message';

  export let mapOptions;
  export let groupedObservations;
  export let timeSpanHistory;
  export let showDemoMapLayer;
  export let projectPath;
  export let taxaHistory;
  export let country;

  let leafletMap;
  let circleRadius = 7;
  let coordinates = [];
  let demoPolygon = [
    [0, 0],
    [0, 0]
  ];
  let allMarkersInView = true;
  let noTaxa = true;
  let scaleControl;
  let userMarkerCluster = false;
  let mounted = false;
  let clusterLimit = 1000
  let zoomLevel
  let pointsInView = 0

  let tiles = getMapTiles();
  let baseLayers = {
    Street: tiles.OpenStreetMap,
    Minimal: tiles.GBIFGeyser,
    Terrain: tiles.StamenTerrain
  };
  if (country === 'USA') {
    baseLayers['Satellite'] = tiles.USGSImagery;
  }

  $: {
    if (taxaHistory.length > 0) {
      // coordinates be be in this format: [[lat, lon], [lat, lon]]
      coordinates = [];
      taxaHistory.map((t) => t.observations);
      let temp = taxaHistory.map((t) => t.observations);
      for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].length; j++) {
          coordinates.push([temp[i][j].latitude, temp[i][j].longitude]);
        }
      }

      let currentBounds = leafletMap.getMap().getBounds();
      let foo = coordinates.filter((coordinate) => {
        let latlng = new L.latLng(coordinate[0], coordinate[1]);
        return currentBounds.contains(latlng);
      });

      pointsInView = calculatePointsInView(coordinates)
      userMarkerCluster = pointsInView > clusterLimit;

    }

    if (taxaHistory.length === 0) {
      noTaxa = true;
      // zoom map after the first taxa is loaded
    } else if (noTaxa && taxaHistory.length === 1) {
      // fitBounds();
      noTaxa = false;
    } else if (taxaHistory.length > 1) {
      let observationBounds = L.latLngBounds(coordinates);
      let currentBounds = leafletMap.getMap().getBounds();
      allMarkersInView = currentBounds.contains(observationBounds);
    }
  }

  function pointWithinBoundingBox(observation) {
      let currentBounds = leafletMap.getMap().getBounds();
      return currentBounds.contains(L.latLng(observation.latitude, observation.longitude));
  }

  function calculatePointsInView(coordinates) {
    let currentBounds = leafletMap.getMap().getBounds();
    return coordinates.filter((coordinate) => {
      let latlng = new L.latLng(coordinate[0], coordinate[1]);
      return currentBounds.contains(latlng);
    }).length;
  }


  function fitBounds(coordinates) {
    allMarkersInView = true;
    leafletMap.getMap().fitBounds(coordinates);
  }

  function createDemoPolygon() {
    // create a recteangle that is a third of the size the map bounds
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
  }

  onMount(() => {
    mounted = true;
    createDemoPolygon();
    leafletMap.getMap().on('zoomend', function () {
      zoomLevel = leafletMap.getMap().getZoom();
      pointsInView = calculatePointsInView(coordinates)

    });
    leafletMap.getMap().on('moveend', function () {
      zoomLevel = leafletMap.getMap().getZoom();
      pointsInView = calculatePointsInView(coordinates)

    });
  });

</script>
{#if leafletMap}
 zoom: {zoomLevel}<br>
 {/if}
{#if taxaHistory.length > 0}
points #: { pointsInView}<br>
coordinates #: { coordinates.length}<br>

don't check each marker: {coordinates.length < clusterLimit }
{/if}

{#if !allMarkersInView}
  <div on:click={fitBounds}>Zoom out to see all observations</div>
{/if}
<div style="width: 100%; height: 600px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    {#if showDemoMapLayer}
      <Rectangle latLngBounds={demoPolygon} color="#777" fillColor="#777">
        <Popup>Demo map layer</Popup>
      </Rectangle>
    {/if}
    <ScaleControl bind:this={scaleControl} position="bottomleft" options={scaleControlOptions} />
    <LayerControl baseLayersData={baseLayers} />

    <!-- marker clusters -->
    {#if userMarkerCluster}
      {#if Array.isArray(groupedObservations)}
        <MarkerCluster items={groupedObservations} />
      {:else}
        {#each [...groupedObservations] as [key, observations]}
          {#if timeSpanHistory[key]}
            <MarkerCluster items={observations} />
          {/if}
        {/each}
      {/if}
    <!-- individual markers -->
    {:else if Array.isArray(groupedObservations)}
      {#each groupedObservations as obs}
        {#if coordinates.length < clusterLimit || pointWithinBoundingBox(obs)}
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
    <!-- individual markers grouped by time -->
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
  </LeafletMap>
</div>
