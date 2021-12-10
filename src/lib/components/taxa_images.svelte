<script>
  export let observations;
  import TaxaImagesItem from '$lib/components/taxa_images_item.svelte';
  import { getMonthName } from '$lib/mapUtils';
  import { sortObservations, createGroupObservations } from '$lib/dataUtils';

  let page = 1;
  let limit = 24;
  let groupByValue = 'none';
  let orderByValue = 'newest';

  observations = sortObservations(observations, orderByValue, groupByValue);
  let observationsDisplay = observations.slice(0, page * limit);
  //  Map objects in #each blocks https://github.com/sveltejs/svelte/issues/5021
  let groupedObservations = createGroupObservations(observationsDisplay, groupByValue);

  function loadMore() {
    page = page + 1;
    observations = sortObservations(observations, orderByValue, groupByValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = createGroupObservations(observationsDisplay, groupByValue);
  }

  function handleOrderBy() {
    observations = sortObservations(observations, orderByValue, groupByValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = createGroupObservations(observationsDisplay, groupByValue);
  }

  function handleGroupBy() {
    observations = sortObservations(observations, orderByValue, groupByValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = createGroupObservations(observationsDisplay, groupByValue);
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

  {#if Array.isArray(groupedObservations)}
    <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-3  items-end ">
      {#each groupedObservations as observation}
        <TaxaImagesItem {observation} />
      {/each}
    </div>
  {:else}
    {#each [...groupedObservations] as [key, observations]}
      <h2>
        {#if groupByValue === 'month'}{getMonthName(key)}{:else}{key}{/if}
      </h2>
      <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-3  items-end ">
        {#each observations as observation}
          <TaxaImagesItem {observation} />
        {/each}
      </div>
    {/each}
  {/if}

  <div class="grid justify-items-center mt-8">
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
</div>
