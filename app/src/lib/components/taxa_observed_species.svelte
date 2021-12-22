<script>
  import { speciesRanks } from '$lib/data/constants';
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';

  export let taxon;
  export let projectPath;
  export let taxa;

  let page = 1;
  let limit = 20;

  $: observedSpecies = getObservedSpecies(taxa, taxon);
  $: observedSpeciesDisplay = observedSpecies.slice(0, page * limit);
  $: showLoadMore = page * limit < observedSpecies.length;

  function getObservedSpecies(taxa, taxon) {
    return taxa
      .filter((t) => speciesRanks.includes(t.rank))
      .filter((t) => t.taxon_ids.split('|').includes('' + taxon.taxon_id));
  }

  function loadMore() {
    page = page + 1;
    observedSpeciesDisplay = observedSpecies.slice(0, page * limit);
  }
</script>

{#if observedSpecies.length > 1}
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
              <img src="/images/missing-image.png" alt="" />
            {/if}
          </figure>
        </a>

        <div class="image-card-side-body">
          <a href="{projectPath}/taxa/{taxon.taxon_id}">
            {@html formatTaxonDisplayName(taxon, true)}<br />
            {pluralize('observation', taxon.taxa_count)}
          </a>
        </div>
      </div>
    {/each}
  </div>
  <div class="grid justify-items-center mt-8">
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
{/if}
