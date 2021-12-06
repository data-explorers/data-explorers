<script>
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { LeafletMap, TileLayer, Marker, Circle, Rectangle } from 'svelte-leafletjs';
  import Popup from '$lib/components/map_popup_observation.svelte';
  import {
    modulo,
    getMonthName,
    coldMonths,
    radiusZoom,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    colorsEightDiverge,
    colorsTwelveSequential
  } from '$lib/mapUtils';

  export let observations;
  export let mapOptions;

  let leafletMap;
  let availableYears;
  let availableMonths;
  let activeClasses = {};
  let defaultColor = '#3388ff';
  let colorSchemeMonths = colorsTwelveSequential;
  let colorScheme = colorsEightDiverge;

  // set default map values
  mapOptions = {
    center: [mapOptions.latitude || 0, mapOptions.longitude || 0],
    displayType: mapOptions.displayType || 'marker',
    color: mapOptions.color || defaultColor,
    zoom: mapOptions.zoom || 0
  };

  observations = observations.filter((o) => o.latitude && o.longitude);

  // add month data
  if (mapOptions.displayType === 'month') {
    availableMonths = [
      ...new Set(
        observations
          .filter((o) => o.time_observed_at)
          .map((o) => new Date(o.time_observed_at).getMonth())
      )
    ].sort((a, b) => a - b);

    let missingDate = observations.filter((o) => !o.time_observed_at);
    if (missingDate.length > 0) {
      availableMonths.push('unknown');
    }
    availableMonths.forEach((month) => (activeClasses[month] = true));

    observations = observations.map((o) => {
      let dateObj = o.time_observed_at && new Date(o.time_observed_at);
      let month = o.time_observed_at ? dateObj.getMonth() : 'unknown';
      return {
        ...o,
        month: month,
        color: colorSchemeMonths[month] || defaultColor
      };
    });
    // add year data
  } else if (mapOptions.displayType === 'year') {
    availableYears = [
      ...new Set(
        observations
          .filter((o) => o.time_observed_at)
          .map((o) => new Date(o.time_observed_at).getFullYear())
      )
    ].sort((a, b) => a - b);

    let missingDate = observations.filter((o) => !o.time_observed_at);
    if (missingDate.length > 0) {
      availableYears.push('unknown');
    }

    availableYears.forEach((year) => (activeClasses[year] = true));

    observations = observations.map((o) => {
      let dateObj = o.time_observed_at && new Date(o.time_observed_at);
      let year = o.time_observed_at ? dateObj.getFullYear() : 'unknown';
      let color = o.time_observed_at
        ? colorScheme[modulo(availableYears.indexOf(year), colorScheme.length)]
        : defaultColor;
      return {
        ...o,
        year: year,
        color: color
      };
    });
  }

  let selectedFilters = [];
  let filteredObservations = [...observations];

  function handleFilters(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);

    if (selectedFilters.includes(targetFilter)) {
      selectedFilters = selectedFilters.filter((item) => item !== targetFilter);
    } else {
      selectedFilters.push(targetFilter);
    }
    activeClasses[targetFilter] = !activeClasses[targetFilter];

    if (selectedFilters.length == 0) {
      filteredObservations = [...observations];
    } else {
      filteredObservations = [
        ...observations.filter((o) => !selectedFilters.includes(o[mapOptions.displayType]))
      ];
    }
  }

  // const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // const tileUrl = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
  // const tileUrl = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
  const tileUrl = 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    // attribution: '© OpenStreetMap contributors'
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  };

  let zoomLevel = 0;
  let circleRadius = 1;
  let rectangleLatitude = 1;
  let rectangleLongitude = 1;

  // make certain variables reactive so they chamge values when user zooms
  // in and out of map
  $: if (leafletMap && mapOptions.displayType !== 'marker') {
    zoomLevel = leafletMap.getMap().getZoom();
  }
  $: if (leafletMap && mapOptions.displayType !== 'marker') circleRadius = radiusZoom(zoomLevel);
  $: if (leafletMap && mapOptions.displayType === 'month')
    rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
  $: if (leafletMap && mapOptions.displayType === 'month')
    rectangleLongitude = rectangleLongitudeZoom(zoomLevel);

  let coordinates = filteredObservations.map((o) => [o.latitude, o.longitude]);

  onMount(() => {
    if (coordinates.length > 0) {
      leafletMap.getMap().fitBounds(coordinates);
    }

    leafletMap.getMap().on('zoomend', function () {
      if (mapOptions.displayType !== 'marker') {
        zoomLevel = leafletMap.getMap().getZoom();
        circleRadius = radiusZoom(zoomLevel);
      }
      if (mapOptions.displayType === 'month') {
        rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
        rectangleLongitude = rectangleLongitudeZoom(zoomLevel);
      }
    });
  });
