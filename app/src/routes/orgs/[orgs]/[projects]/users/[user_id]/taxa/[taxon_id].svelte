<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';
  import { formatRawTaxa, formatRawObservations } from '$lib/convert_data';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    let res = await import(`../../../../../../../lib/data/${project.slug}/users.csv`);
    let users = res.default;
    let user = users.filter((u) => u.user_id == params.user_id)[0];

    let observationData = await import(
      `../../../../../../../lib/data/${params.projects}/observations.csv`
    );
    let allObservations = formatRawObservations(observationData.default);
    let observations = allObservations.filter((o) => {
      return o.user_login == user.user_login && o.taxon_id == params.taxon_id;
    });

    let taxaCounts = {};
    let taxaObj = {};
    observations.forEach((o) => {
      if (o.taxon_id == 0) {
      } else if (taxaCounts[o.taxon_id]) {
        taxaCounts[o.taxon_id] += 1;
        taxaObj[o.taxon_id]['taxa_count'] += 1;
      } else {
        taxaCounts[o.taxon_id] = 1;
        taxaObj[o.taxon_id] = {
          common_name: o.common_name,
          image_url: o.image_url,
          rank: o.rank,
          scientific_name: o.scientific_name,
          taxon_id: o.taxon_id,
          taxa_count: 1
        };
      }
    });
    let taxon = Object.values(taxaObj)[0];

    return { props: { project, projectPath, user, observations, taxon, org } };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { defaultColorScheme } from '$lib/mapUtils';
  import ObservationBasic from '$lib/components/observation_basic.svelte';
  import Loader from '$lib/components/loader.svelte';
  import TaxaImages from '$lib/components/taxa_images.svelte';
  import { pluralize, formatTaxonDisplayName } from '$lib/formatUtils';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export let user;
  export let observations;
  export let projectPath;
  export let project;
  export let taxon;
  export let org;

  let activeTab = 'users';

  // ===================
  // show one observation
  // ===================

  $: observationDisplay = observations[0];

  function changeObservation(e) {
    observationDisplay = observations.filter((o) => o.id === e.detail.observation_id)[0];
  }

  function zoomToObservation(e) {
    mapCenter = e.detail;
    observationDisplay = observations.filter((o) => o.id === e.detail.observation_id)[0];
  }

  // ===================
  // map
  // ===================

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

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/taxa_map.svelte');
    Map = comp.default;
  });
</script>

<ProjectHeader {org} {project} {activeTab} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>observer: {user.user_login}</h1>
    <h1>{@html formatTaxonDisplayName(taxon, true, true, true)}</h1>
    <h2 class="subtitle">{pluralize('observation', observations.length)}</h2>

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
          limitTaxaToSpecies={false}
        />
      </div>
    </div>

    <TaxaImages {observations} {taxon} {projectPath} />
  </div>
</main>

<style>
  .prose h1 {
    margin-bottom: 0;
  }
  h2.subtitle {
    margin-top: 0.5rem;
    font-weight: 400;
  }
</style>
