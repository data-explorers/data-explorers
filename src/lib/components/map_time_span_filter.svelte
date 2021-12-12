<script>
  import {
    modulo,
    getMonthName,
    coldMonths,
    defaultColor,
    twelveMonths,
    colorsEightDiverge
  } from '$lib/mapUtils';

  export let mapOptions;
  export let handleTimeSpan;
  export let groupedObservations;
  export let handleFilters;
  export let allFilters;

  let colorSchemeMonths = twelveMonths;
  let colorScheme = colorsEightDiverge;
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
{:else if mapOptions.observationsTimeSpan === 'year'}
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
