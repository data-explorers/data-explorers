<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let pathParts = page.path.split('/');
    let currentTab = project.tabs_project.filter(
      (tab) => tab.link === pathParts[pathParts.length - 1]
    )[0];

    return { props: { project, user, currentTab } };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';
  export let project;
  export let user;
  export let currentTab;
</script>

<ProjectHeader {project} {user} />

<h1>{currentTab.label}</h1>

<p>
  Incididunt culpa reprehenderit culpa non. Ex sunt ullamco amet in laboris nisi consectetur nostrud
  cillum enim nostrud cillum eiusmod quis. Esse esse elit voluptate deserunt reprehenderit in
  nostrud fugiat velit duis. Officia est excepteur ipsum anim esse laboris quis in deserunt ea. Esse
  velit non elit nisi. Nulla amet incididunt dolore sunt enim mollit veniam officia laboris non
  aliqua.
</p>
