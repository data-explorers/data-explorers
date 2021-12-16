<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let page_parts = page.path.split('/');
    let user = data.filter((user) => user.username === page_parts[2])[0];
    let project = user.projects.filter((project) => project.slug === page_parts[3])[0];
    return { props: { user, project } };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';
  import allTaxa from '$lib/data/los-angeles-bioblitz/taxa.json';

  let taxa = allTaxa.filter((t) => !!t.taxon_group);

  export let user;
  export let project;
</script>

<ProjectHeader {project} {user} />

<div class="prose max-w-none">
  <h1>Indicator Species</h1>

  <h2>{taxa.length} Species</h2>

  <div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
    {#each taxa as { image_url, common_name, count, scientific_name, user_login, taxon_group, taxon_id, type }}
      <div class="image-card">
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
            <div>{taxon_group}</div>
            <div>{type}</div>
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
