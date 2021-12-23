<script context="module">
  import data from '$lib/data/data.json';
  import { convertTaxa, convertObservations } from '$lib/convert_data';

  export async function load({ page }) {
    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let pathParts = page.path.split('/');
    let currentTab = project.tabs_project.filter(
      (tab) => tab.link === pathParts[pathParts.length - 1]
    )[0];
    let projectPath = `/users/${user.username}/${project.slug}`;

    let taxaData = await import(`../../../../lib/data/${page.params.projects}/taxa.csv`);
    let taxa = convertTaxa(taxaData.default);
    let observationData = await import(
      `../../../../lib/data/${page.params.projects}/observations.csv`
    );
    let allObservations = convertObservations(observationData.default);

    return { props: { project, user, currentTab, allObservations, taxa, projectPath } };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import AutoComplete from 'simple-svelte-autocomplete';
  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';
  import Loader from '$lib/components/loader.svelte';
  import ProjectHeader from '$lib/components/project_header.svelte';
  import Modal from '$lib/components/modal.svelte';
  import ModalMagnify from '$lib/components/modal-magnify.svelte';
  import TaxonFilter from '$lib/components/ed_taxon_filter.svelte';
  import { modulo } from '$lib/miscUtils';
  import { darkGray, defaultColorScheme } from '$lib/mapUtils';
  import {
    fetchTaxaByName,
    fecthObservationsByTaxonId,
    sortObservations,
    createGroupObservations
  } from '$lib/dataUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';

  export let project;
  export let user;
  export let currentTab;
  export let allObservations;
  export let taxa;
  export let projectPath;

  $: basicTaxaHistory = taxaHistory.map((t) => ({
    taxonName: t.taxon_name,
    color: t.color,
    taxonId: t.taxon_id,
    active: t.active
  }));

  $: if (taxaHistory.length === 0) {
    showDemoSpeciesPrompt = project.slug !== 'los-angeles-bioblitz';
    showIndicatorSpeciesPrompt = project.slug === 'los-angeles-bioblitz';
  }

  let observations = [];
  let item = '';
  let taxaHistory = []; // all selected taxa
  let showDemoSpeciesPrompt = project.slug !== 'los-angeles-bioblitz';
  let showIndicatorSpeciesPrompt = project.slug === 'los-angeles-bioblitz';
  let orderByValue = 'oldest';
  let groupedObservations = []; // what is sent to the Map and TimeSpanFilters
  let timeSpanHistory = {}; // all the time spans
  let showClimate = false;
  let showDemoMapLayer = false;
  let taxaCount = 0;
  let loading = false;

  allObservations = allObservations.filter((o) => o.latitude && o.longitude);

  function logging() {
    console.log('observations', observations);
    console.log('taxaHistory', taxaHistory);
    console.log('groupedObservations', groupedObservations);
    console.log('timeSpanHistory', timeSpanHistory);
  }

  let mapOptions = {
    ...defaultColorScheme,
    zoom: project.zoom,
    latitude: project.latitude,
    longitude: project.longitude,
    observationsTimeSpan: 'all',
    colorSchemeMonth: Array(12).fill(darkGray),
    colorSchemeYear: [darkGray],
    defaultColor: darkGray,
    monthSeasonalMarkers: false,
    center: [project.latitude || 0, project.longitude || 0],
    preferCanvas: true
  };

  // =====================
  // type ahead select
  // =====================

  function handleSelect(taxon) {
    if (!taxon || !taxon.label) return;
    showDemoSpeciesPrompt = false;
    showIndicatorSpeciesPrompt = false;

    // prevent adding same taxon twice
    if (taxaHistory.filter((t) => t.taxon_id == taxon.taxon_id).length > 0) {
      return;
    }
    taxaCount += 1;

    // use settimeout so that selecting the taxa finishes, and then fetching
    // the observations is called.
    loading = true;
    setTimeout(() => {
      displayObservationsForTaxon(taxon);
    }, 100);
  }

  async function loadOptions(filterText) {
    if (filterText.length > 2) {
      return await fetchTaxaByName(taxa, filterText);
    }
  }

  // =====================
  // data
  // =====================

  // loadDemoSpecies();

  function loadDemoSpecies() {
    showDemoSpeciesPrompt = false;

    taxa
      .filter((t) => t.rank === 'species')
      .slice(0, 3)
      .forEach((taxon) => {
        if (taxaHistory.filter((t) => t.taxon_id == taxon.taxon_id).length > 0) {
          return;
        }
        taxaCount += 1;

        displayObservationsForTaxon(taxon);
      });
  }

  function loadIndicatorSpecies() {
    showIndicatorSpeciesPrompt = false;

    taxa
      .filter((t) => t.taxon_group && t.observations_count > 0)
      .forEach((taxon) => {
        if (taxaHistory.filter((t) => t.taxon_id == taxon.taxon_id).length > 0) {
          return;
        }
        taxaCount += 1;

        displayObservationsForTaxon(taxon);
      });
  }

  function displayObservationsForTaxon(taxon) {
    let index = modulo(taxaCount, mapOptions.colorScheme.length);

    let selectedObservations = fecthObservationsByTaxonId(
      allObservations,
      taxon.taxon_id,
      mapOptions.colorScheme[index]
    );

    // update observations
    observations = observations.concat(selectedObservations);
    observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    taxaHistory = taxaHistory.concat({
      taxon_name: formatTaxonDisplayName(taxon),
      image_url: taxon.image_url,
      taxa_count: taxon.taxa_count,
      taxon_id: taxon.taxon_id,
      color: mapOptions.colorScheme[index],
      active: true,
      observations: selectedObservations
    });
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
    loading = false;
  }

  function removeTaxon(e) {
    loading = true;
    let taxonId = Number(e.target.dataset['taxonId']);
    observations = [];

    // update filters & observations
    taxaHistory = taxaHistory.filter((t) => {
      if (t.taxon_id !== taxonId && t.active) {
        observations = observations.concat(t.observations);
      }
      return t.taxon_id !== taxonId;
    });

    // update observations
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
    loading = false;
  }

  function toggleTaxon(e) {
    let taxonId = Number(e.target.dataset['filter']);
    if (!taxonId) {
      return;
    }

    // update filters
    let currentlyActive = true;
    loading = true;
    taxaHistory = taxaHistory.map((t) => {
      if (t.taxon_id === taxonId) {
        currentlyActive = !t.active;
        return { ...t, active: !t.active };
      } else {
        return t;
      }
    });

    // add observations
    if (currentlyActive) {
      observations = observations.concat(
        taxaHistory.filter((t) => t.taxon_id === taxonId)[0]['observations']
      );
      // remove observations
    } else {
      observations = [];
      taxaHistory.forEach((t) => {
        if (t.taxon_id !== taxonId && t.active) {
          observations = observations.concat(t.observations);
        }
      });
    }
    // update observations
    observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
    loading = false;
  }

  function toggleTimeSpans(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);

    // update observations
    timeSpanHistory[targetFilter] = !timeSpanHistory[targetFilter];
  }

  function selectTimeSpanHandler() {
    loading = true;
    // update observations
    observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    timeSpanHistory = {};
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }

    loading = false;
  }

  // =====================
  // map
  // =====================

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/explore_data_map.svelte');
    Map = comp.default;
  });
