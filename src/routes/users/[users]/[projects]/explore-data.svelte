<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let pathParts = page.path.split('/');
    let currentTab = project.tabs_project.filter(
      (tab) => tab.link === pathParts[pathParts.length - 1]
    )[0];

    let taxaData = await import(`../../../../lib/data/${page.params.projects}/taxa.json`);
    let taxa = taxaData.default;
    let observationData = await import(
      `../../../../lib/data/${page.params.projects}/observations.json`
    );
    let allObservations = observationData.default;

    return { props: { project, user, currentTab, allObservations, taxa } };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import AutoComplete from 'simple-svelte-autocomplete';
  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';

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
  let observations = [];
  let item = '';
  let taxaHistory = []; // all taxa that
  let showDemoPrompt = true;
  let orderByValue = 'oldest';
  let groupedObservations = []; // what is sent to the Map and TimeSpanFilters
  let timeSpanHistory = {}; //
  let showClimate = false;
  let showDemoMapLayer = false;

  allObservations = allObservations.filter((o) => o.latitude && o.longitude);

  function logging() {
    console.log('observations', observations);
    console.log('taxaHistory', taxaHistory);
    console.log('groupedObservations', groupedObservations);
    console.log('timeSpanHistory', timeSpanHistory);
  }

  function logTime(message) {
    console.log(new Date().toUTCString(), message);
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

  function handleSelect(event) {
    if (!event || !event.label) return;
    showDemoPrompt = false;

    // prevent adding same taxon twice
    if (taxaHistory.filter((t) => t.taxonId == event.id).length > 0) {
      return;
    }

    setTimeout(() => {
      displayObservationsForTaxon(event.label, event.id);
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

  function loadDemoSpecies() {
    showDemoPrompt = false;

    taxa.slice(0, 5).forEach((taxon) => {
      if (taxaHistory.filter((t) => t.taxonId == taxon.taxon_id).length > 0) {
        return;
      }

      displayObservationsForTaxon(formatTaxonDisplayName(taxon), taxon.taxon_id);
    });
  }

  function displayObservationsForTaxon(taxonName, taxonId) {
    let index = modulo(taxaHistory.length, mapOptions.colorScheme.length);

    let selectedObservations = fecthObservationsByTaxonId(
      allObservations,
      taxonId,
      mapOptions.colorScheme[index]
    );

    // update observations
    observations = observations.concat(selectedObservations);
    observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    taxaHistory = taxaHistory.concat({
      taxonName,
      taxonId,
      color: mapOptions.colorScheme[index],
      active: true,
      observations: selectedObservations
    });
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
  }

  function removeTaxon(e) {
    let taxonId = Number(e.target.dataset['taxonId']);

    // update observations
    observations = observations.filter((o) => o.taxon_id !== taxonId);
    observations = observations.filter((o) => {
      return !o.taxon_ids.split('|').includes('' + taxonId);
    });

    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    taxaHistory = taxaHistory.filter((t) => t.taxonId !== taxonId);
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
  }

  function toggleTaxon(e) {
    let taxonId = Number(e.target.dataset['taxonId']);

    // update filters
    let currentlyActive = true;
    taxaHistory = taxaHistory.map((t) => {
      if (t.taxonId === taxonId) {
        currentlyActive = !t.active;
        return { ...t, active: !t.active };
      } else {
        return t;
      }
    });

    // update observations
    if (currentlyActive) {
      observations = observations.concat(
        taxaHistory.filter((t) => t.taxonId === taxonId)[0]['observations']
      );
    } else {
      observations = observations.filter((o) => o.taxon_id !== taxonId);
      observations = observations.filter((o) => {
        return !o.taxon_ids.split('|').includes('' + taxonId);
      });
    }
    observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
  }

  function toggleTimeSpans(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);

    // update observations
    timeSpanHistory[targetFilter] = !timeSpanHistory[targetFilter];
  }

  function selectTimeSpanHandler() {
    // update observations
    observations = sortObservations(observations, orderByValue, mapOptions.observationsTimeSpan);
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    timeSpanHistory = {};
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }
  }

  // =====================
  // map
  // =====================

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/explore_data_map.svelte');
    Map = comp.default;
  });
  let foo = [];
  $: foo = taxaHistory.map((t) => ({
    taxonName: t.taxonName,
    color: t.color,
    taxonId: t.taxonId,
    active: t.active
  }));

  // =====================
  // init
  // =====================
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
          valueFieldName="id"
          placeholder="Search species name"
          bind:selectedItem={item}
        />
      </div>

      {#if showDemoPrompt}
        <label class="cursor-pointer">
          <input type="checkbox" class="mr-2" on:click={() => loadDemoSpecies()} />
          <span class="label-text">Show 5 most observed species</span>
        </label>
      {/if}

      {#each taxaHistory as taxon (taxon.taxonId)}
        <TaxonFilter {taxon} {toggleTaxon} {removeTaxon} />
      {/each}

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
          <span class="label-text">Temperature and Preciptation</span>
        </label>

        <label class="cursor-pointer block">
          <input type="checkbox" bind:checked={showDemoMapLayer} />
          <span class="label-text">Demo map layer</span>
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

    <div class="lg:col-span-7">
      <svelte:component
        this={Map}
        {mapOptions}
        {groupedObservations}
        {timeSpanHistory}
        {showDemoMapLayer}
        {taxaHistory}
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
