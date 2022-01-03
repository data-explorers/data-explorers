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
    LayerControl
  } from '$lib/vendor/svelte-leaflet';
  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';
  import barChartJson from '$lib/charts/bar_chart.json';
  import {
    coldMonths,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    getMonthName,
    getMapTiles,
    scaleControlOptions
  } from '$lib/mapUtils';
  import { sortObservations, createGroupObservations } from '$lib/dataUtils';
  import { modulo, range } from '$lib/miscUtils';

  export let observations;
  export let mapOptions;
  export let mapCenter;
  export let project;

  $: {
    observations = observations.filter((o) => o.latitude && o.longitude);
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
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
  }

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

  $: coordinates = observations
    .filter((o) => o.latitude && o.longitude)
    .map((o) => [o.latitude, o.longitude]);

  $: if (leafletMap) {
    zoomMapToFitMarkers(coordinates);
  }

  $: if (leafletMap && mapOptions.observationsTimeSpan === 'month') {
    // make rectangles change size as zoom changes
    zoomLevel = leafletMap.getMap().getZoom();
    rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
    rectangleLongitude = rectangleLongitudeZoom(zoomLevel);
  }

  $: if (leafletMap) {
    // recenter and zoom map on a given coordinate
    if (mapCenter && mapCenter.longitude) {
      document.getElementById('taxa-map').scrollIntoView();
      let map = leafletMap.getMap();
      map.flyTo([mapCenter.latitude, mapCenter.longitude], map.getMaxZoom() - 1);
      mapCenter = {};
    }
  }

  let leafletMap;
  let timeSpanHistory = {};
  let zoomLevel = 0;
  let circleRadius = 8;
  let rectangleLatitude = 1;
  let rectangleLongitude = 1;
  let orderByValue = 'oldest';
  let groupedObservations = [];
  let sortedObservations = [];
  const dispatch = createEventDispatcher();
  let chartData;
  let inactiveOpacity = 0.25;
  let mounted = false;
  let barChartSpec = JSON.parse(JSON.stringify(barChartJson));
  let scaleControl;
  let tiles = getMapTiles();
  let baseLayers = {
    Street: tiles.OpenStreetMap,
    Minimal: tiles.GBIFGeyser,
    Terrain: tiles.StamenTerrain
  };
  if (project.country === 'USA') {
    baseLayers['Satellite'] = tiles.USGSImagery;
  }

  function toggleTimeSpans(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);
    timeSpanHistory[targetFilter] = !timeSpanHistory[targetFilter];
  }

  function selectTimeSpanHandler() {
    timeSpanHistory = {};
    observations = observations;
  }

  function handleMarkerClick(e, obs) {
    dispatch('markerClick', { observation_id: obs.id, latlng: e.detail.latlng });
  }

  function zoomMapToFitMarkers(coordinates) {
    if (coordinates.length > 0) {
      leafletMap.getMap().fitBounds(coordinates);
      dispatch('doneLoading');
    } else {
      dispatch('doneLoading');
    }
  }

  function drawChart(spec) {
    vegaEmbed('#observations-chart', spec, { actions: false })
      .then((result) => {})
      .catch(console.warn);
  }

  // =====================
  // init
  // =====================

  onMount(() => {
    mounted = true;

    leafletMap.getMap().on('zoomend', function () {
      zoomLevel = leafletMap.getMap().getZoom();
      if (mapOptions.observationsTimeSpan === 'month') {
        rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
        rectangleLongitude = rectangleLongitudeZoom(zoomLevel);
      }
    });
  });
</script>

<div id="taxa-map" style="width: 100%; height: 400px;">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <!-- display observations as circles -->
    {#if Array.isArray(groupedObservations)}
      {#each groupedObservations as obs}
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
      {#each [...groupedObservations] as [year, observations]}
        {#if timeSpanHistory[year]}
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
        {/if}
      {/each}

      <!-- display observations as circle and rectangles by month -->
    {:else}
      {#each [...groupedObservations] as [month, observations]}
        {#if timeSpanHistory[month]}
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
        {/if}
      {/each}
    {/if}
    <ScaleControl bind:this={scaleControl} position="bottomleft" options={scaleControlOptions} />
    <LayerControl baseLayersData={baseLayers} />
  </LeafletMap>
</div>

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
