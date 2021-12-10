<script>
  export let observations;
  import TaxaImagesItem from '$lib/components/taxa_images_item.svelte';
  import { getMonthName } from '$lib/mapUtils';
  import { sortObservations, setObservationsAndKeys } from '$lib/dataUtils';

  let page = 1;
  let limit = 100;
  let groupByValue = 'none';
  let groupByKeys = [];
  let orderByValue = 'newest';

  observations = sortObservations(observations, orderByValue);
  let observationsDisplay = [...observations.slice(0, page * limit)];
  ({ groupByKeys, observationsDisplay } = setObservationsAndKeys(
    observationsDisplay,
    orderByValue,
    groupByValue
  ));

  function loadMore() {
    page = page + 1;
    groupByKeys = [];
    observationsDisplay = observations.slice(0, page * limit);

    ({ groupByKeys, observationsDisplay } = setObservationsAndKeys(
    observationsDisplay,
    orderByValue,
    groupByValue
  ));
  }

  function handleOrderBy() {
    groupByKeys = [];
    observations = sortObservations(observations, orderByValue);
    observationsDisplay = [...observations.slice(0, page * limit)];

    ({ groupByKeys, observationsDisplay } = setObservationsAndKeys(
    observationsDisplay,
    orderByValue,
    groupByValue
  ));
  }

  function handleGroupBy() {
    groupByKeys = [];
    observationsDisplay = [...observations.slice(0, page * limit)];

    ({ groupByKeys, observationsDisplay } = setObservationsAndKeys(
    observationsDisplay,
    orderByValue,
    groupByValue
  ));
  }

  $: showLoadMore = page * limit < observations.length;
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
        {#if groupByValue === 'month'}{getMonthName(key)}{:else}{key}{/if}
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
