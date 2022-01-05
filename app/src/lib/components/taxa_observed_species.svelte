<script>
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';
  import { getObservedSpecies } from '$lib/dataUtils';
  import { base } from '$app/paths';

  export let taxon;
  export let projectPath;
  export let taxa;

  $: observedSpecies = getObservedSpecies(taxa, taxon);
  $: observedSpeciesDisplay = observedSpecies.slice(0, page * limit);
  $: showLoadMore = page * limit < observedSpecies.length;
  $: showObservedSpecies = (() => {
    let checkOneSpecies =
      observedSpecies.length == 1 && observedSpecies[0].taxon_id != taxon.taxon_id;
    return observedSpecies.length > 1 || checkOneSpecies;
  })();

  let page = 1;
  let limit = 20;

  function loadMore() {
    page = page + 1;
    observedSpeciesDisplay = observedSpecies.slice(0, page * limit);
  }
</script>

{#if showObservedSpecies}
  <h3>{observedSpecies.length} Observed species for {formatTaxonDisplayName(taxon)}</h3>
  <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
    {#each observedSpeciesDisplay as taxon}
      <div class="image-card-side">
        <a href="{projectPath}/taxa/{taxon.taxon_id}">
          <figure>
            {#if taxon.image_url}
              <img
                src={taxon.image_url.replace('medium', 'square')}
                alt="photo of {formatTaxonDisplayName(taxon)}"
              />
            {:else}
              <img src="{base}/images/missing-image.png" alt="" />
            {/if}
          </figure>
        </a>
        <a class="w-full" href="{projectPath}/taxa/{taxon.taxon_id}">
          <div class="image-card-side-body">
            {@html formatTaxonDisplayName(taxon, true)}<br />
            {pluralize('observation', taxon.taxa_count)}
          </div>
        </a>
      </div>
    {/each}
  </div>
  <div class="grid justify-items-center mt-8">
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
{/if}
