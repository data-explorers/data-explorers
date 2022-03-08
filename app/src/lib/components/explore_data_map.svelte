<script>
  import 'leaflet/dist/leaflet.css';
  import { createEventDispatcher } from 'svelte';
  import {
    LeafletMap,
    CircleMarker,
    Popup,
    Rectangle,
    ScaleControl,
    MarkerCluster,
    TileLayer
  } from '$lib/vendor/svelte-leaflet';
  import { onMount } from 'svelte';
  import { scaleControlOptions, isObservationInMap } from '$lib/mapUtils';
  import {
    getObservationsSelected,
    countObservations,
    countSpecies,
    getSpecies
  } from '$lib/dataUtils';
  import FitBoundsButton from '$lib/components/map_fit_bounds_button.svelte';
  import MapLayersControl from '$lib/components/map_layers_control.svelte';
  import ToggleMarkerTypeButton from '$lib/components/map_toggle_marker_type_button.svelte';

  export let mapOptions;
  // NOTE: groupedObservations are filtered by taxa and grouped by time spans
  export let groupedObservations;
  export let timeSpanHistory;
  export let showDemoMapLayer;
  export let taxaHistory;
  export let country;
  export let mapCenter;
  export let speciesDisplayCount;
  export let speciesList;
  export let project;

  let leafletMap;
  let map;
  let circleRadius = 7;
  let coordinates = [];
  let demoPolygon = [
    [0, 0],
    [0, 0]
  ];
  let useMarkerCluster = false;
  let userSelectedMarkerType = 'markers';
  let clusterLimit = 1000;
  let zoomLevel;
  let toggleMarkerModeButton;
  let observationsSelected = [];
  let observationsOnMap = [];
  let observationsOnMapCount = 0;
  let observationsDirty = false;
  let maxZoom = 0;
  let limitTaxaToSpecies = false

  const dispatch = createEventDispatcher();

  // update observation counts and observations
  $: {
    if (leafletMap) {
      timeSpanHistory;
      observationsDirty;

      // filter observations by timespans
      observationsSelected = getObservationsSelected(groupedObservations, timeSpanHistory);

      // filter observations by map bounding box
      observationsOnMap = getObservationsOnMap(observationsSelected);
      observationsOnMapCount = countObservations(observationsOnMap);

      // species data
      speciesList = getSpecies(observationsOnMap, limitTaxaToSpecies);
      speciesDisplayCount = speciesList.length;

      dispatch('updateStats', {
        observationsOnMapCount,
        speciesDisplayCount,
        speciesList,
        observationsOnMap
      });

      observationsDirty = false;
    }
  }

  // sets coordinates
  $: {
    if (leafletMap) {
      if (taxaHistory.length > 0) {
        if (Array.isArray(groupedObservations)) {
          coordinates = groupedObservations.map((o) => [o.latitude, o.longitude]);
        } else {
          let tempObservations = [];
          coordinates = groupedObservations.forEach((values, key) => {
            tempObservations = tempObservations.concat(values);
          });
          coordinates = tempObservations.map((o) => [o.latitude, o.longitude]);
        }
      } else {
        coordinates = [];
      }
    }
  }

  $: if (leafletMap) {
    // recenter and zoom map on a given coordinate
    if (mapCenter && mapCenter.longitude) {
      let map = leafletMap.getMap();
      map.flyTo([mapCenter.latitude, mapCenter.longitude], map.getMaxZoom() - 1);
      mapCenter = {};
    }
  }

  // ===================
  // map buttons
  // ===================

  function changeMarkerModeOnClick(e) {
    useMarkerCluster = e.detail.useMarkerCluster;
    userSelectedMarkerType = e.detail.userSelectedMarkerType;
    observationsOnMap = getObservationsOnMap(observationsOnMap);
  }

  function changeMarkerModeAutomatic(e) {
    useMarkerCluster = e.detail.useMarkerCluster;
    observationsOnMap = getObservationsOnMap(observationsOnMap);
  }

  // ===================
  // map
  // ===================

  // NOTE: can't move this function to separate file because adding
  // useMarkerCluster as a parameter and calling getObservationsOnMap in
  // reactive block that sets the observationsOnMap and counts breaks the
  // reactive block that checks observationsOnMapCount >= clusterLimit.
  function getObservationsOnMap(groupedObservations) {
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

  function handleMarkerClick(e, obs) {
    dispatch('markerClick', { observation_id: obs.id, latlng: e.detail.latlng });
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

<div style="width: 100%; height: 70vh;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <!-- base layers must be set up before MarkerCluster  -->
    <MapLayersControl {country} {project} />
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
      <MarkerCluster items={observationsOnMap} />
      <!-- individual markers -->
    {:else if Array.isArray(observationsOnMap)}
      {#each observationsOnMap as obs}
        <CircleMarker
          events={['click']}
          on:click={(e) => handleMarkerClick(e, obs)}
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={obs.color}
          fillColor={obs.fillColor}
        />
      {/each}
      <!-- individual markers grouped by time -->
    {:else}
      {#each [...observationsOnMap] as [key, observations]}
        {#each observations as obs}
          <CircleMarker
            events={['click']}
            on:click={(e) => handleMarkerClick(e, obs)}
            latLng={[obs.latitude, obs.longitude]}
            radius={circleRadius}
            color={obs.color}
            fillColor={obs.fillColor}
          />
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
      {observationsOnMapCount}
      {clusterLimit}
      {userSelectedMarkerType}
      {zoomLevel}
      {maxZoom}
    />
    <ScaleControl position="bottomleft" options={scaleControlOptions} />
  </LeafletMap>
</div>
