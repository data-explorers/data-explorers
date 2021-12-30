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
    MarkerCluster,
    EasyButton
  } from '$lib/vendor/svelte-leaflet';
  import MyPopup from '$lib/components/map_popup_observation.svelte';
  import { onMount } from 'svelte';
  import { getMapTiles, scaleControlOptions } from '$lib/mapUtils';

  export let mapOptions;
  export let groupedObservations;
  export let timeSpanHistory;
  export let showDemoMapLayer;
  export let projectPath;
  export let taxaHistory;
  export let country;

  let leafletMap;
  let map;
  let circleRadius = 7;
  let coordinates = [];
  let demoPolygon = [
    [0, 0],
    [0, 0]
  ];
  let allPointsInMapStatus = true;
  let noTaxa = true;
  let scaleControl;
  let useMarkerCluster = false;
  let clusterLimit = 1000;
  let zoomLevel;
  let pointsInMapCount = 0;
  let fitBoundsButton;
  let toggleMarkerModeButton;
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
    if (leafletMap && taxaHistory.length > 0) {
      // coordinates be be in this format: [[lat, lon], [lat, lon]]
      coordinates = [];
      taxaHistory.map((t) => t.observations);
      let temp = taxaHistory.map((t) => t.observations);
      for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].length; j++) {
          coordinates.push([temp[i][j].latitude, temp[i][j].longitude]);
        }
      }

      let currentBounds = map.getBounds();
      let foo = coordinates.filter((coordinate) => {
        let latlng = new L.latLng(coordinate[0], coordinate[1]);
        return currentBounds.contains(latlng);
      });

      pointsInMapCount = calculatePointsInMap(coordinates, map);
      if(pointsInMapCount > clusterLimit) {
        toggleMarkerModeButton.getButton().state('show-clusters');
      } else {
        toggleMarkerModeButton.getButton().state('show-markers');
      }
      // todo
      useMarkerCluster = pointsInMapCount > clusterLimit;
    }

    if (taxaHistory.length === 0) {
      noTaxa = true;
      // zoom map after the first taxa is loaded
    } else if (leafletMap && noTaxa && taxaHistory.length === 1) {
      fitPointsInMap(coordinates, map);
      noTaxa = false;
    } else if (leafletMap && taxaHistory.length > 1) {
      let observationBounds = L.latLngBounds(coordinates);
      let currentBounds = map.getBounds();
      allPointsInMapStatus = currentBounds.contains(observationBounds);
    }
  }

  // ===================
  // map buttons
  // ===================
  $: {
    if (fitBoundsButton) {
      if (coordinates.length === 0) {
        fitBoundsButton.getButton().disable();
      } else {
        if (allPointsInMapStatus) {
          fitBoundsButton.getButton().disable();
        } else {
          fitBoundsButton.getButton().enable();
        }
      }
    }
  }

  $: {
    if (toggleMarkerModeButton) {
      if (coordinates.length === 0) {
        toggleMarkerModeButton.getButton().disable();
      } else {
        toggleMarkerModeButton.getButton().enable();
      }
    }
  }

  let toggleMarkerModeStates = {
    states: [
      {
        stateName: 'show-markers',
        icon: '<span class="text-4xl font-black leading-5">&Colon;</span>',
        title: 'switch to clustered markers',
        onClick: function (control) {
          useMarkerCluster = true;
          control.state('show-clusters');
        }
      },
    {
        stateName: 'show-clusters',
        icon: '<span class="text-6xl leading-6">&middot;</span>',
        title: 'switch to individual markers',

        onClick: function (control) {
          useMarkerCluster = false;

          control.state('show-markers');
        }
      },

    ]
  };

  // ===================
  // map
  // ===================

  function isObservationInMap(observation, map) {
    let currentBounds = map.getBounds();
    return currentBounds.contains(L.latLng(observation.latitude, observation.longitude));
  }

  function areAllPointsInMap(coordinates, map) {
    // determine if all the markers are inside the map bounding box
    if (coordinates.length > 0) {
      let currentBounds = map.getBounds();
      let observationBounds = L.latLngBounds(coordinates);
      return currentBounds.contains(observationBounds);
    }
  }

  function calculatePointsInMap(coordinates, map) {
    let currentBounds = map.getBounds();
    return coordinates.filter((coordinate) => {
      let latlng = new L.latLng(coordinate[0], coordinate[1]);
      return currentBounds.contains(latlng);
    }).length;
  }

  function fitPointsInMap(coordinates, map) {
    map.fitBounds(coordinates);
    allPointsInMapStatus = true;
  }

  function createDemoPolygon(map) {
    // create a recteangle that is a third of the size the map bounds
    let mapBounds = map.getBounds();
    let east = mapBounds.getEast();
    let west = mapBounds.getWest();
    let north = mapBounds.getNorth();
    let south = mapBounds.getSouth();
    var width = mapBounds.getEast() - mapBounds.getWest();
    var height = mapBounds.getNorth() - mapBounds.getSouth();
    return [
      [north - height * 0.3, east - width * 0.3],
      [south + height * 0.3, west + width * 0.3]
    ];
  }


  // ===================
  // life cycle
  // ===================

  onMount(() => {
    map = leafletMap.getMap();
    demoPolygon = createDemoPolygon(map);

    leafletMap.getMap().on('zoomend', function () {
      zoomLevel = map.getZoom();
      pointsInMapCount = calculatePointsInMap(coordinates, map);
      allPointsInMapStatus = areAllPointsInMap(coordinates, map);
    });

    leafletMap.getMap().on('moveend', function () {
      zoomLevel = map.getZoom();
      pointsInMapCount = calculatePointsInMap(coordinates, map);
      allPointsInMapStatus = areAllPointsInMap(coordinates, map);
    });
  });

</script>

<div style="width: 100%; height: 600px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <!-- marker clusters -->
    {#if useMarkerCluster}
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
        {#if coordinates.length < clusterLimit || isObservationInMap(obs, map)}
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
    {#if showDemoMapLayer}
      <Rectangle latLngBounds={demoPolygon} color="#777" fillColor="#777">
        <Popup>Demo map layer</Popup>
      </Rectangle>
    {/if}
    <EasyButton
      bind:this={fitBoundsButton}
      icon={'<span class="text-3xl leading-6">&sdotb;</span>'}
      callback={() => fitPointsInMap(coordinates, map)}
      title="show all observations on map"
    />
    <EasyButton bind:this={toggleMarkerModeButton} states={toggleMarkerModeStates} />
    <ScaleControl bind:this={scaleControl} position="bottomleft" options={scaleControlOptions} />
    <LayerControl baseLayersData={baseLayers} />
  </LeafletMap>
</div>
