<script>
  import { pluralize } from '$lib/formatUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { base } from '$app/paths';

  export let taxa;
  export let projectPath;

  $: taxaDisplay = taxa.slice(0, page * limit);
  $: showLoadMore = page * limit < taxa.length;

  let page = 1;
  let limit = 24;

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
          {#if taxon.image_url}
            <img src={taxon.image_url} alt="photo of {formatTaxonDisplayName(taxon)}" />
          {:else}
            <img src="{base}/images/missing-image.png" alt="" />
          {/if}
        </figure>

        <div class="image-card-body">
          <div class="text-lg font-medium leading-normal">
            {@html formatTaxonDisplayName(taxon, true)}
          </div>
          {#if taxon.taxa_count > 1}
            <div>{pluralize('observation', taxon.taxa_count)}</div>
          {:else}
            <div>{pluralize('observation', taxon.observations_count)}</div>
          {/if}
        </div>
      </a>
    </div>
  {/each}
</div>
<div class="grid justify-items-center mt-8">
  <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
</div>
