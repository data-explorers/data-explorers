<script>
  import 'leaflet/dist/leaflet.css';
  import { createEventDispatcher, onMount } from 'svelte';
  import vegaEmbed from 'vega-embed';
  import {
    LeafletMap,
    CircleMarker,
    Rectangle,
    ScaleControl,
    MarkerCluster
  } from '$lib/vendor/svelte-leaflet';
  import {
    coldMonths,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    scaleControlOptions,
    isObservationInMap
  } from '$lib/mapUtils';
  import {
    sortObservations,
    groupObservationsbyTime,
    getObservationsSelected,
    countObservations,
    countSpecies,
    getSpecies,
    updateTimeSpans
  } from '$lib/dataUtils';
  import { modulo } from '$lib/miscUtils';
  import { tooltip } from '$lib/tooltip.js';
  import {
    setupTaxaAllChart,
    setupTaxaMonthChart,
    setupTaxaYearChart
  } from '$lib/charts/chartUtils';

  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';
  import FitBoundsButton from '$lib/components/map_fit_bounds_button.svelte';
  import MapLayersControl from '$lib/components/map_layers_control.svelte';
  import MapSpeciesList from '$lib/components/map_species_list.svelte';
  import ToggleMarkerTypeButton from '$lib/components/map_toggle_marker_type_button.svelte';

  import barChartJson from '$lib/charts/bar_chart.json';

  export let observations;
  export let mapOptions;
  export let mapCenter;
  export let project;
  export let taxon;

  // load and filter observations every time taxa changes
  $: {
    observations = observations.filter((o) => o.latitude && o.longitude);
    coordinates = observations.map((o) => [o.latitude, o.longitude]);
    timeSpanHistory = {};
  }

  // sort and group observations
  $: {
    timeSpanHistory;

    sortedObservations = sortObservations(
      observations,
      orderByValue,
      mapOptions.observationsTimeSpan
    );
    groupedObservations = groupObservationsbyTime(
      sortedObservations,
      mapOptions.observationsTimeSpan
    );

    if (mapOptions.observationsTimeSpan !== 'all') {
      // create timeSpanHistory if it doesn't already exist
      if (Object.keys(timeSpanHistory).length === 0) {
        groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
      }
    }
  }

  $: if (leafletMap) {
    zoomMapToFitMarkers(coordinates);
  }

  // update observation counts and displayed observations
  $: {
    if (leafletMap) {
      timeSpanHistory;
      observationsDirty;

      // filter observations by timespans
      observationsSelected = getObservationsSelected(groupedObservations, timeSpanHistory);
      observationsSelectedCount = countObservations(observationsSelected);

      // filter observations by map bounding box
      observationsOnMap = getObservationsOnMap(observationsSelected);
      observationsOnMapCount = countObservations(observationsOnMap);

      // species data
      speciesCount = countSpecies(observationsSelected);
      speciesList = getSpecies(observationsOnMap);
      speciesDisplayCount = speciesList.length;
      showSpeciesListInput =
        speciesList.length > 1 ||
        (speciesList.length == 1 && speciesList[0]['taxon_id'] !== taxon.taxon_id);

      observationsDirty = false;
    }
  }

  // format data for charts
  $: if (mounted && !syncMapAndCharts) {
    if (mapOptions.observationsTimeSpan === 'month') {
      let spec = setupTaxaMonthChart(
        barChartSpec,
        inactiveOpacity,
        timeSpanHistory,
        mapOptions,
        groupedObservations,
        project
      );

      drawChart(spec);
    } else if (mapOptions.observationsTimeSpan === 'year') {
      let spec = setupTaxaYearChart(
        barChartSpec,
        inactiveOpacity,
        timeSpanHistory,
        mapOptions,
        groupedObservations,
        project
      );

      drawChart(spec);
    } else if (mapOptions.observationsTimeSpan === 'all') {
      let spec = setupTaxaAllChart(barChartSpec, mapOptions, groupedObservations);
      drawChart(spec);
    }
  }

  // format data for synced charts
  $: if (mounted && syncMapAndCharts) {
    if (mapOptions.observationsTimeSpan === 'month') {
      let spec = setupTaxaMonthChart(
        barChartSpec,
        inactiveOpacity,
        timeSpanHistory,
        mapOptions,
        observationsOnMap,
        project
      );

      drawChart(spec);
    } else if (mapOptions.observationsTimeSpan === 'year') {
      let spec = setupTaxaYearChart(
        barChartSpec,
        inactiveOpacity,
        timeSpanHistory,
        mapOptions,
        observationsOnMap,
        project
      );

      drawChart(spec);
    } else if (mapOptions.observationsTimeSpan === 'all') {
      let spec = setupTaxaAllChart(barChartSpec, mapOptions, observationsOnMap);
      drawChart(spec);
    }
  }

  // recenter and zoom map to center an observation on the map
  $: if (leafletMap) {
    if (mapCenter && mapCenter.longitude) {
      document.getElementById('taxa-map').scrollIntoView();
      map.flyTo([mapCenter.latitude, mapCenter.longitude], map.getMaxZoom() - 1);
      mapCenter = {};
    }
  }

  let leafletMap;
  let map;
  let timeSpanHistory = {};
  let zoomLevel = 0;
  let circleRadius = 8;
  let rectangleLatitude = 1;
  let rectangleLongitude = 1;
  let orderByValue = 'oldest';
  let coordinates = [];
  let groupedObservations = [];
  let sortedObservations = [];
  const dispatch = createEventDispatcher();
  let inactiveOpacity = 0.25;
  let mounted = false;
  let barChartSpec = JSON.parse(JSON.stringify(barChartJson));
  let scaleControl;
  let useMarkerCluster = false;
  let userSelectedMarkerType = 'markers';
  let clusterLimit = 1000;
  let toggleMarkerModeButton;
  let observationsSelected = [];
  let observationsOnMap = [];
  let observationsOnMapCount = 0;
  let observationsSelectedCount = 0;
  let observationsDirty = false;
  let maxZoom = 0;
  let speciesCount = 0;
  let speciesDisplayCount = 0;
  let showSpeciesList = false;
  let speciesList = [];
  let showSpeciesListInput = false;
  let syncMapAndCharts = false;

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

  function updateShapeMarkers(zoomLevel) {
    // make rectangles change size as zoom changes
    rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
    rectangleLongitude = rectangleLongitudeZoom(zoomLevel);
  }

  // =====================
  // timespan filter
  // =====================

  function toggleTimeSpans(e) {
    timeSpanHistory = updateTimeSpans(e, timeSpanHistory);
  }

  function selectTimeSpanHandler() {
    // reset all time span filters when changing time span types
    timeSpanHistory = {};
  }

  // =====================
  // timespan filter
  // =====================

  function handleMarkerClick(e, obs) {
    dispatch('markerClick', { observation_id: obs.id, latlng: e.detail.latlng });
  }

  function zoomMapToFitMarkers(coordinates) {
    //
    // fitPointsInMap does not dispatch message.
    if (coordinates.length > 0) {
      map.fitBounds(coordinates);
      dispatch('doneLoading');
    } else {
      dispatch('doneLoading');
    }
  }

  // =====================
  // charts
  // =====================

  function drawChart(spec) {
    vegaEmbed('#observations-chart', spec, { actions: false })
      .then((result) => {})
      .catch(console.warn);
  }

  // =====================
  // lifecycle
  // =====================

  onMount(() => {
    mounted = true;
    map = leafletMap.getMap();
    zoomLevel = map.getZoom();
    maxZoom = map.getMaxZoom();

    updateShapeMarkers(zoomLevel);

    map.on('zoomend', function () {
      zoomLevel = map.getZoom();
      observationsDirty = true;
      updateShapeMarkers(zoomLevel);
    });

    map.on('moveend', function () {
      observationsDirty = true;
    });
  });
