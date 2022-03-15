<script>
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';
  import { getObservedSpecies } from '$lib/dataUtils';
  import { base } from '$app/paths';
  import TaxaCardSide from '$lib/components/taxa_card_side.svelte';
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

  let taxaPath = `${projectPath}/taxa`;

  function loadMore() {
    page = page + 1;
    observedSpeciesDisplay = observedSpecies.slice(0, page * limit);
  }
</script>

{#if showObservedSpecies}
  <h3>{observedSpecies.length} Observed species for {formatTaxonDisplayName(taxon)}</h3>
  <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
    {#each observedSpeciesDisplay as taxon}
      <TaxaCardSide {taxon} {taxaPath} />
    {/each}
  </div>
  <div class="grid justify-items-center mt-8">
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
{/if}
