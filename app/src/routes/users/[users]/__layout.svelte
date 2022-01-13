<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';

  export async function load({ params, url }) {
    let user = settings.filter((user) => user.username === params.users)[0];
    let pathParts = url.pathname.split('/');

    // BUG: for production, 'inaturalist_data_explorer' is included in the
    // pathname when switching pages, but not on page load. For dev,
    // inaturalist_data_explorer is not in url.pathname.
    let projectSlug = params.projects;
    let project;
    if (projectSlug) {
      project = user.projects.filter((project) => project.slug === projectSlug)[0];
    } else {
      project = user.projects.filter((project) => project.slug === pathParts[3])[0];
    }
    if (!project) {
      project = user.projects.filter((project) => project.slug === pathParts[4])[0];
    }
    return { props: { project, user } };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';

  export let project;
  export let user;
</script>

<ProjectHeader {project} {user} />

<slot />