</script>

<!-- stats -->
<div class="w-full rounded-none border stats">
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Observations</div>
    <div class="stat-value">{observationsSelectedCount}</div>
  </div>
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">
      Observations on map
      {#if observationsOnMapCount >= clusterLimit}
        <span
          use:tooltip
          class="text-red-600"
          title="Since there are over {clusterLimit} observations on the map, the map uses clustered markers."
          >*</span
        >
      {/if}
    </div>
    <div class="stat-value">{observationsOnMapCount}</div>
  </div>
  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Species</div>
    <div class="stat-value">{speciesCount}</div>
  </div>

  <div class="stat place-items-center place-content-center">
    <div class="stat-title">Species on map</div>
    <div class="stat-value">
      {speciesDisplayCount}
    </div>
  </div>
</div>
<div id="taxa-map" style="width: 100%; height: 400px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <MapLayersControl country={project.country} />
    <!-- marker clusters -->
    {#if useMarkerCluster}
      <MarkerCluster items={observationsOnMap} />
      <!-- display observations as circles -->
    {:else if Array.isArray(observationsOnMap)}
      {#each observationsOnMap as obs}
        <CircleMarker
          events={['click']}
          on:click={(e) => handleMarkerClick(e, obs)}
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={mapOptions.defaultColor}
          fillColor={mapOptions.defaultColor}
        />
      {/each}

      <!-- display observations as circles by year -->
    {:else if mapOptions.observationsTimeSpan === 'year'}
      {#each [...observationsOnMap] as [year, observations]}
        {#each observations as obs}
          <CircleMarker
            events={['click']}
            on:click={(e) => handleMarkerClick(e, obs)}
            latLng={[obs.latitude, obs.longitude]}
            radius={circleRadius}
            color={mapOptions.colorSchemeYear[modulo(year, mapOptions.colorSchemeYear.length)] ||
              mapOptions.defaultColor}
            fillColor={mapOptions.colorSchemeYear[
              modulo(year, mapOptions.colorSchemeYear.length)
            ] || mapOptions.defaultColor}
          />
        {/each}
      {/each}

      <!-- display observations as circle and rectangles by month -->
    {:else}
      {#each [...observationsOnMap] as [month, observations]}
        {#each observations as obs}
          {#if coldMonths.includes(obs.month + 1)}
            <CircleMarker
              events={['click']}
              on:click={(e) => handleMarkerClick(e, obs)}
              latLng={[obs.latitude, obs.longitude]}
              radius={circleRadius}
              color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}
              fillColor={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}
            />
          {:else}
            <Rectangle
              events={['click']}
              on:click={(e) => handleMarkerClick(e, obs)}
              latLngBounds={[
                [obs.latitude - rectangleLatitude, obs.longitude - rectangleLongitude],
                [obs.latitude + rectangleLatitude, obs.longitude + rectangleLongitude]
              ]}
              color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}
              fillColor={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}
            />
          {/if}
        {/each}
      {/each}
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
    <ScaleControl bind:this={scaleControl} position="bottomleft" options={scaleControlOptions} />
  </LeafletMap>
</div>

<label class="cursor-pointer mt-2 mr-3 inline-block">
  <input type="checkbox" bind:checked={syncMapAndCharts} />
  <span>Update charts as map changes</span>
</label>

{#if showSpeciesListInput}
  <label class="cursor-pointer mt-2 inline-block">
    <input type="checkbox" bind:checked={showSpeciesList} />
    <span>Show species list</span>
  </label>
{/if}
<br />

<MapSpeciesList {showSpeciesList} {speciesList} />

<!-- map legend -->
<TimeSpanFilters
  {mapOptions}
  {selectTimeSpanHandler}
  {groupedObservations}
  {toggleTimeSpans}
  {timeSpanHistory}
  activeTaxaCount={1}
/>

<div id="observations-chart" class="w-full mt-4" />

<style>
  .stat-value {
    @apply text-sm;
    font-weight: normal;
  }
  .stat {
    padding: 0.25rem 0.5rem;
    @apply text-sm;
  }

  .stat-title {
    white-space: normal;
    text-align: center;
  }
</style>
