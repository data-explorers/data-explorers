<script context="module">
  import settings from '$lib/data/settings.json';

  export async function load({ params, url }) {
    let user = settings.filter((user) => user.username === params.users)[0];
    let page_parts = url.pathname.split('/');
    let project = user.projects.filter((project) => project.slug === page_parts[3])[0];

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
