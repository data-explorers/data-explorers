<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let taxa;

    if (!project) {
      taxa = [];
      project = { tabs: [] };
    } else {
      let res = await import(`../../../../lib/data/${project.slug}/taxa.json`);
      taxa = res.default;
    }

    return { props: { project, taxa, user, pagePath: page.path } };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';
  import { formatTaxonDisplayName } from '$lib/formatUtils';

  export let project;
  export let taxa;
  export let user;
</script>

<ProjectHeader {project} {user} />

<div class="prose">
  <h1>Species List</h1>
  <ul>
    {#each taxa as taxon}
      <li>
        <a href="/users/{user.username}/{project.slug}/taxa/{taxon.taxon_id}"
          >{formatTaxonDisplayName(taxon)}</a
        >
      </li>
    {/each}
  </ul>
</div>

<style>
  .prose a {
    text-decoration: none;
  }
</style>
