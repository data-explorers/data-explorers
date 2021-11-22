<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let page_parts = page.path.split('/');
    let user = data.filter((user) => user.username == page_parts[2])[0];
    let project = user.projects.filter((project) => project.slug == page_parts[3])[0];
    return { props: { user, project } };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';
  import taxa from '$lib/data/los-angeles-bioblitz/highlighted_taxa.json';

  export let user;
  export let project;
</script>

<ProjectHeader {project} {user} />

<h1>Species</h1>

<div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
  {#each taxa as { image, slug, common_name, taxon_name, image_credit, taxon_group, taxon_id, type }}
    <a href="/users/mbarton/los-angeles-bioblitz/taxa/{taxon_id}">
      <div class="card bordered">
        <figure>
          <img src={image} alt="photo of {common_name}" />
          <figcaption>{image_credit}</figcaption>
        </figure>
        <div class="card-body prose">
          <h2>{common_name}</h2>
          <p>
            <em>{taxon_name}</em><br />
            {taxon_group}<br />
            {type}
          </p>
        </div>
      </div>
    </a>
  {/each}
</div>