</script>

<ProjectHeader {project} {user} />

<div class="prose max-w-none">
  <h1>{currentTab.label}</h1>

  <div class="grid lg:grid-cols-10 gap-3 mb-6">
    <div class="lg:col-span-3">
      <h3 class="mt-0">Biodiversity</h3>

      <div class="max-w-lg mb-6 autocomplete">
        <AutoComplete
          searchFunction={loadOptions}
          onChange={handleSelect}
          labelFieldName="label"
          valueFieldName="taxon_id"
          placeholder="Search species name"
          bind:selectedItem={item}
        />
      </div>

      {#if showDemoSpeciesPrompt}
        <label class="cursor-pointer block">
          <input type="checkbox" class="mr-2" on:click={() => loadDemoSpecies()} />
          <span>Show 3 most observed species</span>
        </label>
      {/if}

      {#if showIndicatorSpeciesPrompt}
        <label class="cursor-pointer block">
          <input type="checkbox" class="mr-2" on:click={() => loadIndicatorSpecies()} />
          <span>Show indicator species</span>
        </label>
      {/if}

      <div class="grid lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-2">
        {#each taxaHistory as taxon (taxon.taxon_id)}
          <TaxonFilter {taxon} {toggleTaxon} {removeTaxon} {projectPath} />
        {/each}
      </div>

      {#if taxaHistory.length > 0}
        <TimeSpanFilters
          {mapOptions}
          {selectTimeSpanHandler}
          {groupedObservations}
          {toggleTimeSpans}
          {timeSpanHistory}
        />
      {/if}

      <h3>Environmental Factors</h3>
      <div class="mb-4">
        <label class="cursor-pointer block">
          <input type="checkbox" bind:checked={showClimate} />
          <span>Temperature and Preciptation</span>
        </label>

        <label class="cursor-pointer block">
          <input type="checkbox" bind:checked={showDemoMapLayer} />
          <span>Demo map layer</span>
        </label>
      </div>

      {#if showClimate}
        <span>Temperature and Preciptation 2019</span>
        <ModalMagnify modalname="my-modal">
          <img
            src="/images/{user.username}/{project.slug}/climate-chart-small.png"
            alt="climate chart for {project.location}"
          />
        </ModalMagnify>

        <Modal modalname="my-modal">
          <img
            slot="popup"
            src="/images/{user.username}/{project.slug}/climate-chart.png"
            alt="climate chart for {project.location}"
          />
        </Modal>
      {/if}
    </div>

    <div class="lg:col-span-7 relative">
      {#if loading}
        <Loader />
      {/if}
      <svelte:component
        this={Map}
        {mapOptions}
        {groupedObservations}
        {timeSpanHistory}
        {showDemoMapLayer}
        {taxaHistory}
        {projectPath}
      />
    </div>
  </div>
</div>

<style>
  /* https://github.com/sveltejs/svelte/issues/4796
https://gitanswer.com/svelte-add-an-option-to-prevent-removal-of-unused-css-selectors-classes-typescript-769226779 */

  /* the class applied to the main control */
  .autocomplete :global(.autocomplete) {
    width: 100%;
    font-weight: 400;
    background-image: none;
    padding: 0;
  }

  .autocomplete :global(.select) {
    min-height: 0;
  }

  /* the class applied to the input list */
  .autocomplete :global(.autocomplete-input) {
    border-color: var(--border-color);
    padding: 0.5rem;
  }

  /* the class applied to the dropdown list */
  .autocomplete :global(.autocomplete-list) {
    z-index: 1001;
    border-color: var(--border-color);
  }

  /* autocomplete-list-item */
  .autocomplete :global(.autocomplete-list-item.selected) {
    background-color: var(--bg-gray);
    color: var(--text-color);
  }

  h3:first-of-type {
    margin-top: 0;
  }
</style>
