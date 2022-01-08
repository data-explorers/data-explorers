<script>
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import vegaEmbed from 'vega-embed';
  import {
    LeafletMap,
    CircleMarker,
    Rectangle,
    ScaleControl,
    MarkerCluster
  } from '$lib/vendor/svelte-leaflet';
  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';
  import barChartJson from '$lib/charts/bar_chart.json';
  import {
    coldMonths,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    getMonthName,
    scaleControlOptions,
    isObservationInMap
  } from '$lib/mapUtils';
  import {
    sortObservations,
    createGroupObservations,
    getObservationsSelected,
    countObservations,
    countSpecies,
    getSpecies
  } from '$lib/dataUtils';
  import { modulo, range } from '$lib/miscUtils';
  import FitBoundsButton from '$lib/components/map_fit_bounds_button.svelte';
  import MapLayersControl from '$lib/components/map_layers_control.svelte';
  import { tooltip } from '$lib/tooltip.js';
  import InfoIcon from '$lib/components/icons/info.svelte';
  import MapSpeciesList from '$lib/components/map_species_list.svelte';
  import ToggleMarkerTypeButton from '$lib/components/map_toggle_marker_type_button.svelte';

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
    groupedObservations = createGroupObservations(
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
      observationsDisplay = getObservationsDisplay(observationsSelected);
      observationsDisplayCount = countObservations(observationsDisplay);

      // species data
      speciesCount = countSpecies(observationsSelected);
      speciesList = getSpecies(observationsDisplay);
      speciesDisplayCount = speciesList.length;
      showSpeciesListIcon =
        speciesList.length > 1 ||
        (speciesList.length == 1 && speciesList[0]['taxon_id'] !== taxon.taxon_id);

      observationsDirty = false;
    }
  }

  // update charts
  $: {
    if (mounted && mapOptions.observationsTimeSpan === 'month') {
      let allMonths = [...project.observed_months];
      if (timeSpanHistory['unknown'] !== undefined) {
        allMonths.push('unknown');
      }

      // set default values for months that are observed
      chartData = allMonths.map((m) => {
        return { xValue: getMonthName(m), yValue: 0, opacity: 0 };
      });

      // fill chartData with real values
      groupedObservations.forEach((v, k) => {
        let index = allMonths.indexOf(k);
        let color = k === 'unknown' ? mapOptions.defaultColor : mapOptions.colorSchemeMonth[k];
        chartData[index] = {
          xValue: getMonthName(k),
          yValue: v.length,
          color: color,
          opacity: timeSpanHistory[k] ? 1 : inactiveOpacity
        };
      });

      barChartSpec['layer'][0]['mark']['width']['band'] = 1;
      barChartSpec['data']['values'] = chartData;

      drawChart(barChartSpec);
    } else if (mounted && mapOptions.observationsTimeSpan === 'year') {
      // get all years between first and last observations
      let allYears = range(project.observed_years[0], project.observed_years[1]);
      if (timeSpanHistory['unknown'] !== undefined) {
        allYears.push('unknown');
      }

      // set default values for years that are observed
      chartData = allYears.map((y) => {
        return { xValue: y, yValue: 0, opacity: 0 };
      });

      // fill chartData with real values
      groupedObservations.forEach((v, k) => {
        let index = allYears.indexOf(k);
        let color =
          k === 'unknown'
            ? mapOptions.defaultColor
            : mapOptions.colorSchemeYear[modulo(k, mapOptions.colorSchemeYear.length)];
        chartData[index] = {
          xValue: k,
          yValue: v.length,
          color: color,
          opacity: timeSpanHistory[k] ? 1 : inactiveOpacity
        };
      });

      // limit the width of the bands if there is small number of bars
      if (Object.keys(allYears).length <= 4) {
        barChartSpec['layer'][0]['mark']['width']['band'] = 0.6;
      } else {
        barChartSpec['layer'][0]['mark']['width']['band'] = 1;
      }
      barChartSpec['data']['values'] = chartData;

      drawChart(barChartSpec);
    } else if (mounted) {
      chartData = [
        {
          xValue: 'All',
          yValue: groupedObservations.length,
          color: mapOptions.defaultColor,
          opacity: 1
        }
      ];

      // limit the width of the band since there is only one bar
      barChartSpec['layer'][0]['mark']['width']['band'] = 0.6;
      barChartSpec['data']['values'] = chartData;
      drawChart(barChartSpec);
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
  let chartData;
  let inactiveOpacity = 0.25;
  let mounted = false;
  let barChartSpec = JSON.parse(JSON.stringify(barChartJson));
  let scaleControl;
  let useMarkerCluster = false;
  let userSelectedMarkerType = 'markers';
  let clusterLimit = 1000;
  let toggleMarkerModeButton;
  let observationsSelected = [];
  let observationsDisplay = [];
  let observationsDisplayCount = 0;
  let observationsSelectedCount = 0;
  let observationsDirty = false;
  let maxZoom = 0;
  let speciesCount = 0;
  let speciesDisplayCount = 0;
  let showSpeciesList = false;
  let speciesList = [];
  let showSpeciesListIcon = false;

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

  function updateShapeMarkers(zoomLevel) {
    // make rectangles change size as zoom changes
    rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
    rectangleLongitude = rectangleLongitudeZoom(zoomLevel);
  }

  function toggleSpeciesList() {
    showSpeciesList = !showSpeciesList;
  }

  // =====================
  // timespan filter
  // =====================

  function toggleTimeSpans(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);
    // update filters
    timeSpanHistory[targetFilter] = !timeSpanHistory[targetFilter];
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
      {#if observationsDisplayCount >= clusterLimit}
        <span
          use:tooltip
          class="text-red-600"
          title="Since there are over {clusterLimit} observations on the map, the map uses clustered markers."
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
    <div class="stat-title">Species on map</div>
    <div class="stat-value">
      {speciesDisplayCount}
      {#if showSpeciesListIcon}
        {#if showSpeciesList}
          <span use:tooltip title="click hide to species list" on:click={toggleSpeciesList}
            ><InfoIcon /></span
          >
        {:else}
          <span use:tooltip title="click show to species list" on:click={toggleSpeciesList}
            ><InfoIcon /></span
          >
        {/if}
      {/if}
    </div>
  </div>
</div>
<div id="taxa-map" style="width: 100%; height: 400px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <MapLayersControl country={project.country} />
    <!-- marker clusters -->
    {#if useMarkerCluster}
      <MarkerCluster items={observationsDisplay} />
      <!-- display observations as circles -->
    {:else if Array.isArray(observationsDisplay)}
      {#each observationsDisplay as obs}
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
      {#each [...observationsDisplay] as [year, observations]}
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
      {#each [...observationsDisplay] as [month, observations]}
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
      {observationsDisplayCount}
      {clusterLimit}
      {userSelectedMarkerType}
      {zoomLevel}
      {maxZoom}
    />
    <ScaleControl bind:this={scaleControl} position="bottomleft" options={scaleControlOptions} />
  </LeafletMap>
</div>
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
