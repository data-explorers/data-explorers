<script>
  import 'leaflet/dist/leaflet.css';
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
  // NOTE: groupedObservations are filtered by taxa and grouped by time spans
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
  let useMarkerCluster = false;
  let userSelectedMarkerType = 'markers';
  let clusterLimit = 1000;
  let zoomLevel;
  let fitBoundsButton;
  let toggleMarkerModeButton;
  let tiles = getMapTiles();
  let observationsSelected = [];
  let observationsDisplay = [];
  let observationsDisplayCount = 0;
  let observationsSelectedCount = 0;
  let observationsDirty = false;
  let maxZoom = 0;

  let baseLayers = {
    Street: tiles.OpenStreetMap,
    Minimal: tiles.GBIFGeyser,
    Terrain: tiles.StamenTerrain
  };
  if (country === 'USA') {
    baseLayers['Satellite'] = tiles.USGSImagery;
  }

  // update observation counts and displayed observations
  $: {
    if (leafletMap) {
      timeSpanHistory;
      observationsDirty;

      // filter observations by timespans
      observationsSelected = getObservationsSelected(groupedObservations);
      observationsSelectedCount = countObservations(observationsSelected);

      // filter observations by map bounding box
      observationsDisplay = getObservationsDisplay(observationsSelected);
      observationsDisplayCount = countObservations(observationsDisplay);

      allPointsInMapStatus = areAllPointsInMap(coordinates, map);
      observationsDirty = false;
    }
  }

  // automatically toggle clusters/markers for max zoom of map
  $: {
    // switch to individual markers
    if (useMarkerCluster && zoomLevel + 1 >= maxZoom) {
      toggleMarkerModeButton.getButton().state('show-markers');
      useMarkerCluster = false;
      observationsDisplay = getObservationsDisplay(observationsDisplay);
    }

    // switch to clusters
    if (!useMarkerCluster && userSelectedMarkerType === 'clusters' && zoomLevel === maxZoom - 2) {
      toggleMarkerModeButton.getButton().state('show-clusters');
      useMarkerCluster = true;
      observationsDisplay = getObservationsDisplay(observationsDisplay);
    }
  }

  $: {
    if (leafletMap) {
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
      } else {
        coordinates = [];
      }

      // set noTaxa when all the added taxa are removed
      if (taxaHistory.length === 0) {
        noTaxa = true;
      } else if (taxaHistory.length === 1) {
        // recenter map after the first taxa is added
        if (noTaxa) {
          fitPointsInMap(coordinates, map);
          noTaxa = false;
        }
      }
    }
  }

  // ===================
  // map buttons
  // ===================

  $: if (fitBoundsButton) {
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

  $: if (toggleMarkerModeButton) {
    if (coordinates.length === 0) {
      toggleMarkerModeButton.getButton().disable();
    } else if (countObservations(observationsDisplay) > clusterLimit) {
      toggleMarkerModeButton.getButton().disable();
    } else {
      toggleMarkerModeButton.getButton().enable();
    }
  }

  let toggleMarkerModeStates = {
    states: [
      {
        stateName: 'show-markers',
        icon: '<span class="text-4xl font-black leading-5">&Colon;</span>',
        title: 'click to show clustered markers',
        onClick: function (control) {
          useMarkerCluster = true;
          userSelectedMarkerType = 'clusters';
          control.state('show-clusters');
          observationsDisplay = getObservationsDisplay(observationsDisplay);
          observationsDisplayCount = countObservations(observationsDisplay);
        }
      },
      {
        stateName: 'show-clusters',
        icon: '<span class="text-6xl leading-6">&middot;</span>',
        title: 'click to show individual markers',
        onClick: function (control) {
          useMarkerCluster = false;
          userSelectedMarkerType = 'markers';
          control.state('show-markers');
          observationsDisplay = getObservationsDisplay(observationsDisplay);
          observationsDisplayCount = countObservations(observationsDisplay);
        }
      }
    ]
  };

  // ===================
  // map
  // ===================
  function countObservations(observations) {
    if (Array.isArray(observations)) {
      return observations.length;
    } else {
      return [...observations].reduce((total, current) => {
        return total + current[1].length;
      }, 0);
    }
  }

  function getObservationsSelected(groupedObservations) {
    let observations;

    // if no time spans filters
    if (Object.keys(timeSpanHistory).length === 0) {
      observations = [...groupedObservations];
      // filter groupedObservations by spans filters
    } else {
      observations = new Map();
      groupedObservations.forEach((value, key) => {
        if (timeSpanHistory[key]) {
          observations.set(key, value);
        }
      });
    }

    return observations;
  }

  function getObservationsDisplay(groupedObservations) {
    let observations;
    if (Array.isArray(groupedObservations)) {
      observations = groupedObservations.filter((o) => isObservationInMap(o, map));
    } else {
      // if we are using marker clusters, flatten groupedObservations into an array
      if (useMarkerCluster) {
        let flatObservations = [];
        groupedObservations.forEach((values, key) => {
          values = values.filter((o) => isObservationInMap(o, map));
          flatObservations = flatObservations.concat(values);
        });
        observations = flatObservations;
        // if we are using individual markers, create a new Map
      } else {
        observations = new Map();
        groupedObservations.forEach((values, key) => {
          values = values.filter((o) => isObservationInMap(o, map));
          observations.set(key, values);
        });
      }
    }

    return observations;
  }

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
    maxZoom = map.getMaxZoom();

    map.on('zoomend', function () {
      zoomLevel = map.getZoom();
      observationsDirty = true;
    });

    map.on('moveend', function () {
      observationsDirty = true;
    });

    map.on('baselayerchange', function (e) {
      maxZoom = map.getMaxZoom();
    });
  });
</script>

<div class="w-full shadow rounded-none stats">
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Total Observations</div>
    <div class="stat-value">{coordinates.length}</div>
  </div>
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Selected Observations</div>
    <div class="stat-value">{observationsSelectedCount}</div>
  </div>
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Observations on Map</div>
    <div class="stat-value">{observationsDisplayCount}</div>
  </div>
</div>

<div style="width: 100%; height: 600px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <!-- base layers must be set up before MarkerCluster  -->
    <LayerControl baseLayersData={baseLayers} />
    <!-- marker clusters -->
    {#if useMarkerCluster}
      <MarkerCluster items={observationsDisplay} />
      <!-- individual markers -->
    {:else if Array.isArray(observationsDisplay)}
      {#each observationsDisplay as obs}
        <CircleMarker
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={obs.color}
          fillColor={obs.fillColor}
        >
          <MyPopup observation={obs} {projectPath} />
        </CircleMarker>
      {/each}
      <!-- individual markers grouped by time -->
    {:else}
      {#each [...observationsDisplay] as [key, observations]}
        {#each observations as obs}
          <CircleMarker
            latLng={[obs.latitude, obs.longitude]}
            radius={circleRadius}
            color={obs.color}
            fillColor={obs.fillColor}
          >
            <MyPopup observation={obs} {projectPath} />
          </CircleMarker>
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
      title="click to fit all observations on map"
    />
    <EasyButton bind:this={toggleMarkerModeButton} states={toggleMarkerModeStates} />
    <ScaleControl position="bottomleft" options={scaleControlOptions} />
  </LeafletMap>
</div>
