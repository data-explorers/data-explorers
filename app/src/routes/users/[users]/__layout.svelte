<script context="module">
  import settings from '$lib/data/settings.json';

  export async function load({ page }) {
    let user = settings.filter((user) => user.username === page.params.users)[0];

    let project;
    if (page.params.projects) {
      project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    } else {
      let page_parts = page.path.split('/');
      project = user.projects.filter((project) => project.slug === page_parts[3])[0];
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
