<script>
  export let observations;
  import TaxaImagesItem from '$lib/components/taxa_images_item.svelte';
  import { getMonthName } from '$lib/mapUtils';
  import { sortObservations, createGroupObservations } from '$lib/dataUtils';

  let page = 1;
  let limit = 24;
  let timeSpanValue = 'all';
  let orderByValue = 'newest';

  // Use Map objects in #each blocks https://github.com/sveltejs/svelte/issues/5021

  // make these variables reactive so that they change as the taxon url changes
  $: observations = sortObservations(observations, orderByValue, timeSpanValue);
  $: observationsDisplay = observations.slice(0, page * limit);
  $: groupedObservations = createGroupObservations(observationsDisplay, timeSpanValue);

  function loadMore() {
    page = page + 1;
    observations = sortObservations(observations, orderByValue, timeSpanValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = createGroupObservations(observationsDisplay, timeSpanValue);
  }

  function handleOrderBy() {
    observations = sortObservations(observations, orderByValue, timeSpanValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = createGroupObservations(observationsDisplay, timeSpanValue);
  }

  function selectTimeSpanHandler() {
    observations = sortObservations(observations, orderByValue, timeSpanValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = createGroupObservations(observationsDisplay, timeSpanValue);
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
        <span class="label-text">Time Span</span>
      </label>
      <select
        bind:value={timeSpanValue}
        name="group"
        class="select select-bordered h-8 min-h-0"
        on:change={selectTimeSpanHandler}
      >
        <option value="all">All</option>
        <option value="month">Months</option>
        <option value="year">Years</option>
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
        {#if timeSpanValue === 'month'}{getMonthName(key)}{:else}{key}{/if}
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
