<script context="module">
  import settings from '$lib/data/settings.json';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];

    let aboutText = '';
    if (project.has_about_text) {
      let aboutFile = await import(`../../../lib/data/${params.projects}/about.md`);
      aboutText = aboutFile.default;
    }

    return { props: { project, aboutText, org } };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export let project;
  export let aboutText;
  export let org;

  let activeTab = '';
  let mapOptions = {
    latitude: project.latitude,
    longitude: project.longitude,
    zoom: project.projectZoom,
    center: [project.latitude || 0, project.longitude || 0]
  };

  // NOTE: must use dynamic import to load leaflet since leaflet depends on
  // window object. leaflet will not work with server side rendering.
  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/project_map.svelte');
    Map = comp.default;
  });
</script>

<ProjectHeader {org} {project} {activeTab} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>About</h1>
    <div class="grid lg:grid-cols-3 gap-3">
      <div class="lg:col-span-2">
        <table class="table table-compact">
          <tr>
            <th>Location</th>
            <td>{project.location}</td>
          </tr>
          <tr>
            <th>Start Date</th>
            <td>{project.start_date}</td>
          </tr>
          <tr>
            <th>Audience</th>
            <td>{project.target_audience}</td>
          </tr>
          <tr>
            <th>Species</th>
            <td>{project.species_count}</td>
          </tr>
          <tr>
            <th>Observations</th>
            <td>{project.observations_count}</td>
          </tr>
          <tr>
            <th>Observers</th>
            <td>{project.observers_count}</td>
          </tr>
          <tr>
            <th>Links</th>
            <td>
              {#each project.links as link}
                <a class="inline-block mr-4" href={link.url}>{link.text}</a>
              {/each}
            </td>
          </tr>
        </table>
        {#if aboutText.length}
          <SvelteMarkdown source={aboutText} />
        {:else}
          {@html project.description}
          <div class="">
            <h2>Project Questions</h2>
            <ol>
              <li>Sint labore sunt magna duis officia pariatur ut?</li>
              <li>Officia in ea non non aliquip ad duis est veniam proident in ut velit dolor?</li>
              <li>Id incididunt cillum magna dolor?</li>
            </ol>
          </div>
        {/if}
      </div>
      <div>
        <svelte:component this={Map} {mapOptions} />
      </div>
    </div>
  </div>
</main>
