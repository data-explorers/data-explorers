<script>
  import CircleIcon from '$lib/components/icons/circle.svelte';
  import { pluralize } from '$lib/formatUtils';
  import { fade } from 'svelte/transition';
  import { getObservedSpecies } from '$lib/dataUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { base } from '$app/paths';

  export let taxon;
  export let taxa;
  export let toggleTaxon;
  export let removeTaxon;
  export let projectPath;
  export let toggleInatGrid;
  export let toggleInatTaxonRange;
  export let taxaHistory;

  let showMore = false;
  let observedSpecies = getObservedSpecies(taxa, taxon);
  let index = taxaHistory.map((t) => t.taxon_id).indexOf(taxon.taxon_id);
  let showInatTaxonRange = taxaHistory[index].showInatTaxonRange;
  let showInatGrid = taxaHistory[index].showInatGrid;
  let showObservedSpecies =
    observedSpecies.length > 1 ||
    (observedSpecies.length == 1 && observedSpecies[0].taxon_id == !taxon.taxon_id);
</script>

<div class="border relative filter">
  <div class="image-card-side" class:active={taxon.active} in:fade out:fade>
    <figure>
      {#if taxon.image_url}
        <img src={taxon.image_url.replace('medium', 'square')} alt="photo of {taxon.taxon_name}" />
      {:else}
        <img src="{base}/images/missing-image.png" alt="" />
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

  <ul class="text-sm submenu bg-gray-100 grid grid-cols-3" class:active={taxon.active}>
    <li on:click={() => (showMore = !showMore)}>
      {#if showMore}Less{:else}More{/if} info
    </li>
    <li data-taxon-id={taxon.taxon_id} on:click={toggleTaxon}>
      {#if taxon.active}Hide{:else}Show{/if}
    </li>
    <li data-taxon-id={taxon.taxon_id} on:click={removeTaxon}>Delete</li>
  </ul>

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
        <input
          type="checkbox"
          class="mr-1"
          bind:checked={showInatGrid}
          on:click={() => toggleInatGrid(taxon.taxon_id)}
        />all iNaturalist observations
      </label>
      <label class="cursor-pointer block">
        <input
          type="checkbox"
          class="mr-1"
          bind:checked={showInatTaxonRange}
          on:click={() => toggleInatTaxonRange(taxon.taxon_id)}
        />Taxon range
      </label>

      {#if showObservedSpecies}
        <span class="font-medium mt-2 inline-block">{observedSpecies.length} observed species</span>
        <ul class="observed-species">
          {#each observedSpecies as species}
            <li>{@html formatTaxonDisplayName(species, true, false, true)}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  ul.submenu,
  ul.observed-species {
    margin: 0;
  }

  .observed-species li {
    margin: 0;
    padding: 0;
  }

  .submenu {
    justify-items: center;
    list-style: none;
    padding: 0;
  }

  .submenu li {
    cursor: pointer;
  }

  .submenu li:hover {
    text-decoration: underline;
  }

  .image-card-side,
  .card-more-content {
    opacity: 0.3;
  }

  .submenu {
    opacity: 0.6;
  }

  .image-card-side.active,
  .card-more-content.active,
  .submenu.active {
    opacity: 1;
  }

  .image-card-side {
    border-width: 0;
  }

  .image-card-side-body {
    padding: 5px 10px;
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
