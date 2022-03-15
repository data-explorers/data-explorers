<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === 'go-sea')[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    return { props: { projectPath, org, project } };
  }
</script>

<script>
  import allTaxa from '$lib/data/go-sea/taxa.csv';
  import TaxaGrid from '$lib/components/taxa_list_grid_custom.svelte';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export let projectPath;
  export let project;
  export let org;

  let activeTab = 'field-guide-species';
  let taxa = allTaxa
    .filter((t) => t.field_guide == 'True')
    .sort((a, b) => b.taxa_count - a.taxa_count);
</script>

<ProjectHeader {org} {project} {activeTab} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>{taxa.length} Field Guide Species</h1>

    <TaxaGrid {taxa} {projectPath} />
  </div>
</main>
