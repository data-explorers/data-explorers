<script>
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { LeafletMap, TileLayer, Circle, Rectangle } from 'svelte-leafletjs';
  import Popup from '$lib/components/map_popup_observation.svelte';
  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';

  import {
    modulo,
    getMonthName,
    coldMonths,
    radiusZoom,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    colorsEightDiverge,
    twelveMonths,
    tileLayerOptions,
    tileUrl
  } from '$lib/mapUtils';
  import { sortObservations, createGroupObservations } from '$lib/dataUtils';

  export let observations;
  export let mapOptions;

  let leafletMap;
  let allFilters = {};
  let defaultColor = '#3388ff';
  let colorSchemeMonths = twelveMonths;
  let colorScheme = colorsEightDiverge;
  let zoomLevel = 0;
  let circleRadius = 1;
  let rectangleLatitude = 1;
  let rectangleLongitude = 1;
  let orderByValue = 'oldest';

  // set default map values
  mapOptions = {
    center: [mapOptions.latitude || 0, mapOptions.longitude || 0],
    color: mapOptions.color || defaultColor,
    zoom: mapOptions.zoom || 0,
    observationsTimeSpan: mapOptions.observationsTimeSpan || 'all'
  };

  observations = observations.filter((o) => o.latitude && o.longitude);
  observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
  let groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);
  if (mapOptions.observationsTimeSpan !== 'all') {
    groupedObservations.forEach((v, k) => (allFilters[k] = true));
  }

  function handleFilters(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);
    allFilters[targetFilter] = !allFilters[targetFilter];
  }

  function handleTimeSpan() {
    allFilters = {};
    observations = observations.filter((o) => o.latitude && o.longitude);
    observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (allFilters[k] = true));
    }
  }

  // =====================
  // map
  // =====================

  // make certain variables reactive so they chamge values when user zooms
  // in and out of map
  $: if (leafletMap) {
    zoomLevel = leafletMap.getMap().getZoom();
    circleRadius = radiusZoom(zoomLevel);

    rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
    rectangleLongitude = rectangleLongitudeZoom(zoomLevel);
  }

  // =====================
  // init
  // =====================

  let coordinates = observations.map((o) => [o.latitude, o.longitude]);

  onMount(() => {
    if (coordinates.length > 0) {
      leafletMap.getMap().fitBounds(coordinates);
    }

    leafletMap.getMap().on('zoomend', function () {
      zoomLevel = leafletMap.getMap().getZoom();
      circleRadius = radiusZoom(zoomLevel);
      if (mapOptions.observationsTimeSpan === 'month') {
        rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
        rectangleLongitude = rectangleLongitudeZoom(zoomLevel);
      }
    });
  });
</script>

<div style="width: 100%; height: 400px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    <!-- display observations as circles -->
    {#if Array.isArray(groupedObservations)}
      {#each groupedObservations as obs}
        <Circle
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={mapOptions.color}
          fillColor={mapOptions.color}
        >
          <Popup observation={obs} />
        </Circle>
      {/each}

      <!-- display observations as circles by year -->
    {:else if mapOptions.observationsTimeSpan === 'year'}
      {#each [...groupedObservations] as [year, observations]}
        {#if allFilters[year]}
          {#each observations as obs}
            <Circle
              latLng={[obs.latitude, obs.longitude]}
              radius={circleRadius}
              color={colorScheme[modulo(year, colorScheme.length)]}
              fillColor={colorScheme[modulo(year, colorScheme.length)]}
            >
              <Popup observation={obs} />
            </Circle>
          {/each}
        {/if}
      {/each}

      <!-- display observations as circle and rectangles by month -->
    {:else}
      {#each [...groupedObservations] as [month, observations]}
        {#if allFilters[month]}
          {#each observations as obs}
            {#if coldMonths.includes(obs.month + 1)}
              <Circle
                latLng={[obs.latitude, obs.longitude]}
                radius={circleRadius}
                color={colorSchemeMonths[month]}
                fillColor={colorSchemeMonths[month]}
              >
                <Popup observation={obs} />
              </Circle>
            {:else}
              <Rectangle
                latLngBounds={[
                  [obs.latitude - rectangleLatitude, obs.longitude - rectangleLongitude],
                  [obs.latitude + rectangleLatitude, obs.longitude + rectangleLongitude]
                ]}
                color={colorSchemeMonths[month]}
                fillColor={colorSchemeMonths[month]}
              >
                <Popup observation={obs} />
              </Rectangle>
            {/if}
          {/each}
        {/if}
      {/each}
    {/if}
  </LeafletMap>
</div>

<!-- map legend -->
<TimeSpanFilters {mapOptions} {handleTimeSpan} {groupedObservations} {handleFilters} {allFilters} />
