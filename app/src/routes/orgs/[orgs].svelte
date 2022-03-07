<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let projects = org.projects;

    return { props: { org, projects } };
  }
</script>

<script>
  import UserHeader from '$lib/components/org_header.svelte';

  export let projects;
  export let org;
</script>

<UserHeader {org} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>Projects</h1>

    <div class="grid lg:grid-cols-3 md:grid-cols-2  justify-center gap-3">
      {#each projects as project}
        <div class="image-card">
          <a href="{base}/orgs/{org.username}/{project.slug}">
            <figure>
              <img
                src="{base}/images/{org.username}/{project.image}"
                alt="Photo for {project.title}"
              />
            </figure>
          </a>

          <div class="image-card-body">
            <a href="{base}/orgs/{org.username}/{project.slug}">
              <h2>{project.title}</h2>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>
