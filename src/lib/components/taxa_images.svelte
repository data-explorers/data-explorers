<script>
  export let observations;
  import groupBy from 'lodash.groupby';
  import TaxaImagesItem from '$lib/components/taxa_images_item.svelte';
  import { getMonthName } from '$lib/mapUtils';
  import { sortObservationsNewestFirst, sortObservationsOldestFirst } from '$lib/dataUtils';

  let page = 1;
  let limit = 24;
  let groupByValue = 'none';
  let groupByKeys = [];
  let orderByValue = 'newest';

  observations = observations.sort(sortObservationsNewestFirst);

  let observationsDisplay = [...observations.slice(0, page * limit)];

  $: showLoadMore = page * limit < observations.length;

  function createGroups(observations, groupByValue) {
    let groups;
    observations = observations.filter((o) => o.time_observed_at);
    if (groupByValue === 'month') {
      groups = groupBy(observations, function (o) {
        return new Date(o.time_observed_at).getMonth();
      });
    } else if (groupByValue === 'year') {
      groups = groupBy(observations, function (o) {
        return new Date(o.time_observed_at).getFullYear();
      });
    }
    return groups;
  }

  function createGroupKeys(groupedObject) {
    if (orderByValue === 'oldest') {
      return Object.keys(groupedObject);
    } else {
      return Object.keys(groupedObject).reverse();
    }
  }

  function createGroupObservations(groupedObject) {
    if (orderByValue === 'oldest') {
      return Object.values(groupedObject);
    } else {
      return Object.values(groupedObject).reverse();
    }
  }

  function loadMore() {
    page = page + 1;
    groupByKeys = [];
    observationsDisplay = observations.slice(0, page * limit);

    if (groupByValue !== 'none') {
      let tempGroups = createGroups(observationsDisplay, groupByValue);
      groupByKeys = createGroupKeys(tempGroups);
      observationsDisplay = createGroupObservations(tempGroups);
    }
  }

  function handleOrderBy() {
    groupByKeys = [];
    if (orderByValue === 'oldest') {
      observations = observations.sort(sortObservationsOldestFirst);
    } else {
      observations = observations.sort(sortObservationsNewestFirst);
    }
    observationsDisplay = [...observations.slice(0, page * limit)];

    if (groupByValue !== 'none') {
      let tempGroups = createGroups(observationsDisplay, groupByValue);
      groupByKeys = createGroupKeys(tempGroups);
      observationsDisplay = createGroupObservations(tempGroups);
    }
  }

  function handleGroupBy() {
    groupByKeys = [];
    observationsDisplay = [...observations.slice(0, page * limit)];

    if (groupByValue !== 'none') {
      let tempGroups = createGroups(observationsDisplay, groupByValue);
      groupByKeys = createGroupKeys(tempGroups);
      observationsDisplay = createGroupObservations(tempGroups);
    }
  }
</script>

<div class="prose max-w-none">
  <h3>Images</h3>

  <div class="mb-4 ">
    <div class="form-control inline-block mr-6">
      <label class="label inline" for="order">
        <span class="label-text">Order by</span>
      </label>
      <select
        bind:value={orderByValue}
        name="order"
        class="select select-bordered h-8	min-h-0"
        on:change={handleOrderBy}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
    <div class="form-control inline-block">
      <label class="label inline" for="group">
        <span class="label-text">Group by</span>
      </label>
      <select
        bind:value={groupByValue}
        name="group"
        class="select select-bordered h-8 min-h-0"
        on:change={handleGroupBy}
      >
        <option value="none">None</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    </div>
  </div>

  {#if groupByValue === 'none'}
    <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-3  items-end ">
      {#each observationsDisplay as observation}
        <TaxaImagesItem {observation} />
      {/each}
    </div>
  {:else}
    {#each groupByKeys as key, index}
      <h2>
        {#if groupByValue === 'month'}{getMonthName(Number(key))}{:else}{key}{/if}
      </h2>
      <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-3  items-end ">
        {#each observationsDisplay[index] as observation}
          <TaxaImagesItem {observation} />
        {/each}
      </div>
    {/each}
  {/if}

  <div class="grid justify-items-center mt-8">
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
</div>
