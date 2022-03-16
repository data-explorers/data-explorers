<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    return { props: { projectPath, project, org } };
  }
</script>

<script>
  export let projectPath;
  export let project;
  export let org;

  let activeTab = 'field-guides';
  let hasFieldGuides = project.field_guides && project.field_guides.length > 0;
</script>

<ProjectHeader {org} {project} {activeTab} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>Field Guides</h1>
    {#if hasFieldGuides}
      <ul>
        {#each project.field_guides as field_guide}
          <li><a href="{projectPath}/field-guides/{field_guide.link}">{field_guide.title}</a></li>
        {/each}
      </ul>
    {:else}
      <p>No field guides available.</p>
    {/if}
  </div>
</main>
