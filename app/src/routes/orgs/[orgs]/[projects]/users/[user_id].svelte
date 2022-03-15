<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';
  import { formatRawObservations } from '$lib/convert_data';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    let res = await import(`../../../../../lib/data/${project.slug}/users.csv`);
    let users = res.default;
    let user = users.filter((u) => u.user_id == params.user_id)[0];

    let observationData = await import(
      `../../../../../lib/data/${params.projects}/observations.csv`
    );
    let allObservations = formatRawObservations(observationData.default);
    let observations = allObservations.filter((o) => o.user_login == user.user_login);

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
    let taxa = Object.values(taxaObj).sort((a, b) => b.taxa_count - a.taxa_count);

    return { props: { project, projectPath, user, org, observations, taxa } };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { defaultColorScheme } from '$lib/mapUtils';
  import ObservationBasic from '$lib/components/observation_basic.svelte';
  import Loader from '$lib/components/loader.svelte';
  import TaxaCardSide from '$lib/components/taxa_card_side.svelte';
  import { pluralize } from '$lib/formatUtils';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export let user;
  export let observations;
  export let projectPath;
  export let project;
  export let taxa;
  export let org;

  let taxon = {};
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

  let taxaPath = `${projectPath}/users/${user.user_id}/taxa`;

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/taxa_map.svelte');
    Map = comp.default;
  });

  // ===================
  // taxa
  // ===================

  $: taxaDisplay = taxa.slice(0, page * limit);
  $: showLoadMore = page * limit < taxa.length;

  let page = 1;
  let limit = 20;

  function loadMore() {
    page = page + 1;
    taxaDisplay = taxa.slice(0, page * limit);
  }
</script>

<ProjectHeader {org} {project} {activeTab} />

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>observer: {user.user_login}</h1>
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

    <h2>Observed Species</h2>
    <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
      {#each taxaDisplay as taxon}
        <TaxaCardSide {taxon} {taxaPath} />
      {/each}
    </div>

    <div class="grid justify-items-center mt-8">
      <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
    </div>
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
