<script>
  import CircleIcon from '$lib/components/icons/circle.svelte';
  import XIcon from '$lib/components/icons/x.svelte';
  import { pluralize } from '$lib/formatUtils';
  import { fade, fly } from 'svelte/transition';
  import { tooltip } from '$lib/tooltip.js';
  import { getObservedSpecies } from '$lib/dataUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import Ellipse from '$lib/components/icons/ellipse.svelte';

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

<div class="border relative filter">
  <div class="filter-menu dropdown dropdown-end dropdown-top">
    <button tabindex="0" class="hover:bg-gray-200" data-taxon-id={taxon.taxon_id}>
      <Ellipse border={true} value={taxon.taxon_id} />
    </button>

    <ul tabindex="0" class="shadow border bg-base-100 border-2 py-2 px-4 menu dropdown-content ">
      <li data-taxon-id={taxon.taxon_id} on:click={toggleTaxon}>
        {#if taxon.active}Hide{:else}Show{/if} species
      </li>
      <li on:click={() => (showMore = !showMore)}>
        Show {#if showMore}less{:else}more{/if} info
      </li>
      <li data-taxon-id={taxon.taxon_id} on:click={removeTaxon}>Delete species</li>
    </ul>
  </div>
  <div class="image-card-side " class:active={taxon.active} in:fade out:fade>
    <figure>
      {#if taxon.image_url}
        <img src={taxon.image_url.replace('medium', 'square')} alt="photo of {taxon.taxon_name}" />
      {:else}
        <img src="/images/missing-image.png" alt="" />
      {/if}
    </figure>

    <div class="image-card-side-body">
      <div class="leading-normal" data-taxon-id={taxon.taxon_id}>
        <CircleIcon value={taxon.taxon_id} color={taxon.color} />
        <span>{taxon.taxon_name}</span><br />
        <span>{pluralize('observation', taxon.taxa_count)}</span><br />
      </div>
    </div>
  </div>
  {#if showMore}
    <div class="py-1 px-2 card-more-content" in:fade out:fade class:active={taxon.active}>
      <dl>
        <dt>link</dt>
        <dd><a href="{projectPath}/taxa/{taxon.taxon_id}">Species page</a></dd>
        <dt>taxonomic rank</dt>
        <dd>{taxon.rank}</dd>
      </dl>

      <span class="font-medium inline-block">Map layers</span>
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
        <span class="font-medium mt-2 inline-block">{observedSpecies.length} observed species</span>
        <ul class="observed-species">
          {#each observedSpecies as species}
            <li>{@html formatTaxonDisplayName(species, true)}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  ul.menu,
  ul.observed-species {
    margin: 0;
  }

  .menu li::before {
    content: none;
  }

  .observed-species li {
    margin: 0;
    padding-left: 20px;
  }

  .menu li {
    margin: 0;
    padding-left: 0;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu li:hover {
    text-decoration: underline;
  }
  .filter-menu {
    float: right;
    /* position: absolute; */
    top: 0;
    right: 0;
  }

  .image-card-side,
  .card-more-content {
    opacity: 0.5;
  }

  .image-card-side.active,
  .card-more-content.active {
    opacity: 1;
  }

  .image-card-side {
    border-width: 0;
    padding: 5px 0;
  }

  .image-card-side:hover {
    box-shadow: none;
  }

  dl {
    @apply mb-2;
  }

  dt {
    float: left;
    clear: left;
    @apply font-medium;
    padding-right: 0.5rem;
  }

  dt::after {
    content: ':';
  }
</style>
