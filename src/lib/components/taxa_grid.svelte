<script>
  export let taxa;
  export let project;
  export let user;
  export let pagePath;

  let page = 1;
  let limit = 24;
  let taxaDisplay = taxa.slice(0, page * limit);

  $: showLoadMore = page * limit < taxa.length;

  let pathParts = pagePath.split('/');
  let currentTab = project.tabs_project.filter(
    (tab) => tab.link === pathParts[pathParts.length - 1]
  )[0];

  function loadMore() {
    page = page + 1;
    taxaDisplay = taxa.slice(0, page * limit);
  }
</script>

<div class="prose max-w-none">
  <h1>{currentTab.label}</h1>

  <h2>{taxa.length} species</h2>

  <div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
    {#each taxaDisplay as { count, image_url, taxon_id, scientific_name, common_name }}
      <div class=" image-card">
        <a href="/users/{user.username}/{project.slug}/taxa/{taxon_id}">
          <figure>
            <img src={image_url} alt="photo of {common_name}" />
          </figure>
        </a>

        <div class="image-card-body">
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
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
</div>
