<script>
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { LeafletMap, TileLayer, Marker, Circle, Rectangle } from 'svelte-leafletjs';
  import Popup from '$lib/components/map_popup_observation.svelte';
  import {
    modulo,
    colorsSix,
    getMonthName,
    coldMonths,
    radiusZoom,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    colorsTen
  } from '$lib/mapUtils';

  export let observations;
  export let mapOptions;

  let leafletMap;
  let years;

  mapOptions = {
    center: [mapOptions.latitude || 0, mapOptions.longitude || 0],
    displayType: mapOptions.displayType || 'marker',
    color: mapOptions.color || '#3388ff',
    zoom: mapOptions.zoom || 0
  };

  if (mapOptions.displayType === 'month') {
    observations = observations.map((o) => {
      let dateObj = new Date(o.time_observed_at);
      let month = dateObj.getMonth();
      return {
        ...o,
        month: month + 1,
        color: colorsSix[modulo(month, 6)]
      };
    });
  } else if (mapOptions.displayType === 'year') {
    years = [
      ...new Set(observations.map((o) => new Date(o.time_observed_at).getFullYear()))
    ].sort();

    observations = observations.map((o) => {
      let dateObj = new Date(o.time_observed_at);
      let year = dateObj.getFullYear();
      return {
        ...o,
        year: year,
        color: colorsTen[modulo(years.indexOf(year), 10)]
      };
    });
  }

  let coordinates = observations.map((o) => [o.latitude, o.longitude]);

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
  $: if (leafletMap && mapOptions.displayType !== 'marker') {
    zoomLevel = leafletMap.getMap().getZoom();
  }

  $: if (leafletMap && mapOptions.displayType !== 'marker') circleRadius = radiusZoom(zoomLevel);
  $: if (leafletMap && mapOptions.displayType === 'month')
    rectangleLatitude = rectangleLatitudeZoom(zoomLevel);
  $: if (leafletMap && mapOptions.displayType === 'month')
    rectangleLongitude = rectangleLongitudeZoom(zoomLevel);

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

<div class="example" style="width: 100%; height: 400px;">
  <!-- {zoomLevel}, {circleRadius}, {rectangleLatitude}, {rectangleLongitude} -->
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    {#if mapOptions.displayType === 'marker'}
      {#each observations as obs}
        <Marker latLng={[obs.latitude, obs.longitude]}>
          <Popup observation={obs} />
        </Marker>
      {/each}
    {:else if mapOptions.displayType === 'circle'}
      {#each observations as obs}
        <Circle
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={mapOptions.color}
          fillColor={mapOptions.color}
        >
          <Popup observation={obs} />
        </Circle>
      {/each}
    {:else if mapOptions.displayType === 'year'}
      {#each observations as obs}
        <Circle
          latLng={[obs.latitude, obs.longitude]}
          radius={circleRadius}
          color={obs.color}
          fillColor={obs.color}
        >
          <Popup observation={obs} />
        </Circle>
      {/each}
    {:else}
      {#each observations as obs}
        {#if coldMonths.includes(obs.month)}
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

  {#if mapOptions.displayType === 'month'}
    <div class="map-legend mt-4">
      {#each colorsSix.concat(colorsSix) as color, index}
        <div class="mr-3 inline">
          {#if coldMonths.includes(index + 1)}
            <svg height="20" width="20" class="inline">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke={color}
                stroke-width="3"
                fill={color}
                fill-opacity=".20"
              />
            </svg><span>{getMonthName(index)}</span>
          {:else}
            <svg width="20" height="20" class="inline">
              <rect
                width="14"
                height="14"
                y="2"
                x="2"
                stroke={color}
                stroke-width="3"
                fill={color}
                fill-opacity=".20"
              />
            </svg><span>{getMonthName(index)}</span>
          {/if}
        </div>
      {/each}
    </div>
  {:else if mapOptions.displayType === 'year'}
    <div class="map-legend mt-4">
      {#each years as year, index}
        <div class="mr-3 inline">
          <svg height="20" width="20" class="inline">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke={colorsTen[modulo(index, 10)]}
              stroke-width="3"
              fill={colorsTen[modulo(index, 10)]}
              fill-opacity=".20"
            />
          </svg><span>{year}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
