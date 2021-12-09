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

  import ProjectHeader from '$lib/components/project_header.svelte';
  import { modulo, colorsSixDiverge } from '$lib/mapUtils';
  import { fetchTaxonByName } from '$lib/dataUtils';
  import Modal from '$lib/components/modal.svelte';
  import ModalMagnify from '$lib/components/modal-magnify.svelte';

  export let project;
  export let user;
  export let currentTab;
  export let allObservations;
  export let taxa;
  let colorScheme = colorsSixDiverge;
  let observations = [];
  let groupedObservations = {};
  let item = '';
  let selectedTaxa = [];

  // =====================
  // type ahead select
  // =====================

  function handleSelect(event) {
    if (!event || !event.label) return;

    let taxonName = event.label;
    let taxonId = event.value;
    let index = modulo(selectedTaxa.length, colorScheme.length);

    if (Object.keys(groupedObservations).includes('' + taxonId)) {
      return;
    }

    selectedTaxa = selectedTaxa.concat({
      taxonName,
      taxonId,
      color: colorScheme[index],
      active: true
    });

    let selectedObservations = allObservations
      .filter((o) => o.taxon_id === taxonId)
      .map((o) => {
        let dateObj = o.time_observed_at && new Date(o.time_observed_at);
        let month = o.time_observed_at ? dateObj.getMonth() : 'unknown';
        let year = o.time_observed_at ? dateObj.getYear() : 'unknown';

        return {
          ...o,
          month,
          year,
          color: colorScheme[index],
          fillColor: colorScheme[index]
        };
      });
    observations = observations.concat(selectedObservations);
    groupedObservations[taxonId] = selectedObservations;
  }

  async function loadOptions(filterText) {
    return await fetchTaxonByName(taxa, filterText);
  }

  // =====================
  // map
  // =====================

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

  $: item;
  $: if (item && item.length > 2) {
    loadOptions(item);
  }

  let zoo = false;
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
          localFiltering="false"
          labelFieldName="label"
          valueFieldName="value"
          maxItemsToShowInList="8"
          hideArrow="true"
          showClear="true"
          placeholder="Search species name"
          bind:selectedItem={item}
        />
      </div>

      {#each selectedTaxa as taxon}
        <div class="border p-1 mb-2">
          <input
            type="checkbox"
            checked="checked"
            data-taxon-id={taxon.taxonId}
            on:click={toggleTaxon}
          />

          <svg height="20" width="20" class="inline">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke={taxon.color}
              stroke-width="3"
              fill={taxon.color}
              fill-opacity=".20"
            />
          </svg>
          <button class="float-right" data-taxon-id={taxon.taxonId} on:click={removeTaxon}>
            <svg
              data-taxon-id={taxon.taxonId}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-4 h-4  stroke-current"
            >
              <path
                data-taxon-id={taxon.taxonId}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <span class="text-sm">{taxon.taxonName}</span>
        </div>
      {/each}

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
