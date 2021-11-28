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

<h1>Projects</h1>

<div class="grid lg:grid-cols-3 md:grid-cols-2  justify-center gap-3">
  {#each projects as project}
    <div class="card bordered">
      <figure>
        <img src="{project.image}/400/250" alt="Photo for {project.title}" />
      </figure>
      <a href="/users/{user.username}/{project.slug}">
        <div class="card-body prose prose-lg">
          <h2 class="card-title">{project.title}</h2>
          <p>{project.summary}</p>
        </div>
      </a>
    </div>
  {/each}
</div>
