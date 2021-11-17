<script context="module">
  import projects from '$lib/data/projects.json';

  export async function load({ page }) {
    let project = projects.filter((p) => p.slug == page.params.slug)[0];
    return { props: { project } };
  }
</script>

<script>
  import AboutProject from '../../components/about_project.svelte';
  import ExploreData from '../../components/explore_data.svelte';
  import TaxaGrid from '../../components/taxa_grid.svelte';
  import Tabs from '../../components/tabs.svelte';

  export let project;

  const components = {
    AboutProject,
    ExploreData,
    TaxaGrid
  };

  let tabs = project.tabs.map((tab, index) => {
    return {
      label: tab.label,
      value: index,
      component: components[tab.component]
    };
  });
</script>

<div class="hero" style="background-image: url(&quot;{project.image}/1600/500&quot;);">
  <div class="hero-overlay bg-opacity-50" />
  <div class="text-center hero-content text-neutral-content">
    <div class="max-w-md">
      <h1 class="mb-5 text-4xl font-bold">{project.title}</h1>
      <p class="mb-5">{project.summary}</p>
    </div>
  </div>
</div>

<Tabs {tabs} {project} />
