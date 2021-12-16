<script context="module">
  import allInteractions from '$lib/data/interactions.json';
  import data from '$lib/data/data.json';

  // TODO: range map from inat
  // TODO: description from wikipedia

  export async function load({ page }) {
    let taxaData = await import(`../../../../../lib/data/${page.params.projects}/taxa.json`);
    let taxa = taxaData.default;

    // find taxon that has observations
    let taxon = taxa.filter((taxon) => taxon.taxon_id == Number(page.params.taxon_id))[0];
    if (!taxon) {
      // find higher level taxon
      let higherTaxon = taxa
        .filter((t) => t.taxon_ids)
        .filter((taxon) => taxon.taxon_ids.split('|').includes(page.params.taxon_id))[0];
      if (higherTaxon) {
        let names = higherTaxon.names.split('|');
        let taxon_ids = higherTaxon.taxon_ids.split('|');
        let common_names = higherTaxon.common_names.split('|');
        let index = taxon_ids.indexOf(page.params.taxon_id);

        taxon = {
          scientific_name: names[index],
          common_name: common_names[index],
          taxon_id: Number(taxon_ids[index]),
          image_url: higherTaxon['image_url'],
          user_login: higherTaxon['user_login'],
          count: null,
          is_species: false,
          taxon_ids: taxon_ids.slice(0, index + 1).join('|'),
          names: names.slice(0, index + 1).join('|'),
          common_names: common_names.slice(0, index + 1).join('|')
        };
      } else {
        taxon = {};
      }
    }

    let observationData = await import(
      `../../../../../lib/data/${page.params.projects}/observations.json`
    );
    let allObservations = observationData.default;
    let observations = allObservations
      .filter((o) => o.taxon_ids)
      .filter((o) => o.taxon_ids.split('|').includes('' + page.params.taxon_id));

    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let interactions = allInteractions
      .filter((i) => i.subject_taxon_id)
      .filter((i) => i.subject_taxon_id == page.params.taxon_id);

    let projectPath = `/users/${user.username}/${project.slug}`;

    return {
      props: {
        taxon,
        user,
        project,
        observations,
        interactions,
        projectPath
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
  import { defaultColorScheme } from '$lib/mapUtils';

  export let taxon;
  export let user;
  export let project;
  export let observations;
  export let interactions;
  export let projectPath;

  let mapOptions = {
    ...defaultColorScheme,
    zoom: project.zoom,
    latitude: project.latitude,
    longitude: project.longitude,
    observationsTimeSpan: project.observationsTimeSpan,
    center: [project.latitude || 0, project.longitude || 0]
  };

  let tabsMetadata = {
    TaxaAbout: { component: TaxaAbout, props: { project, taxon, interactions, projectPath } },
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

<div class="prose max-w-none">
  <h1>
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
      <b>Observer</b>: {taxon.user_login}
    </div>

    <div>
      <svelte:component this={Map} {mapOptions} {observations} />
    </div>
  </div>
</div>

<Tabs {tabs} />
