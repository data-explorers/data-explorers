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
  import RangeSlider from 'svelte-range-slider-pips';

  import ProjectHeader from '$lib/components/project_header.svelte';
  import Modal from '$lib/components/modal.svelte';
  import ModalMagnify from '$lib/components/modal-magnify.svelte';
  import TaxonFilter from '$lib/components/ed_taxon_filter.svelte';
  import { modulo, colorsSixDiverge, colorsSixTolVibrant, colorsSixTolBright } from '$lib/mapUtils';
  import {
    fetchTaxaByName,
    fecthObservationsByTaxonId,
    getObservationsDateRange,
    getDateSliderValues
  } from '$lib/dataUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';

  export let project;
  export let user;
  export let currentTab;
  export let allObservations;
  export let taxa;
  let colorScheme = colorsSixTolBright;
  let observations = [];
  let groupedObservations = {};
  let item = '';
  let selectedTaxa = [];
  let showDemoPrompt = true;
  let availableDates = [];
  let sliderValues = [];
  let timeFirstIndex;
  let timeLastIndex;

  // =====================
  // type ahead select
  // =====================

  function handleSelect(event) {
    if (!event || !event.label) return;
    showDemoPrompt = false;

    let taxonName = event.label;
    let taxonId = event.value;
    if (Object.keys(groupedObservations).includes('' + taxonId)) {
      return;
    }

    displayObservationsForTaxon(taxonName, taxonId);
  }

  async function loadOptions(filterText) {
    return await fetchTaxaByName(taxa, filterText);
  }

  // =====================
  // data
  // =====================


  function loadDemoSpecies() {
    showDemoPrompt = false;

    let topTaxa = taxa.slice(0, 3);
    topTaxa.forEach((taxon) => {
      if (Object.keys(groupedObservations).includes('' + taxon.taxon_id)) {
        return;
      }

      let taxonName = formatTaxonDisplayName(taxon);
      let taxonId = taxon.taxon_id;

      displayObservationsForTaxon(taxonName, taxonId);
    });
  }

  function displayObservationsForTaxon(taxonName, taxonId) {
    let index = modulo(selectedTaxa.length, colorScheme.length);

    selectedTaxa = selectedTaxa.concat({
      taxonName,
      taxonId,
      color: colorScheme[index],
      active: true
    });

    let selectedObservations = fecthObservationsByTaxonId(
      allObservations,
      taxonId,
      colorScheme[index]
    );
    observations = observations.concat(selectedObservations);
    groupedObservations[taxonId] = selectedObservations;
  }

  function handleRangeStop(e) {
    let startDate = availableDates[e.detail.values[0]];
    let endDate = availableDates[e.detail.values[1]];

    let tempObservations = [].concat(...Object.values(groupedObservations));

    observations = tempObservations
      .filter((o) => {
        let date = new Date(o.time_observed_at);
        return date >= startDate && date <= endDate;
      })
      .sort();
    console.log(
      startDate,
      endDate,
      observations.map((o) => o.time_observed_at)
    );
  }

  function removeTaxon(e) {
    let taxonId = Number(e.target.dataset['taxonId']);

    selectedTaxa = selectedTaxa.filter((t) => t.taxonId !== taxonId);
    observations = observations.filter((o) => o.taxon_id !== taxonId);
    delete groupedObservations[taxonId];
  }

  function toggleTaxon(e) {
    let taxonId = Number(e.target.dataset['taxonId']);

    let currentlyActive = true;
    selectedTaxa = selectedTaxa.map((t) => {
      if (t.taxonId === taxonId) {
        currentlyActive = !t.active;
        return { ...t, active: !t.active };
      } else {
        return t;
      }
    });

    if (currentlyActive) {
      observations = observations.concat(groupedObservations[taxonId]);
    } else {
      observations = observations.filter((o) => o.taxon_id !== taxonId);
    }
  }

  // =====================
  // map
  // =====================

  let mapOptions = {
    zoom: project.zoom,
    latitude: project.latitude,
    longitude: project.longitude,
    displayType: project.taxaDisplayType
  };

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/explore_data_map.svelte');
    Map = comp.default;
  });

  // =====================
  // init
  // =====================


  $: item;
  $: if (item) {
    loadOptions(item);
  }

  loadDemoSpecies();

  availableDates = getObservationsDateRange(allObservations);
  sliderValues = getDateSliderValues(availableDates);

</script>

<ProjectHeader {project} {user} />
<div class="prose max-w-none">
  <h1>{currentTab.label}</h1>
  {availableDates.length - 1}<br />
  {sliderValues}
  {JSON.stringify(selectedTaxa)}

  <div class="grid lg:grid-cols-10 gap-3 mb-6">
    <div class="lg:col-span-3">
      <h3 class="mt-0">Biodiversity</h3>

      <div class="max-w-lg mb-6 autocomplete">
        <AutoComplete
          searchFunction={loadOptions}
          onChange={handleSelect}
          localFiltering="false"
          labelFieldName="label"
          valueFieldName="id"
          maxItemsToShowInList="8"
          hideArrow="true"
          showClear="true"
          placeholder="Search species name"
          bind:selectedItem={item}
        />
      </div>

      {#if showDemoPrompt}
        <input type="checkbox" class="mr-2" on:click={() => loadDemoSpecies()} />Show most observed
        species
      {/if}

      {#each selectedTaxa as taxon}
        <TaxonFilter {taxon} {toggleTaxon} {removeTaxon} />
      {/each}

      <div class="mr-8">
        <RangeSlider
          handleFormatter={(v) => availableDates[v]}
          float
          on:stop={handleRangeStop}
          range
          values={sliderValues}
          min={0}
          max={sliderValues[sliderValues.length - 1]}
          pips
          first="label"
          last="label"
        />
      </div>

      <Datepicker />
      <Datepicker />

      <h3>Environmental Factors</h3>

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
    </div>

    <div class="lg:col-span-7">
      <svelte:component this={Map} {mapOptions} {observations} />
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
