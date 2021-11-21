<script context="module">
  import projects from '$lib/data/data.json';

  export async function load({ page }) {
    let project = projects.filter((p) => p.slug == page.path.split('/')[2])[0];
    return { props: { project } };
  }
</script>

<script>
  // import ProjectHeader from '../../../../components/project_header.svelte';
  import taxa from '$lib/data/los-angeles-bioblitz/highlighted_taxa.json';

  export let project;
  console.log(project);
</script>

<!-- <ProjectHeader {project} /> -->

<h1 class="text-4xl text-center m-8 font-extrabold">Species</h1>

<div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
  {#each taxa as { image, slug, common_name, taxon_name, image_credit, taxon_group, type }}
    <a href="/projects/los-angeles-bioblitz/taxa/{slug}">
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
