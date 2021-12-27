<script context="module">
  import settings from '$lib/data/settings.json';

  export async function load({ page }) {
    let user = settings.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let taxa;

    if (!project) {
      taxa = [];
      project = { tabs: [] };
    } else {
      let res = await import(`../../../../lib/data/${project.slug}/taxa.csv`);
      taxa = res.default;
      taxa = taxa.sort((a, b) => b.taxa_count - a.taxa_count);
    }

    return { props: { project, taxa, user, pagePath: page.path } };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';

  export let project;
  export let taxa;
  export let user;
</script>

<ProjectHeader {project} {user} />

<div class="prose">
  <h1>Taxa List</h1>
  {pluralize('taxon', taxa.length)}
  <ul>
    {#each taxa as taxon}
      <li>
        <a href="/users/{user.username}/{project.slug}/taxa/{taxon.taxon_id}"
          >{@html formatTaxonDisplayName(taxon, true)}</a
        >, {pluralize('observation', taxon.taxa_count)}, {taxon.rank}
      </li>
    {/each}
  </ul>
</div>

<style>
</style>
