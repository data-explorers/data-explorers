<script>
  export let observations;
  import TaxaImagesItem from '$lib/components/taxa_images_item.svelte'
import { text } from 'svelte/internal';

  let page = 1;
  let limit = 24;
  let orderByOptions = [
    {value: 'newest', text: "Newest first"},
    {value: 'oldest', text: "Oldest first"}
  ]

  let orderByValue = orderByOptions[0]


  observations = observations.sort((a, b) => {
    return new Date(b.time_observed_at) - new Date(a.time_observed_at);
  });

  let observationsDisplay = [...observations.slice(0, page * limit)];

  function loadMore() {
    page = page + 1;
    observationsDisplay = observations.slice(0, page * limit);
  }

  function handleOrderBy() {
    console.log(orderByValue)
    if (orderByValue.value === 'oldest') {
      observations = observations.sort((a, b) => {
        return new Date(a.time_observed_at) - new Date(b.time_observed_at);
      });
    } else {
      observations = observations.sort((a, b) => {
        return new Date(b.time_observed_at) - new Date(a.time_observed_at);
      });
    }
    observationsDisplay = [...observations.slice(0, page * limit)];

  }

</script>

<h1>images</h1>

<div class="form-control w-full max-w-xs">
  <label class="label" for="order">
    <span class="label-text">Order by</span>
  </label>
  <select
    bind:value={orderByValue}
    name="order"
    class="select select-bordered w-full max-w-xs"
    on:change={handleOrderBy}
  >
    {#each orderByOptions as option}
    <option value={option}>{option.text}</option>
    {/each}
  </select>
</div>
{orderByValue.value}
  <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-1  items-center ">
    {#each observationsDisplay as observation}
      <TaxaImagesItem {observation} />
    {/each}
  </div>
    </div>
  {/each}
</div>

<div class="grid justify-items-center mt-8">
  <button class="btn" on:click={loadMore}>Load More</button>
</div>

<style>
  .grid img {
    /* width: 100%; */
  }

  .modal-box {
    /* width: 100%; */
  }

  .modal-box img {
    /* height: 85vh; */
    /* width: 100%; */
  }
</style>
