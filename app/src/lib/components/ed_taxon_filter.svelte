<script>
  import CircleIcon from '$lib/components/icons/circle.svelte';
  import XIcon from '$lib/components/icons/x.svelte';
  import { pluralize } from '$lib/formatUtils';
  import { fade, fly } from 'svelte/transition';
  import { tooltip } from '$lib/tooltip.js';
  import { getObservedSpecies } from '$lib/dataUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import ShowMore from '$lib/components/show_more.svelte';

  export let taxon;
  export let taxa;
  export let toggleTaxon;
  export let removeTaxon;
  export let projectPath;
  export let toggleInatGrid;
  export let toggleInatTaxonRange;

  let showMore = false;
  let observedSpecies = getObservedSpecies(taxa, taxon);
</script>

<div class="border relative filter" class:active={taxon.active} in:fade out:fade>
  <div class="image-card-side">
    <figure>
      {#if taxon.image_url}
        <img
          class="cursor-pointer"
          on:click={toggleTaxon}
          data-filter={taxon.taxon_id}
          src={taxon.image_url.replace('medium', 'square')}
          alt="photo of {taxon.taxon_name}"
        />
      {:else}
        <img src="/images/missing-image.png" alt="" />
      {/if}
    </figure>

    <div
      class="image-card-side-body cursor-pointer "
      on:click={toggleTaxon}
      data-filter={taxon.taxon_id}
    >
      <div class="leading-normal" data-filter={taxon.taxon_id}>
        <CircleIcon
          clickHandler={toggleTaxon}
          cursorPointer={true}
          value={taxon.taxon_id}
          color={taxon.color}
        />
        <span class="cursor-pointer" data-filter={taxon.taxon_id}>{taxon.taxon_name}</span><br />
        <span class="cursor-pointer" data-filter={taxon.taxon_id}>
          {pluralize('observation', taxon.taxa_count)}
        </span><br />
      </div>
    </div>
  </div>
  <ShowMore border={true} on:toggleShowMore={(e) => (showMore = e.detail.showMore)} />
  <button
    use:tooltip
    class="absolute close-button border border-1"
    title="click to delete species"
    data-taxon-id={taxon.taxon_id}
    on:click={removeTaxon}
  >
    <XIcon value={taxon.taxon_id} />
  </button>

  {#if showMore}
    <div class="py-1 px-2" in:fade out:fade>
      <a href="{projectPath}/taxa/{taxon.taxon_id}">Species page</a> <br />

      taxonomic rank: {taxon.rank}<br />

      <label class="cursor-pointer block">
        <input type="checkbox" class="mr-1" on:click={() => toggleInatGrid(taxon.taxon_id)} />all
        iNaturalist observations
      </label>
      <label class="cursor-pointer block">
        <input
          type="checkbox"
          class="mr-1"
          on:click={() => toggleInatTaxonRange(taxon.taxon_id)}
        />Taxon range
      </label>
      {#if observedSpecies.length > 0}
        {observedSpecies.length} observed species
        <ul>
          {#each observedSpecies as species}
            <li>{@html formatTaxonDisplayName(species, true)}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  ul {
    margin-top: 0;
  }

  li {
    margin: 0;
  }
  .close-button {
    top: 25px;
    right: 0;
  }

  .filter {
    opacity: 0.5;
  }

  .filter.active {
    opacity: 1;
  }

  .image-card-side {
    border-width: 0;
  }

  .image-card-side-body {
    margin-right: 35px;
  }

  .image-card-side:hover {
    box-shadow: none;
  }
</style>
