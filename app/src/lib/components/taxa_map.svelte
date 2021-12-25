<script>
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import vegaEmbed from 'vega-embed';
  import { LeafletMap, TileLayer, CircleMarker, Rectangle } from 'svelte-leafletjs';
  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';
  import barChartSpec from '$lib/charts/bar_chart.json';

  import {
    coldMonths,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    tileLayerOptions,
    tileUrl,
    getMonthName
  } from '$lib/mapUtils';
  import { sortObservations, createGroupObservations } from '$lib/dataUtils';
  import { modulo, range } from '$lib/miscUtils';

  export let observations;
  export let mapOptions;
  export let mapCenter;

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
    if (mapOptions.observationsTimeSpan === 'month') {
      // set chartData to 12 months of default values
      chartData = Array.from({ length: 12 }, (_, i) => ({
        xValue: getMonthName(i),
        yValue: 0,
        opacity: 0
      }));
      // fill chartData with real values
      groupedObservations.forEach((v, k) => {
        chartData[k] = {
          xValue: getMonthName(k),
          yValue: v.length,
          color: mapOptions.colorSchemeMonth[k],
          opacity: timeSpanHistory[k] ? 1 : inactiveOpacity
        };
      });

      barChartSpec['layer'][0]['mark']['width']['band'] = 1;
      barChartSpec['data']['values'] = chartData;

      drawChart(barChartSpec);
    } else if (mapOptions.observationsTimeSpan === 'year') {
      // get all years between first and last observations
      let years = [...groupedObservations.keys()].filter((year) => typeof year === 'number');
      let allYears = range(years[0], years[years.length - 1]);
      // set chartData to all years with default values
      chartData = Array.from({ length: allYears.length }, (_, i) => ({
        xValue: years[0] + i,
        yValue: 0,
        opacity: 1
      }));
      // fill chartData with real values
      groupedObservations.forEach((v, k) => {
        if (typeof k === 'number') {
          let index = allYears.indexOf(k);
          chartData[index] = {
            xValue: k,
            yValue: v.length,
            color: mapOptions.colorSchemeYear[modulo(k, mapOptions.colorSchemeYear.length)],
            opacity: timeSpanHistory[k] ? 1 : inactiveOpacity
          };
        }
      });

      // limit the width of the bands if there is small number of bars
      if (Object.keys(allYears).length <= 4) {
        barChartSpec['layer'][0]['mark']['width']['band'] = 0.6;
      } else {
        barChartSpec['layer'][0]['mark']['width']['band'] = 1;
      }
      barChartSpec['data']['values'] = chartData;

      drawChart(barChartSpec);
    } else {
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
      leafletMap.getMap().flyTo([mapCenter.latitude, mapCenter.longitude], 20);
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
    if (mapOptions.observationsTimeSpan !== 'all') {
      drawChart(barChartSpec);
    }

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
    <TileLayer url={tileUrl} options={tileLayerOptions} />
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
  </LeafletMap>
</div>

<!-- map legend -->
<TimeSpanFilters
  {mapOptions}
  {selectTimeSpanHandler}
  {groupedObservations}
  {toggleTimeSpans}
  {timeSpanHistory}
/>
<div id="observations-chart" class="w-full mt-4" />
