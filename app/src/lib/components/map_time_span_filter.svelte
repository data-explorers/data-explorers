<script>
  import { getMonthName, coldMonths } from '$lib/mapUtils';
  import { modulo } from '$lib/miscUtils';
  import CircleIcon from '$lib/components/icons/circle.svelte';
  import RectangleIcon from '$lib/components/icons/rectangle.svelte';

  export let mapOptions;
  export let selectTimeSpanHandler;
  export let groupedObservations;
  export let toggleTimeSpans;
  export let timeSpanHistory;
  export let activeTaxaCount;
</script>

<div class="form-control inline-block mt-4">
  <label class="label inline" for="group">
    <span class="label-text">Time Span</span>
  </label>
  <select
    disabled={activeTaxaCount === 0}
    bind:value={mapOptions.observationsTimeSpan}
    name="group"
    class="select select-bordered h-8 min-h-0"
    on:change={selectTimeSpanHandler}
  >
    <option value="all">All</option>
    <option value="month">Months</option>
    <option value="year">Years</option>
  </select>
</div>

{#if Array.isArray(groupedObservations)}
  <div class="map-legend mt-2" />
{:else if mapOptions.observationsTimeSpan === 'month'}
  <div class="map-legend mt-2">
    {#each [...groupedObservations] as [month, obs]}
      <div
        class="mr-4 inline-block filter"
        class:active={timeSpanHistory[month]}
        on:click={toggleTimeSpans}
        data-filter={month}
      >
        {#if mapOptions.monthSeasonalMarkers}
          {#if coldMonths.includes(month + 1)}
            <CircleIcon
              value={month}
              cursorPointer={true}
              color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}
            />
            <span data-filter={month}>{getMonthName(month)}</span>
          {:else}
            <RectangleIcon
              value={month}
              color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}
            />
            <span data-filter={month}>{getMonthName(month)}</span>
          {/if}
        {:else}
          <CircleIcon
            value={month}
            cursorPointer={true}
            color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}
          />
          <span data-filter={month}>{getMonthName(month)}</span>
        {/if}
      </div>
    {/each}
  </div>
{:else if mapOptions.observationsTimeSpan === 'year'}
  <div class="map-legend mt-2">
    {#each [...groupedObservations] as [year, obs]}
      <div
        class="mr-4 inline-block filter"
        class:active={timeSpanHistory[year]}
        on:click={toggleTimeSpans}
        data-filter={year}
      >
        {#if year === 'unknown'}
          <CircleIcon value={year} color={mapOptions.defaultColor} cursorPointer={true} />
          <span data-filter={year}>{year}</span>
        {:else}
          <CircleIcon
            value={year}
            cursorPointer={true}
            color={mapOptions.colorSchemeYear[modulo(year, mapOptions.colorSchemeYear.length)]}
          />
          <span data-filter={year}>{year}</span>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .filter {
    opacity: 0.4;
    cursor: pointer;
  }
  .filter.active {
    opacity: 1;
  }
</style>
