<script context="module">
  import settings from '$lib/data/settings.json';
  import { formatRawTaxa, formatRawObservations } from '$lib/convert_data';
  import { base } from '$app/paths';

  // TODO: description from wikipedia

  export async function load({ params }) {
    let taxaData = await import(`../../../../../lib/data/${params.projects}/taxa.csv`);
    let taxa = formatRawTaxa(taxaData.default);
    let interactions = [];
    try {
      let interactionsData = await import(
        `../../../../../lib/data/interactions/interactions_${params.taxon_id}.csv`
      );
      interactions = interactionsData.default;
    } catch {}

    // find taxon that has observations
    let taxon = taxa.filter((taxon) => taxon.taxon_id == Number(params.taxon_id))[0] || {};

    let observationData = await import(
      `../../../../../lib/data/${params.projects}/observations.csv`
    );
    let allObservations = formatRawObservations(observationData.default);
    let observations = allObservations
      .filter((o) => o.taxon_ids)
      .filter((o) => o.taxon_ids.split('|').includes('' + params.taxon_id));

    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    if (project.map_layers) {
      project.map_layers.forEach(async (layer, index) => {
        project.map_layers[index]['data'] = await import(
          `../../../../../lib/data/${params.projects}/map_layers/${layer.file}.geojson`
        );
      });
    }
    return {
      props: {
        taxon,
        org,
        project,
        observations,
        interactions,
        projectPath,
        taxa
      }
    };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import Tabs from '$lib/components/tabs.svelte';
  import TaxaAbout from '$lib/components/taxa_about.svelte';
  import TaxaImages from '$lib/components/taxa_images.svelte';
  import TaxaMedia from '$lib/components/taxa_media.svelte';
  import { defaultColorScheme } from '$lib/mapUtils';
  import Loader from '$lib/components/loader.svelte';
  import { toTitleCase } from '$lib/formatUtils';
  import ObservationBasic from '$lib/components/observation_basic.svelte';
  import { pluralize, formatTaxonDisplayName } from '$lib/formatUtils';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export let taxon;
  export let org;
  export let project;
  export let observations;
  export let interactions;
  export let projectPath;
  export let taxa;

  $: observationDisplay = observations.filter((o) => o.id === taxon.id)[0];
  // make tabs reactive so that props are updated when the taxa url changes
  $: tabs = project.tabs_taxa.map((tab) => {
    return {
      label: tab.label,
      value: tab.value,
      component: tabsMetadata()[tab.component].component,
      props: tabsMetadata()[tab.component].props
    };
  });

  let mapCenter = {};
  let loading = true;
  let mapOptions = {
    ...defaultColorScheme,
    zoom: project.zoom,
    latitude: project.latitude,
    longitude: project.longitude,
    observationsTimeSpan: project.observations_time_span,
    center: [project.latitude || 0, project.longitude || 0],
    preferCanvas: true
  };
  let taxonIds = taxa.map((t) => t.taxon_id);
  let activeTab = 'taxa';

  function changeObservation(e) {
    observationDisplay = observations.filter((o) => o.id === e.detail.observation_id)[0];
  }

  function tabsMetadata() {
    return {
      TaxaAbout: {
        component: TaxaAbout,
        props: { project, taxon, interactions, projectPath, taxa, taxonIds, observations }
      },
      TaxaImages: { component: TaxaImages, props: { observations, projectPath, taxon } },
      TaxaMedia: { component: TaxaMedia, props: {} }
    };
  }

  function zoomToObservation(e) {
    mapCenter = e.detail;
    observationDisplay = observations.filter((o) => o.id === e.detail.observation_id)[0];
  }

  // NOTE: must use dynamic import to load leaflet since leaflet depends on
  // window object. leaflet will not work with server side rendering.
  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/taxa_map.svelte');
    Map = comp.default;
  });
</script>

<ProjectHeader {org} {project} {activeTab} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>
      {@html formatTaxonDisplayName(taxon, true, true, true)}
    </h1>
    <h2 class="subtitle">{pluralize('Observation', observations.length)}</h2>

    <div class="grid md:grid-cols-2 gap-3">
      <ObservationBasic
        observation={observationDisplay}
        {projectPath}
        {taxon}
        on:zoomToObservation={zoomToObservation}
      />

      <div class="relative">
        {#if loading}
          <Loader />
        {/if}
        <svelte:component
          this={Map}
          {mapOptions}
          {observations}
          on:doneLoading={() => (loading = false)}
          on:markerClick={changeObservation}
          {mapCenter}
          {project}
          {taxon}
        />
      </div>
    </div>
  </div>

  <Tabs {tabs} on:zoomToObservation={zoomToObservation} />
</main>

<style>
  /*
  Changing the time span re-renders the charts, which triggers autoscroll in
  Chrome. This css fixes the autoscroll behavior in Chrome.
https://stackoverflow.com/a/42562623 */
  * {
    overflow-anchor: none !important;
  }

  .prose h1 {
    margin-bottom: 0;
  }
  h2.subtitle {
    margin-top: 0.5rem;
    font-weight: 400;
  }
</style>
