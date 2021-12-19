<script>
  import { toTitleCase, pluralize, formatTaxonDisplayName } from '$lib/formatUtils';

  export let taxa;
  export let projectPath;

  let page = 1;
  let limit = 24;

  $: taxaDisplay = taxa.slice(0, page * limit);
  $: showLoadMore = page * limit < taxa.length;

  function loadMore() {
    page = page + 1;
    taxaDisplay = taxa.slice(0, page * limit);
  }
</script>

<div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
  {#each taxaDisplay as taxon}
    <div class="image-card">
      <a href="{projectPath}/taxa/{taxon.taxon_id}">
        <figure>
          <img src={taxon.image_url} alt="photo of {taxon.common_name}" />
        </figure>
      </a>

      <div class="image-card-body">
        <a href="{projectPath}/taxa/{taxon.taxon_id}">
          {#if taxon.common_name}<span class="text-lg font-medium"
              >{toTitleCase(taxon.common_name)}</span
            >{/if}
          {#if taxon.scientific_name}<span class="text-gray-400">({taxon.scientific_name})</span
            >{/if}
          <div>{pluralize('observation', taxon.taxa_count)}</div>
        </a>
      </div>
    </div>
  {/each}
</div>
<div class="grid justify-items-center mt-8">
  <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
</div>