</script>

<div style="width: 100%; height: 400px;">
  <!-- {zoomLevel}, {circleRadius}, {rectangleLatitude}, {rectangleLongitude} -->
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    <!-- display markers -->
    {#if mapOptions.displayType === 'marker'}
      {#each observations as obs}
        <Marker latLng={[obs.latitude, obs.longitude]}>
          <Popup observation={obs} />
        </Marker>
      {/each}

      <!-- display circles -->
    {:else if mapOptions.displayType === 'circle'}
      {#each filteredObservations as obs}
        <Circle
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={mapOptions.color}
          fillColor={mapOptions.color}
        >
          <Popup observation={obs} />
        </Circle>
      {/each}

      <!-- display circles by year -->
    {:else if mapOptions.displayType === 'year'}
      {#each filteredObservations as obs}
        <Circle
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={obs.color}
          fillColor={obs.color}
        >
          <Popup observation={obs} />
        </Circle>
      {/each}

      <!-- display circle and rectanles by month -->
    {:else}
      {#each filteredObservations as obs}
        {#if coldMonths.includes(obs.month + 1)}
          <Circle
            latLng={[obs.latitude, obs.longitude]}
            radius={circleRadius}
            color={obs.color}
            fillColor={obs.color}
          >
            <Popup observation={obs} />
          </Circle>
        {:else}
          <Rectangle
            latLngBounds={[
              [obs.latitude - rectangleLatitude, obs.longitude - rectangleLongitude],
              [obs.latitude + rectangleLatitude, obs.longitude + rectangleLongitude]
            ]}
            color={obs.color}
            fillColor={obs.color}
          >
            <Popup observation={obs} />
          </Rectangle>
        {/if}
      {/each}
    {/if}
  </LeafletMap>
</div>
<!-- map legend -->
{#if mapOptions.displayType === 'month'}
  <div class="map-legend mt-4">
    {#each availableMonths as month, index}
      <div class="mr-3 inline">
        <a
          href="#{month}"
          class:active={activeClasses[month]}
          on:click|preventDefault={handleFilters}
        >
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
                data-filter={index}
              />
            </svg><span data-filter={month}>{getMonthName(month)}</span>
          {/if}
        </a>
      </div>
    {/each}
  </div>
{:else if mapOptions.displayType === 'year'}
  <div class="map-legend mt-4">
    {#each availableYears as year, index}
      <div class="mr-3 inline">
        <a
          href="#{year}"
          class:active={activeClasses[year]}
          on:click|preventDefault={handleFilters}
        >
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
                stroke={colorScheme[modulo(index, colorScheme.length)]}
                stroke-width="3"
                fill={colorScheme[modulo(index, colorScheme.length)]}
                fill-opacity=".20"
              />
            </svg><span data-filter={year}>{year}</span>
          {/if}
        </a>
      </div>
    {/each}
  </div>
{/if}

<style>
  .map-legend a {
    opacity: 0.4;
  }
  .map-legend a.active {
    opacity: 1;
  }
</style>
