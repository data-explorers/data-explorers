<script>
  import 'leaflet/dist/leaflet.css';
  import {
    LeafletMap,
    CircleMarker,
    Popup,
    Rectangle,
    ScaleControl,
    MarkerCluster,
    EasyButton,
    TileLayer
  } from '$lib/vendor/svelte-leaflet';
  import MyPopup from '$lib/components/map_popup_observation.svelte';
  import { onMount } from 'svelte';
  import {
    scaleControlOptions,
    fitPointsInMap,
    isObservationInMap,
    getMapTiles
  } from '$lib/mapUtils';
  import { getObservationsSelected, countObservations, countSpecies } from '$lib/dataUtils';
  import { tooltip } from '$lib/tooltip.js';
  import FitBoundsButton from '$lib/components/map_fit_bounds_button.svelte';
  import MapLayersControl from '$lib/components/map_layers_control.svelte';
  import ToggleMarkerTypeButton from '$lib/components/map_toggle_marker_type_button.svelte';
import { values } from 'vega-lite/src/compile/axis/properties';

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
  let noTaxa = true;
  let useMarkerCluster = false;
  let userSelectedMarkerType = 'markers';
  let clusterLimit = 1000;
  let zoomLevel;
  let fitBoundsButton;
  let toggleMarkerModeButton;
  let observationsSelected = [];
  let observationsDisplay = [];
  let observationsDisplayCount = 0;
  let observationsSelectedCount = 0;
  let observationsDirty = false;
  let maxZoom = 0;
  let speciesCount = 0;
  let speciesDisplayCount = 0;

  let tiles = getMapTiles();
  let inatTaxonRange = tiles.InatTaxonRange;
  let inatGrid = tiles.InatGrid;

  // update observation counts and displayed observations
  $: {
    if (leafletMap) {
      timeSpanHistory;
      observationsDirty;

      // filter observations by timespans
      observationsSelected = getObservationsSelected(groupedObservations, timeSpanHistory);
      observationsSelectedCount = countObservations(observationsSelected);
      speciesCount = countSpecies(observationsSelected);

      // filter observations by map bounding box
      observationsDisplay = getObservationsDisplay(observationsSelected);
      observationsDisplayCount = countObservations(observationsDisplay);
      speciesDisplayCount = countSpecies(observationsDisplay);

      observationsDirty = false;
    }
  }

  $: {
    if (leafletMap) {
      if (taxaHistory.length > 0) {
        if(Array.isArray(groupedObservations)) {
          coordinates = groupedObservations.map((o) => [o.latitude, o.longitude]);
        } else {
          let tempObservations = []
          coordinates = groupedObservations.forEach((values, key)=> {
            tempObservations = tempObservations.concat(values)
          })
          coordinates = tempObservations.map((o) => [o.latitude, o.longitude]);
        }
      } else {
        coordinates = [];
      }
    }
  }

  // ===================
  // map buttons
  // ===================

  function changeMarkerModeOnClick(e) {
    useMarkerCluster = e.detail.useMarkerCluster;
    userSelectedMarkerType = e.detail.userSelectedMarkerType;
    observationsDisplay = getObservationsDisplay(observationsDisplay);
  }

  function changeMarkerModeAutomatic(e) {
    useMarkerCluster = e.detail.useMarkerCluster;
    observationsDisplay = getObservationsDisplay(observationsDisplay);
  }

  // ===================
  // map
  // ===================

  // NOTE: can't move this function to separate file because adding
  // useMarkerCluster as a parameter and calling getObservationsDisplay in
  // reactive block that sets the observationsDisplay and counts breaks the
  // reactive block that checks observationsDisplayCount >= clusterLimit.
  function getObservationsDisplay(groupedObservations) {
    let observations;
    if (Array.isArray(groupedObservations)) {
      observations = groupedObservations.filter((o) => isObservationInMap(o, map, L));
    } else {
      // if we are using marker clusters, flatten groupedObservations into an array
      if (useMarkerCluster) {
        let flatObservations = [];
        groupedObservations.forEach((values, key) => {
          values = values.filter((o) => isObservationInMap(o, map, L));
          flatObservations = flatObservations.concat(values);
        });
        observations = flatObservations;
        // if we are using individual markers, create a new Map
      } else {
        observations = new Map();
        groupedObservations.forEach((values, key) => {
          values = values.filter((o) => isObservationInMap(o, map, L));
          observations.set(key, values);
        });
      }
    }

    return observations;
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

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
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

<svelte:window on:resize={resizeMap} />

<div class="md:w-full rounded-none border stats">
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Observations</div>
    <div class="stat-value">{observationsSelectedCount}</div>
  </div>
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">
      Observations in map
      {#if observationsDisplayCount >= clusterLimit}
        <span
          use:tooltip
          class="text-red-600"
          title="Since there are over {clusterLimit} observations on the map, the map use clustered markers."
          >*</span
        >
      {/if}
    </div>
    <div class="stat-value">{observationsDisplayCount}</div>
  </div>
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Species</div>
    <div class="stat-value">{speciesCount}</div>
  </div>

  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Species in map</div>
    <div class="stat-value">{speciesDisplayCount}</div>
  </div>
</div>

<div style="width: 100%; height: 600px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <!-- base layers must be set up before MarkerCluster  -->
    <MapLayersControl {country} />
    {#each taxaHistory as taxon}
      {#if taxon.showInatTaxonRange}
        <TileLayer zIndex={201} url={taxon.InatTaxonRangeUrl} />
      {/if}
      {#if taxon.showInatGrid}
        <TileLayer zIndex={201} url={taxon.InatGridUrl} />
      {/if}
    {/each}
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
    <FitBoundsButton {map} {coordinates} />
    <ToggleMarkerTypeButton
      bind:this={toggleMarkerModeButton}
      on:changeMarkerModeOnClick={changeMarkerModeOnClick}
      on:changeMarkerModeAutomatic={changeMarkerModeAutomatic}
      {coordinates}
      {useMarkerCluster}
      {observationsDisplayCount}
      {clusterLimit}
      {userSelectedMarkerType}
      {zoomLevel}
      {maxZoom}
    />
    <ScaleControl position="bottomleft" options={scaleControlOptions} />
  </LeafletMap>
</div>

<style>
  .stat-title {
    white-space: normal;
  }
</style>
