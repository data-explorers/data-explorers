<script>


  export let taxa;
  export let project;
  export let user;

  let currentTab = project.tabs.filter((tab) => tab.component == 'TaxaGrid')[0];
</script>

<h1>{currentTab.label}</h1>

<h2>{taxa.length} species</h2>

<div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
  {#each taxa as { count, image_url, taxon_id, scientific_name, common_name }}
    <div class="card bordered">
      <figure>
        <img src={image_url} alt="photo of {common_name}" />
      </figure>
      <div class="card-body">
        <a href="/users/{user.username}/{project.slug}/taxa/{taxon_id}">
          <h3>{common_name}</h3>
          <p>
            <em>{scientific_name}</em><br />
            {count} observations
          </p>
        </a>
      </div>
    </div>
  {/each}
</div>
