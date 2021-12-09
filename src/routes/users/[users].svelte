<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let user = data.filter((user) => user.username === page.params.users)[0];
    let projects = user.projects;

    return { props: { user, projects } };
  }
</script>

<script>
  import UserHeader from '$lib/components/user_header.svelte';
  export let projects;
  export let user;
</script>

<UserHeader {user} />

<div class="prose max-w-none">
  <h1>Projects</h1>

  <div class="grid lg:grid-cols-3 md:grid-cols-2  justify-center gap-3">
    {#each projects as project}
      <div class="image-card">
        <a href="/users/{user.username}/{project.slug}">
          <figure>
            <img src="{project.image}/400/250" alt="Photo for {project.title}" />
          </figure>
        </a>

        <div class="image-card-body">
          <a href="/users/{user.username}/{project.slug}">
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
