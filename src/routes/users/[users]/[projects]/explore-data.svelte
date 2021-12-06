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
  import Select from 'svelte-select';

  import ProjectHeader from '$lib/components/project_header.svelte';
  import { formatTaxonDisplayName, truncate } from '$lib/formatUtils';
  import {
    modulo,
    getMonthName,
    coldMonths,
    radiusZoom,
    rectangleLatitudeZoom,
    rectangleLongitudeZoom,
    colorsSixDiverge
  } from '$lib/mapUtils';

  export let project;
  export let user;
  export let currentTab;
  export let allObservations;
  export let taxa;
  let colorScheme = colorsSixDiverge;
  let observations = [];
  let groupedObservations = {};
  let keyword = '';
  // let groupedKeywords = {};
  // let selectedTaxa = [
  //   {taxonId: 1, taxonName: 'Red-headed Woodpecker (Melanerpes erythrocephalus) ',  color: colorScheme[0]},
  //   {taxonId: 1, taxonName: 'Red Fox (Vulpes vulpes)', color: colorScheme[1]},
  //   {taxonId: 1, taxonName: 'abc def (abc)', color: colorScheme[2]}
  // ]
  let selectedTaxa = [];

  // =====================
  // type ahead select
  // =====================

  const fetchTaxa = (filterText) => {
    return new Promise((resolve, reject) => {
      let results = [];
      if (filterText.length > 2) {
        keyword = filterText;

        // search by common name
        results = taxa.filter((taxon) => {
          if (taxon.common_name) {
            return taxon.common_name.toLowerCase().includes(filterText.toLowerCase());
          }
        });

        // search by scientific name
        if (results.length === 0) {
          results = taxa.filter((taxon) => {
            if (taxon.scientific_name) {
              return taxon.scientific_name.toLowerCase().includes(filterText.toLowerCase());
            }
          });
        }

        results = results.map((t) => {
          return {
            value: t.taxon_id,
            label: formatTaxonDisplayName(t)
          };
        });
      }
      resolve(results);
    });
  };

  function handleSelect(event) {
    let taxonName = event.detail.label;
    let taxonId = event.detail.value;
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

    console.log('handleSelect', taxonId, Object.keys(groupedObservations), observations.length);
  }

  async function loadOptions(filterText) {
    return await fetchTaxa(filterText);
  }


  // =====================
  // map
  // =====================


  function removeTaxon(e) {
    let taxonId = Number(e.target.dataset['taxonId']);
    console.log('removeTaxon', taxonId, Object.keys(groupedObservations), observations.length);

    selectedTaxa = selectedTaxa.filter((t) => t.taxonId !== taxonId);
    observations = observations.filter((o) => o.taxon_id !== taxonId);
    delete groupedObservations[taxonId];
    console.log('removeTaxon', taxonId, Object.keys(groupedObservations), observations.length);
  }

  function toggleTaxon(e) {
    let taxonId = Number(e.target.dataset['taxonId']);
    console.log('toggleTaxon', taxonId, observations.length);

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

    console.log('toggleTaxon', taxonId, observations.length);
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
</script>

<ProjectHeader {project} {user} />

{JSON.stringify(selectedTaxa)}<br />
keyword: {keyword}, observations: {observations.length}

<h1>{currentTab.label}</h1>

<div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  justify-center gap-3">
  {#each selectedTaxa as taxon}
    <div class="border p-1">
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
      <span class="text-sm">{truncate(taxon.taxonName)}</span>
    </div>
  {/each}
</div>

<div class="themed my-8">
  <Select {loadOptions} on:select={handleSelect} />
</div>

<svelte:component this={Map} {mapOptions} {observations} />

<style>
  .themed {
    --listZIndex: 1001;
  }
</style>
