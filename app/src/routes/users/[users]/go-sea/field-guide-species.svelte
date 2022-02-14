<script context="module">
  import settings from '$lib/data/settings.json';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { base } from '$app/paths';

  export async function load({ params, url }) {
    let user = settings.filter((user) => user.username === params.users)[0];
    let project = user.projects.filter((project) => project.slug === 'go-sea')[0];
    let projectPath = `${base}/users/${user.username}/${project.slug}`;

    return { props: { projectPath } };
  }
</script>

<script>
  import allTaxa from '$lib/data/go-sea/taxa.csv';
  import TaxaGrid from '$lib/components/taxa_list_grid_custom.svelte';

  export let projectPath;

  let taxa = allTaxa
    .filter((t) => t.field_guide == 'True')
    .sort((a, b) => b.taxa_count - a.taxa_count);
</script>

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>{taxa.length} Field Guide Species</h1>

    <TaxaGrid {taxa} {projectPath} />
  </div>
</main>
