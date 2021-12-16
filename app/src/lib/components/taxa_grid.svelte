<script>
  import { toTitleCase, pluralize } from '$lib/formatUtils';

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
  {#each taxaDisplay as { taxa_count, image_url, taxon_id, scientific_name, common_name }}
    <div class="image-card">
      <a href="{projectPath}/taxa/{taxon_id}">
        <figure>
          <img src={image_url} alt="photo of {common_name}" />
        </figure>
      </a>

      <div class="image-card-body">
        <a href="{projectPath}/taxa/{taxon_id}">
          {#if common_name}<div class="text-lg font-medium">{toTitleCase(common_name)}</div>{/if}
          {#if scientific_name}<div class="text-gray-400">({scientific_name})</div>{/if}
          <div>{pluralize('observation', taxa_count)}</div>
        </a>
      </div>
    </div>
  {/each}
</div>
<div class="grid justify-items-center mt-8">
  <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
</div>
