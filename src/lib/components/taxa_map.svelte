<script>
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { LeafletMap, TileLayer, Circle, Rectangle } from 'svelte-leafletjs';
  import Popup from '$lib/components/map_popup_observation.svelte';
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
    observationsGroupBy: mapOptions.observationsGroupBy || 'none'
  };

  observations = observations.filter((o) => o.latitude && o.longitude);
  observations = sortObservations(observations, orderByValue, mapOptions.observationsGroupBy);
  let groupedObservations = createGroupObservations(observations, mapOptions.observationsGroupBy);
  if (mapOptions.observationsGroupBy !== 'none') {
    groupedObservations.forEach((v, k) => (allFilters[k] = true));
  }

  function handleFilters(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);
    allFilters[targetFilter] = !allFilters[targetFilter];
  }

  function handleGroupBy() {
    allFilters = {};
    observations = observations.filter((o) => o.latitude && o.longitude);
    observations = sortObservations(observations, orderByValue, mapOptions.observationsGroupBy);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsGroupBy);
    if (mapOptions.observationsGroupBy !== 'none') {
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
  }
  $: if (leafletMap && mapOptions.observationsGroupBy === 'month') {
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
      if (mapOptions.observationsGroupBy === 'month') {
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
    {:else if mapOptions.observationsGroupBy === 'year'}
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
<div class="form-control inline-block mt-4">
  <label class="label inline" for="group">
    <span class="label-text">Group by</span>
  </label>
  <select
    bind:value={mapOptions.observationsGroupBy}
    name="group"
    class="select select-bordered h-8 min-h-0"
    on:change={handleGroupBy}
  >
    <option value="none">None</option>
    <option value="month">Month</option>
    <option value="year">Year</option>
  </select>
</div>

{#if mapOptions.observationsGroupBy === 'month'}
  <div class="map-legend mt-2">
    {#each [...groupedObservations] as [month, obs]}
      <div class="mr-3 inline">
        <a href="#{month}" class:active={allFilters[month]} on:click|preventDefault={handleFilters}>
          {#if coldMonths.includes(month + 1)}
            <svg height="20" width="20" class="inline" data-filter={month}>
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke={colorSchemeMonths[month] || defaultColor}
                stroke-width="3"
                fill={colorSchemeMonths[month] || defaultColor}
                fill-opacity=".20"
                data-filter={month}
              />
            </svg><span data-filter={month}>{getMonthName(month)}</span>
          {:else}
            <svg width="20" height="20" class="inline" data-filter={month}>
              <rect
                width="14"
                height="14"
                y="2"
                x="2"
                stroke={colorSchemeMonths[month] || defaultColor}
                stroke-width="3"
                fill={colorSchemeMonths[month] || defaultColor}
                fill-opacity=".20"
                data-filter={month}
              />
            </svg><span data-filter={month}>{getMonthName(month)}</span>
          {/if}
        </a>
      </div>
    {/each}
  </div>
{:else if mapOptions.observationsGroupBy === 'year'}
  <div class="map-legend mt-2">
    {#each [...groupedObservations] as [year, obs]}
      <div class="mr-3 inline">
        <a href="#{year}" class:active={allFilters[year]} on:click|preventDefault={handleFilters}>
          {#if year === 'unknown'}
            <svg data-filter={year} height="20" width="20" class="inline">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke={defaultColor}
                stroke-width="3"
                fill={defaultColor}
                fill-opacity=".20"
              />
            </svg><span data-filter={year}>{year}</span>
          {:else}
            <svg data-filter={year} height="20" width="20" class="inline">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke={colorScheme[modulo(year, colorScheme.length)]}
                stroke-width="3"
                fill={colorScheme[modulo(year, colorScheme.length)]}
                fill-opacity=".20"
              />
            </svg><span data-filter={year}>{year}</span>
          {/if}
        </a>
      </div>
    {/each}
  </div>
{:else}
  <div class="map-legend mt-2"></div>
{/if}

<style>
  .map-legend a {
    opacity: 0.4;
    text-decoration: none;
  }
  .map-legend a.active {
    opacity: 1;
  }
</style>
