<script>
  // Use Map objects in #each blocks https://github.com/sveltejs/svelte/issues/5021
  import TaxaImagesItem from '$lib/components/taxa_images_item.svelte';
  import { getMonthName } from '$lib/mapUtils';
  import { sortObservations, groupObservationsbyTime } from '$lib/dataUtils';
  import ObservationModal from '$lib/components/observation_modal.svelte';
  import { createEventDispatcher } from 'svelte';

  export let observations;
  export let projectPath;
  export let taxon;
  export let showTaxaLink = true;

  $: observations = sortObservations(observations, orderByValue, timeSpanValue);
  $: observationsDisplay = observations.slice(0, page * limit);
  $: groupedObservations = groupObservationsbyTime(observationsDisplay, timeSpanValue);
  $: observationsDisplayIds = observationsDisplay.map((o) => o.id);
  $: showLoadMore = page * limit < observations.length;

  let page = 1;
  let limit = 24;
  let timeSpanValue = 'all';
  let orderByValue = 'newest';
  let modalOpen = false;
  let observationDisplay = {};
  const dispatch = createEventDispatcher();

  function loadMore() {
    page = page + 1;
    observations = sortObservations(observations, orderByValue, timeSpanValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = groupObservationsbyTime(observationsDisplay, timeSpanValue);
  }

  function handleOrderBy() {
    observations = sortObservations(observations, orderByValue, timeSpanValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = groupObservationsbyTime(observationsDisplay, timeSpanValue);
  }

  function selectTimeSpanHandler() {
    observations = sortObservations(observations, orderByValue, timeSpanValue);
    observationsDisplay = observations.slice(0, page * limit);
    groupedObservations = groupObservationsbyTime(observationsDisplay, timeSpanValue);
  }

  function changeObservation(e) {
    modalOpen = true;
    observationDisplay = observations.filter((o) => o.id === e.detail.observation_id)[0];
  }

  function prevSlide(e) {
    let currentIndex = observationsDisplayIds.indexOf(e.detail.observation_id);
    if (currentIndex === 0) {
      observationDisplay = observationsDisplay[observationsDisplay.length - 1];
    } else {
      observationDisplay = observationsDisplay[currentIndex - 1];
    }
  }

  function nextSlide(e) {
    let currentIndex = observationsDisplayIds.indexOf(e.detail.observation_id);
    if (currentIndex === observationsDisplay.length - 1) {
      observationDisplay = observationsDisplay[0];
    } else {
      observationDisplay = observationsDisplay[currentIndex + 1];
    }
  }

  function zoomToObservation(e) {
    dispatch('zoomToObservation', e.detail);
    modalOpen = false;
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
        <TaxaImagesItem
          {observation}
          on:thumbnailClick={changeObservation}
          {projectPath}
          {showTaxaLink}
        />
      {/each}
    </div>
  {:else}
    {#each [...groupedObservations] as [key, observations]}
      <h2>
        {#if timeSpanValue === 'month'}{getMonthName(key)}{:else}{key}{/if}
      </h2>
      <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-3  items-end ">
        {#each observations as observation}
          <TaxaImagesItem
            on:thumbnailClick={changeObservation}
            {observation}
            {projectPath}
            {showTaxaLink}
          />
        {/each}
      </div>
    {/each}
  {/if}

  <div class="grid justify-items-center mt-8">
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
</div>

{#if modalOpen}
  <ObservationModal
    on:prevClick={prevSlide}
    on:nextClick={nextSlide}
    on:click={() => (modalOpen = false)}
    on:closeModal={() => (modalOpen = false)}
    on:changeTaxon={() => (modalOpen = false)}
    on:zoomToObservation={zoomToObservation}
    observation={observationDisplay}
    observationsIds={observationsDisplayIds}
    {projectPath}
    {taxon}
  />
{/if}
