<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let user = data.filter((user) => user.username == page.params.users)[0];
    let project = user.projects.filter((project) => project.slug == page.params.projects)[0];

    return { props: { project, user } };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';
  export let project;
  export let user;
</script>

<ProjectHeader {project} {user} />

<main class="">
  <div class="grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-3">
    <div class="col-span-2 prose">
      <dl>
        <dt class="font-bold">Location</dt>
        <dd>{project.location}</dd>
        <dt class="font-bold">Start Date</dt>
        <dd>{project.start_date}</dd>
        <dt class="font-bold">Audience</dt>
        <dd>{project.target_audience}</dd>
        <dt class="font-bold">Links</dt>
        {#each project.links as link}
          <dd><a href={link.url}>{link.text}</a></dd>
        {/each}
      </dl>
      {@html project.description}
    </div>
    <div>
      <img src="/{project.slug}/observations_map_square.jpg" alt="map of {project.title}" />
    </div>
  </div>
</main>
