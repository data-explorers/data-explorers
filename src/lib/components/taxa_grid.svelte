<script>
  export let taxa;
  export let project;
  export let user;

  let page = 1;
  let limit = 24;
  let taxaDisplay = taxa.slice(0, page * limit);

  let currentTab = project.tabs.filter((tab) => tab.component === 'TaxaGrid')[0];

  function loadMore() {
    page = page + 1;
    taxaDisplay = taxa.slice(0, page * limit);
  }
</script>

<h1>{currentTab.label}</h1>

<h2>{taxa.length} species</h2>

<div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
  {#each taxaDisplay as { count, image_url, taxon_id, scientific_name, common_name }}
    <div class="card bordered">
      <a href="/users/{user.username}/{project.slug}/taxa/{taxon_id}">
        <figure>
          <img src={image_url} alt="photo of {common_name}" />
        </figure>
      </a>
      <div class="card-body">
        <a href="/users/{user.username}/{project.slug}/taxa/{taxon_id}">
          {#if common_name}<div class="text-lg font-medium">{common_name}</div>{/if}
          {#if scientific_name}<div class="text-gray-400">({scientific_name})</div>{/if}
          <div>{count} observations</div>
        </a>
      </div>
    </div>
  {/each}
</div>
<div class="grid justify-items-center mt-8">
  <button class="btn" on:click={loadMore}>Load More</button>
</div>

<style>
  img {
    height: 225px;
    object-fit: cover;
  }
  @media (max-width: 640px) {
    img {
      height: 400px;
      object-fit: cover;
    }
  }

  .card.bordered {
    border-radius: 0;
  }
  .card-body {
    padding: 1rem;
  }
</style>
