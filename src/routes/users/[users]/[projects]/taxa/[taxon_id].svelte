<script context="module">
  import allInteractions from '$lib/data/interactions.json';
  import data from '$lib/data/data.json';

  // range map from inat

  // description from wikipedia

  export async function load({ page }) {
    let taxaData = await import(`../../../../../lib/data/${page.params.projects}/taxa.json`);
    let taxa = taxaData.default;
    let taxon = taxa.filter((taxon) => taxon.taxon_id == page.params.taxon_id)[0] || {};
    let observationData = await import(
      `../../../../../lib/data/${page.params.projects}/observations.json`
    );
    let allObservations = observationData.default;
    let observations = allObservations.filter((i) => i.taxon_id == page.params.taxon_id);

    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let interactions = allInteractions.filter((i) => i.subject_taxon_id == page.params.taxon_id);

    return {
      props: {
        taxon,
        user,
        project,
        observations,
        interactions
      }
    };
  }
</script>

<script>
  import ProjectHeader from '$lib/components/project_header.svelte';
  import { onMount } from 'svelte';
  import Tabs from '$lib/components/tabs.svelte';
  import TaxaAbout from '$lib/components/taxa_about.svelte';
  import TaxaImages from '$lib/components/taxa_images.svelte';
  import TaxaMedia from '$lib/components/taxa_media.svelte';

  export let taxon;
  export let user;
  export let project;
  export let observations;
  export let interactions;

  let mapOptions = {
    zoom: project.zoom,
    latitude: project.latitude,
    longitude: project.longitude,
    displayType: project.taxaDisplayType
  };

  let tabsMetadata = {
    TaxaAbout: { component: TaxaAbout, props: { project, taxon, interactions } },
    TaxaImages: { component: TaxaImages, props: { observations } },
    TaxaMedia: { component: TaxaMedia, props: {} }
  };

  let tabs = project.tabs_taxa.map((tab) => {
    return {
      label: tab.label,
      value: tab.value,
      component: tabsMetadata[tab.component].component,
      props: tabsMetadata[tab.component].props
    };
  });

  // NOTE: must use dynamic import to load leaflet since leaflet depends on
  // window object. leaflet will not work with server side rendering.
  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/taxa_map.svelte');
    Map = comp.default;
  });
</script>

<ProjectHeader {project} {user} />

<h1 class="mb-0">
  {#if taxon.common_name}{taxon.common_name}{/if}
  {#if taxon.scientific_name}
    <span class="text-2xl text-gray-400">({taxon.scientific_name})</span>
  {/if}
</h1>

<h3>{observations.length} {observations.length === 1 ? 'observation' : 'observations'}</h3>

<div class="grid md:grid-cols-2 gap-3">
  <div>
    {#if taxon.image_url}
      <img src={taxon.image_url} alt="image of {taxon.scientific_name}" />
    {/if}
  </div>

  <div>
    <svelte:component this={Map} {mapOptions} {observations} />
  </div>
</div>

<Tabs {tabs} />
