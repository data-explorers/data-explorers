<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;
    let field_guide = project.field_guides.filter((g) => g.link === params.field_guide_id)[0];

    let taxa = '';
    if (field_guide.file) {
      let fieldGuideFile = await import(
        `../../../../../lib/data/${params.projects}/field-guides/${field_guide.file}.csv`
      );
      taxa = fieldGuideFile.default;
    }

    return { props: { projectPath, project, org, taxa, field_guide } };
  }
</script>

<script>
  import SvelteMarkdown from 'svelte-markdown';
  import { formatTaxonDisplayName } from '$lib/formatUtils';

  export let taxa;
  export let project;
  export let org;
  export let field_guide;
  export let projectPath;

  let activeTab = 'field-guides';
  let hasFieldGuides = project.field_guides && project.field_guides.length > 0;
</script>

<ProjectHeader {org} {project} {activeTab} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>{field_guide.title}</h1>
    {#each taxa as taxon}
      <div class="card lg:card-side mb-4 rounded-none border">
        <figure><img src={taxon.image_url} alt="photo of {formatTaxonDisplayName(taxon)}" /></figure>
        <div class="card-body">
          <h2 class="card-title">{@html formatTaxonDisplayName(taxon, true, false, true)}</h2>
          <SvelteMarkdown source={taxon.text} />
          <a href="{projectPath}/taxa/{taxon.taxon_id}">Species page</a>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  /* .field-guide-item {
    margin-bottom: 2rem;
    display: flex;
  } */

  img {
    object-fit: cover;
    height: 300px;
    width: 300px;
    min-width: 300px;
  }

  .prose h2 {
    margin-top: 0;
  }

  .card-body {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>
