<script>
  import { modulo, getMonthName, coldMonths } from '$lib/mapUtils';
  import CircleIcon from '$lib/components/svg/circle.svelte';
  import RectangleIcon from '$lib/components/svg/rectangle.svelte';

  export let mapOptions;
  export let handleTimeSpan;
  export let groupedObservations;
  export let handleFilters;
  export let allFilters;
</script>

<div class="form-control inline-block mt-4">
  <label class="label inline" for="group">
    <span class="label-text">Time Span</span>
  </label>
  <select
    bind:value={mapOptions.observationsTimeSpan}
    name="group"
    class="select select-bordered h-8 min-h-0"
    on:change={handleTimeSpan}
  >
    <option value="all">All</option>
    <option value="month">Monthly</option>
    <option value="year">Yearly</option>
  </select>
</div>

{#if Array.isArray(groupedObservations)}
  <div class="map-legend mt-2" />
{:else if mapOptions.observationsTimeSpan === 'month'}
  <div class="map-legend mt-2">
    {#each [...groupedObservations] as [month, obs]}
      <div class="mr-3 inline">
        <a href="#{month}" class:active={allFilters[month]} on:click|preventDefault={handleFilters}>
        {#if mapOptions.monthSeasonalMarkers}
          {#if coldMonths.includes(month + 1)}
            <CircleIcon value={month} color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor} />
            <span data-filter={month}>{getMonthName(month)}</span>
          {:else}
            <RectangleIcon value={month} color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor}/>
            <span data-filter={month}>{getMonthName(month)}</span>
          {/if}
        {:else}
          <CircleIcon value={month} color={mapOptions.colorSchemeMonth[month] || mapOptions.defaultColor} />
          <span data-filter={month}>{getMonthName(month)}</span>
        {/if}
        </a>
      </div>
    {/each}
  </div>
{:else if mapOptions.observationsTimeSpan === 'year'}
  <div class="map-legend mt-2">
    {#each [...groupedObservations] as [year, obs]}
      <div class="mr-3 inline">
        <a href="#{year}" class:active={allFilters[year]} on:click|preventDefault={handleFilters}>
          {#if year === 'unknown'}
            <CircleIcon value={year} color={mapOptions.defaultColor} />
            <span data-filter={year}>{year}</span>
          {:else}
            <CircleIcon value={year} color={mapOptions.colorSchemeYear[modulo(year, mapOptions.colorSchemeYear.length)]} />
            <span data-filter={year}>{year}</span>
          {/if}
        </a>
      </div>
    {/each}
  </div>
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
