<script context="module">
  // TODO:
  // minimize menu
  // animate by week over time

  import settings from '$lib/data/settings.json';
  import { formatRawTaxa, formatRawObservations } from '$lib/convert_data';
  import { base } from '$app/paths';

  export async function load({ params, url }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];
    let pathParts = url.pathname.split('/');
    let currentTab = project.tabs_project.filter(
      (tab) => tab.link === pathParts[pathParts.length - 1]
    )[0];

    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    let taxaData = await import(`../../../../lib/data/${params.projects}/taxa.csv`);
    let taxa = formatRawTaxa(taxaData.default);
    let observationData = await import(`../../../../lib/data/${params.projects}/observations.csv`);
    let projectObservations = formatRawObservations(observationData.default);

    let hasClimateGraph =
      project.graphs && project.graphs.some((g) => g.type == 'temperature_precipation');
    let climateChartData;
    let climateChartOptions;
    if (hasClimateGraph) {
      climateChartOptions = project.graphs.filter((g) => g.type == 'temperature_precipation')[0];
      let dataFile = await import(
        `../../../../lib/data/${params.projects}/${climateChartOptions.file}.csv`
      );
      climateChartData = dataFile.default;
    }

    if (project.map_layers) {
      project.map_layers.forEach(async (layer, index) => {
        project.map_layers[index]['data'] = await import(
          `../../../../lib/data/${params.projects}/map_layers/${layer.file}.geojson`
        );
      });
    }
    return {
      props: {
        project,
        org,
        currentTab,
        projectObservations,
        taxa,
        projectPath,
        climateChartData,
        climateChartOptions
      }
    };
  }
</script>

<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import AutoComplete from 'simple-svelte-autocomplete';
  import { modulo, lightenDarkenColor } from '$lib/miscUtils';
  import { darkGray, defaultColorScheme, getMapTiles } from '$lib/mapUtils';
  import {
    fetchTaxaByName,
    fetchObservationsByTaxonId,
    sortObservations,
    groupObservationsbyTime,
    updateTimeSpans
  } from '$lib/dataUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { tooltip } from '$lib/tooltip.js';
  import {
    setupExploreDataAllChart,
    setupExploreDataMonthChart,
    setupExploreDataYearChart,
    drawChart
  } from '$lib/charts/chartUtils';

  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';
  import Loader from '$lib/components/loader.svelte';
  import TaxonFilter from '$lib/components/ed_taxon_filter.svelte';
  import ObservationData from '$lib/components/observation_data.svelte';
  import InfoIcon from '$lib/components/icons/info.svelte';
  import MapSpeciesList from '$lib/components/map_species_list.svelte';
  import ShowMore from '$lib/components/show_more.svelte';
  import XIcon from '$lib/components/icons/x.svelte';
  import ClimateChart from '$lib/components/charts/climate_chart.svelte';
  import barChartGroupJson from '$lib/charts/bar_chart_group.json';
  import barChartJson from '$lib/charts/bar_chart.json';
  import ProjectHeader from '$lib/components/project_header.svelte';
  import { speciesRanks } from '$lib/data/constants';

  export let project;
  export let org;
  export let currentTab;
  export let projectObservations;
  export let taxa;
  export let projectPath;
  export let climateChartData;
  export let climateChartOptions;

  $: if (taxaHistory.length === 0) {
    timeSpanHistory = {};
    observationHighlight = null;
  }

  // format data for charts
  $: if (taxaHistory.length > 0 && syncMapAndCharts) {
    let chartObservations = observationsOnMap;
    let spec;
    if (mapOptions.observationsTimeSpan == 'all') {
      spec = setupExploreDataAllChart(
        barChartSpec,
        inactiveOpacity,
        taxaHistory,
        chartObservations,
        project
      );
    } else if (mapOptions.observationsTimeSpan == 'month') {
      spec = setupExploreDataMonthChart(
        barChartGroupSpec,
        inactiveOpacity,
        taxaHistory,
        timeSpanHistory,
        chartObservations,
        project
      );
    } else {
      spec = setupExploreDataYearChart(
        barChartGroupSpec,
        inactiveOpacity,
        taxaHistory,
        timeSpanHistory,
        chartObservations,
        project
      );
    }
    drawChart(spec, chartSelector);
  }

  // format data for synced charts
  $: if (taxaHistory.length > 0 && !syncMapAndCharts) {
    let chartObservations = Object.values(observations);
    let spec;
    if (mapOptions.observationsTimeSpan == 'all') {
      spec = setupExploreDataAllChart(
        barChartSpec,
        inactiveOpacity,
        taxaHistory,
        chartObservations,
        project
      );
    } else if (mapOptions.observationsTimeSpan == 'month') {
      spec = setupExploreDataMonthChart(
        barChartGroupSpec,
        inactiveOpacity,
        taxaHistory,
        timeSpanHistory,
        chartObservations,
        project
      );
    } else {
      spec = setupExploreDataYearChart(
        barChartGroupSpec,
        inactiveOpacity,
        taxaHistory,
        timeSpanHistory,
        chartObservations,
        project
      );
    }
    drawChart(spec, chartSelector);
  }

  let item = '';
  // all observations for searched taxa; not affected by taxa or time filters
  let observations = {};
  // observation ids for searched taxa
  let observationsIds = new Set();
  // observation ids filtered by active taxa
  let activeObservationsIds = new Set();
  // observations filtered by active taxa, grouped by time span
  let groupedObservations = [];
  // observations filter by active taxa, time, map bbox
  let observationsOnMap = [];
  let taxaHistory = []; // all searched taxa
  let timeSpanHistory = {}; // all the time spans
  let taxaCount = 0;
  let loading = false;
  let inactiveOpacity = 0.25;
  let mounted = false;
  let barChartSpec = JSON.parse(JSON.stringify(barChartJson));
  let barChartGroupSpec = JSON.parse(JSON.stringify(barChartGroupJson));
  let observationHighlight;
  let observationsOnMapCount = 0;
  let clusterLimit = 1000;
  let speciesOnMapCount = 0;
  let speciesList = [];
  let observersOnMapCount = 0;
  let showSpeciesList = false;
  let mapCenter = {};
  let chartSelector = '#ed-chart';
  let syncMapAndCharts = false;
  let orderByValue = 'oldest';
  let showObservationHighlight = false;
  let showBiodiversity = true;
  let showEnvironment = true;
  let showClimate = false;
  let hasClimate = project.slug !== 'go-sea';
  let activeTab = 'explore-data';

  projectObservations = projectObservations.filter((o) => o.latitude && o.longitude);

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

    // prevent adding same taxon twice
    if (taxaHistory.filter((t) => t.taxon_id == taxon.taxon_id).length > 0) {
      return;
    }
    taxaCount += 1;

    // use settimeout so that selecting the taxa finishes, and then fetching
    // the observations is called.
    loading = true;
    setTimeout(() => {
      addObservationsForTaxon(taxon);
    }, 100);
  }

  async function loadOptions(filterText) {
    if (filterText.length > 2) {
      return await fetchTaxaByName(taxa, filterText);
    }
  }

  // =====================
  // taxa sets
  // =====================
  let showTaxaSets = true;

  let exploreDataTaxaSets = {
    top_five_all: {
      method: loadTopFiveSpecies,
      label: 'Show 5 most observed species',
      taxa_ids: [],
      active: false
    },
    indicator_species: {
      method: loadIndicatorSpecies,
      label: 'Show indicator species',
      taxa_ids: [],
      active: false
    },
    top_five_mammals: {
      method: loadTopFiveMammals,
      label: 'Show 5 most observed mammals',
      taxa_ids: [],
      active: false
    },
    top_five_plants: {
      method: loadTopFivePlants,
      label: 'Show 5 most observed plants',
      taxa_ids: [],
      active: false
    },
    top_five_fungi: {
      method: loadTopFiveFungi,
      label: 'Show 5 most observed fungi',
      taxa_ids: [],
      active: false
    }
  };

  $: taxaSets = project.explore_data_taxa_sets.map((taxaSet) => exploreDataTaxaSets[taxaSet]);

  function loadTopFiveSpecies() {
    let selectedTaxa = taxa.filter((t) => speciesRanks.includes(t.rank));
    loadTopFive('top_five_all', selectedTaxa);
  }

  function loadTopFiveMammals() {
    let taxonId = '40151';
    let selectedTaxa = taxa
      .filter((t) => speciesRanks.includes(t.rank))
      .filter((t) => t.taxon_ids.split('|').includes(taxonId));
    loadTopFive('top_five_mammals', selectedTaxa);
  }

  function loadTopFivePlants() {
    let taxonId = '47126';
    let selectedTaxa = taxa
      .filter((t) => speciesRanks.includes(t.rank))
      .filter((t) => t.taxon_ids.split('|').includes(taxonId));
    loadTopFive('top_five_plants', selectedTaxa);
  }

  function loadTopFiveFungi() {
    let taxonId = '47170';
    let selectedTaxa = taxa
      .filter((t) => speciesRanks.includes(t.rank))
      .filter((t) => t.taxon_ids.split('|').includes(taxonId));
    loadTopFive('top_five_fungi', selectedTaxa);
  }

  function loadTopFive(taxaSet, selectedTaxa) {
    // add taxa
    if (exploreDataTaxaSets[taxaSet]['taxa_ids'].length == 0) {
      // get top five taxa
      selectedTaxa = selectedTaxa.sort((a, b) => b.taxa_count - a.taxa_count).slice(0, 5);
      addTaxaForTaxaSet(taxaSet, selectedTaxa);
      // remove taxa
    } else {
      removeTaxaForTaxaSet(taxaSet);
    }
  }

  function loadIndicatorSpecies() {
    let taxaSet = 'indicator_species';
    if (exploreDataTaxaSets[taxaSet]['taxa_ids'].length == 0) {
      let selectedTaxa = taxa
        .filter((t) => t.taxon_group && t.observations_count > 0)
        .sort((a, b) => b.taxa_count - a.taxa_count);

      addTaxaForTaxaSet(taxaSet, selectedTaxa);
    } else {
      removeTaxaForTaxaSet(taxaSet);
    }
  }

  function addTaxaForTaxaSet(taxaSet, selectedTaxa) {
    // keep track which taxa belongs to given set
    selectedTaxa.forEach((t) => {
      exploreDataTaxaSets[taxaSet]['taxa_ids'].push(t.taxon_id);
    });

    // add taxa only if it is not in taxaHistory
    let selectedTaxaIds = taxaHistory.map((t) => t.taxon_id);
    selectedTaxa
      .filter((t) => !selectedTaxaIds.includes(t.taxon_id))
      .forEach((taxon) => {
        taxaCount += 1;
        addObservationsForTaxon(taxon);
      });

    exploreDataTaxaSets[taxaSet]['active'] = true;
  }

  function removeTaxaForTaxaSet(taxaSet) {
    // keep track which taxa belongs to other taxa sets
    let keepTaxonIds = [];
    for (let mySet in exploreDataTaxaSets) {
      if (mySet !== taxaSet) {
        keepTaxonIds = keepTaxonIds.concat(exploreDataTaxaSets[mySet]['taxa_ids']);
      }
    }

    // remove taxa that is only found in given set
    exploreDataTaxaSets[taxaSet]['taxa_ids'].forEach((id) => {
      if (!keepTaxonIds.includes(id)) {
        removeTaxon({ target: { dataset: { taxonId: id } } });
      }
    });
    exploreDataTaxaSets[taxaSet]['taxa_ids'] = [];
    exploreDataTaxaSets[taxaSet]['active'] = false;
  }

  // =====================
  // process observations data
  // =====================

  function addObservationsForTaxon(taxon) {
    loading = true;
    let index = modulo(taxaCount, mapOptions.colorScheme.length);

    let newObservations = fetchObservationsByTaxonId(
      projectObservations,
      taxon.taxon_id,
      mapOptions.colorScheme[index]
    );

    // update observations & observationsIds
    newObservations.forEach((o) => {
      // overwrite existing observations to get latest color
      observations[o.id] = o;
      observationsIds.add(o.id);
      activeObservationsIds.add(o.id);
    });

    groupedObservations = updateGroupObservations();
    logObservations('addObservationsForTaxon');

    observationHighlight = newObservations[0];

    // update taxa filters
    let tiles = getMapTiles(taxon.taxon_id);
    let color = mapOptions.colorScheme[index];
    let lighterColor = lightenDarkenColor(color, 10);

    taxaHistory = taxaHistory.concat({
      taxon_name: formatTaxonDisplayName(taxon),
      image_url: taxon.image_url,
      taxa_count: taxon.taxa_count,
      taxon_id: taxon.taxon_id,
      color: color,
      rank: taxon.rank,
      active: true,
      // store observationIds to handle cases when user searchers for multiple
      // taxa that share a common ancestry
      observationIds: newObservations.map((o) => o.id),
      showInatGrid: false,
      InatGridUrl: `${tiles.InatGrid.url}&color=%23${lighterColor}`,
      showInatTaxonRange: false,
      InatTaxonRangeUrl: `${tiles.InatTaxonRange.url}?color=%23${lighterColor}`
    });

    // update time span filters
    if (mapOptions.observationsTimeSpan !== 'all') {
      // keep existing time span filters as is, and set new ones to true
      groupedObservations.forEach(
        (v, k) =>
          (timeSpanHistory[k] = timeSpanHistory[k] !== undefined ? timeSpanHistory[k] : true)
      );
    }

    loading = false;
  }

  // =====================
  // taxa filters
  // =====================

  function resetTaxa() {
    showObservationHighlight = false;
    observationHighlight = null;

    item = '';
    // all observations for searched taxa; not affected by taxa or time filters
    observations = {};
    // observation ids for searched taxa
    observationsIds = new Set();
    // observation ids filtered by active taxa
    activeObservationsIds = new Set();
    // observations filtered by active taxa, grouped by time span
    groupedObservations = [];
    // observations filter by active taxa, time, map bbox
    observationsOnMap = [];
    taxaHistory = []; // all searched taxa
    timeSpanHistory = {}; // all the time spans

    Object.keys(exploreDataTaxaSets).forEach((taxaSet) => {
      exploreDataTaxaSets[taxaSet]['active'] = false;
      exploreDataTaxaSets[taxaSet]['taxa_ids'] = [];
    });

    logObservations('resetTaxa');
  }

  function removeTaxon(e) {
    loading = true;
    let taxonId = Number(e.target.dataset['taxonId']);

    // update filters & observationsIds
    activeObservationsIds = new Set();
    observationsIds = new Set();
    taxaHistory = taxaHistory.filter((taxon) => {
      if (taxon.taxon_id !== taxonId) {
        if (taxon.active) {
          taxon.observationIds.forEach((id) => {
            updateObservationColor(taxon.color, id);
            activeObservationsIds.add(id);
            observationsIds.add(id);
          });
        } else {
          taxon.observationIds.forEach((id) => {
            observationsIds.add(id);
          });
        }
      }
      return taxon.taxon_id !== taxonId;
    });

    // close observation popup if it part of the removed taxon
    showObservationHighlight = observationsIds.has(observationHighlight.id);

    // remove observations for deleted taxon
    let tempObservations = {};
    observationsIds.forEach((id) => (tempObservations[id] = observations[id]));
    observations = tempObservations;
    logObservations('removeTaxon');

    groupedObservations = updateGroupObservations();
    logObservations('removeTaxon');

    // update filters
    // delete filters for time spans that no longer exist
    Object.keys(timeSpanHistory).forEach((k) => {
      if (!groupedObservations.has(Number(k))) {
        delete timeSpanHistory[k];
      }
    });

    loading = false;
  }

  function toggleTaxon(e) {
    loading = true;
    let taxonId = Number(e.target.dataset['taxonId']);
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

    // show observations
    if (currentlyActive) {
      let taxon = taxaHistory.filter((t) => t.taxon_id === taxonId)[0];
      taxon.observationIds.forEach((id) => {
        updateObservationColor(taxon.color, id);
        activeObservationsIds.add(id);
      });
      // hide observations
    } else {
      activeObservationsIds = new Set();
      taxaHistory.forEach((taxon) => {
        if (taxon.taxon_id !== taxonId) {
          if (taxon.active) {
            taxon.observationIds.forEach((id) => {
              updateObservationColor(taxon.color, id);
              activeObservationsIds.add(id);
            });
          }
        }
      });
    }

    // update observations
    groupedObservations = updateGroupObservations();

    // update filters
    // delete filters for time spans that no longer exist
    if (mapOptions.observationsTimeSpan !== 'all') {
      Object.keys(timeSpanHistory).forEach((k) => {
        if (!groupedObservations.has(Number(k))) {
          delete timeSpanHistory[k];
        }
      });
      // keep existing time span filters as is, and set new ones to true
      groupedObservations.forEach((v, k) => {
        timeSpanHistory[k] = timeSpanHistory[k] !== undefined ? timeSpanHistory[k] : true;
      });
    }

    logObservations('toggleTaxon');

    loading = false;
  }

  function updateGroupObservations() {
    // select, sort, and group active observations
    let activeObservations = [...activeObservationsIds].map((id) => observations[id]);
    activeObservations = sortObservations(
      activeObservations,
      orderByValue,
      mapOptions.observationsTimeSpan
    );
    return groupObservationsbyTime(activeObservations, mapOptions.observationsTimeSpan);
  }

  function updateObservationColor(color, id) {
    // if (observationsOnMap.length > clusterLimit) { return}
    // reassign color to handle cases when taxa from same lineage are toggled
    let obs = observations[id];
    obs.color = color;
    obs.fillColor = color;
  }

  function logObservations(message) {
    console.log(
      message,
      `observations: ${Object.keys(observations).length}`,
      `observationIds: ${observationsIds.size}`,
      `activeObservationsIds: ${activeObservationsIds.size}`
    );
  }

  // =====================
  // time span filters
  // =====================

  function toggleTimeSpans(e) {
    timeSpanHistory = updateTimeSpans(e, timeSpanHistory);
  }

  function selectTimeSpanHandler() {
    loading = true;
    let tmpObservations = sortObservations(
      Object.values(observations).filter((o) => activeObservationsIds.has(o.id)),
      orderByValue,
      mapOptions.observationsTimeSpan
    );
    groupedObservations = groupObservationsbyTime(tmpObservations, mapOptions.observationsTimeSpan);

    // update filters
    // reset all time span filters when changing time span types
    timeSpanHistory = {};
    if (mapOptions.observationsTimeSpan !== 'all') {
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = true));
    }

    loading = false;
  }

  // =====================
  // charts
  // =====================

  // =====================
  // map
  // =====================

  function toggleInatGrid(taxon_id) {
    let index = taxaHistory.map((t) => t.taxon_id).indexOf(taxon_id);
    taxaHistory[index].showInatGrid = !taxaHistory[index].showInatGrid;
  }

  function toggleInatTaxonRange(taxon_id) {
    let index = taxaHistory.map((t) => t.taxon_id).indexOf(taxon_id);
    taxaHistory[index].showInatTaxonRange = !taxaHistory[index].showInatTaxonRange;
  }

  function zoomToObservation(e) {
    mapCenter = e.detail;
  }

  function updateStatsHandler(e) {
    observationsOnMapCount = e.detail.observationsOnMapCount;
    speciesOnMapCount = e.detail.speciesOnMapCount;
    speciesList = e.detail.speciesList;
    observersOnMapCount = e.detail.observersOnMapCount;
    let obs = e.detail.observationsOnMap;

    if (!Array.isArray(obs)) {
      observationsOnMap = [];
      obs.forEach((v, k) => {
        observationsOnMap = observationsOnMap.concat(v);
      });
    } else {
      observationsOnMap = obs;
    }
  }

  function changeObservation(e) {
    showObservationHighlight = true;
    observationHighlight = observations[e.detail.observation_id];
  }

  // =====================
  // life cycle
  // =====================

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/explore_data_map.svelte');
    Map = comp.default;
    loading = false;
    mounted = true;
  });
</script>

<ProjectHeader {org} {project} {activeTab} />

<div class="prose max-w-none">
  <h1 class="px-3">{currentTab.label}</h1>

  <div class="grid lg:grid-cols-10 mb-6">
    <div class="lg:col-span-3 border-0 lg:border-r-2 border-t">
      <div class="grid">
        <!-- searched taxa -->
        <h3 class="bg-gray-200 mt-0 px-3 py-1">
          Biodiversity
          <ShowMore
            showMore={true}
            position={'normal'}
            on:toggleShowMore={(e) => (showBiodiversity = e.detail.showMore)}
          />
        </h3>

        {#if showBiodiversity}
          <section class="px-3 mb-3" transition:fade>
            <div class="max-w-lg mb-4 autocomplete">
              <AutoComplete
                searchFunction={loadOptions}
                onChange={handleSelect}
                labelFieldName="label"
                valueFieldName="taxon_id"
                placeholder="Search species name"
                hideArrow={true}
                bind:selectedItem={item}
              />
            </div>
            {#if taxaHistory.length > 3}
              <span class="btn btn-sm btn-outline mb-4 " on:click={resetTaxa}>Delete all</span>
            {/if}

            <div class="relative taxaset-container">
              <ShowMore
                showMore={true}
                on:toggleShowMore={(e) => (showTaxaSets = e.detail.showMore)}
              />
              {#if showTaxaSets}
                {#each taxaSets as taxonSet}
                  <label transition:fade class="cursor-pointer block">
                    <input
                      type="checkbox"
                      bind:checked={taxonSet.active}
                      class="mr-2"
                      on:click={taxonSet.method}
                    />
                    <span>{taxonSet.label}</span>
                  </label>
                {/each}
              {/if}
            </div>

            <div
              transition:fade
              class="grid mt-4 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-2"
            >
              {#each taxaHistory as taxon (taxon.taxon_id)}
                <TaxonFilter
                  {taxa}
                  {taxon}
                  {toggleTaxon}
                  {removeTaxon}
                  {toggleInatGrid}
                  {toggleInatTaxonRange}
                  {projectPath}
                  {taxaHistory}
                />
              {/each}
            </div>
          </section>
        {/if}

        <!-- Environmental Factors -->
        <h3 class="bg-gray-200 mt-0 px-3 py-1">
          Environmental Factors
          <ShowMore
            showMore={true}
            position={'normal'}
            on:toggleShowMore={(e) => (showEnvironment = e.detail.showMore)}
          />
        </h3>
        {#if showEnvironment}
          <section class="px-3 mb-3" transition:fade>
            {#if hasClimate}
              <label class="cursor-pointer block">
                <input type="checkbox" bind:checked={showClimate} />
                <span>Temperature and Preciptation</span>
              </label>
            {/if}
          </section>
        {/if}
      </div>
    </div>

    <div class="lg:col-span-7">
      <!-- stats -->
      <div class="w-full rounded-none border stats">
        <div class="stat place-items-center place-content-center">
          <div class="stat-title">
            Observations
            {#if observationsOnMapCount >= clusterLimit}
              <span
                use:tooltip
                class="text-red-600"
                title="Since there are over {clusterLimit} observations on the map, the map uses clustered markers."
                >*</span
              >
            {/if}
          </div>
          <div class="stat-value">{observationsOnMapCount}</div>
        </div>

        <div class="stat place-items-center place-content-center">
          <div class="stat-title">Species</div>
          <div class="stat-value">
            {speciesOnMapCount}
          </div>
        </div>
        <div class="stat place-items-center place-content-center">
          <div class="stat-title">Observers</div>
          <div class="stat-value">
            {observersOnMapCount}
          </div>
        </div>
      </div>

      <!-- map -->
      {#if mounted && loading}
        <Loader />
        <div class="bg-gray-100" style="width: 100%; height: 75vh;" />
      {/if}
      <div class="relative">
        <svelte:component
          this={Map}
          {mapOptions}
          {groupedObservations}
          {timeSpanHistory}
          {taxaHistory}
          {mapCenter}
          {project}
          country={project.country}
          on:markerClick={changeObservation}
          on:updateStats={updateStatsHandler}
        />

        <!-- observation data -->
        {#if showObservationHighlight}
          <div class="absolute observation-container bg-white text-sm overflow-auto">
            <span
              on:click={() => (showObservationHighlight = false)}
              class="close-button cursor-pointer"><XIcon /></span
            >
            <section class="px-3 mb-3" transition:fade>
              {#if observationHighlight.image_url}
                <img
                  src={observationHighlight.image_url.replace('medium', 'small')}
                  alt="photo of {formatTaxonDisplayName(observationHighlight)}"
                />
              {:else}
                <img
                  class="float-right lg:float-none"
                  src="{base}/images/missing-image.png"
                  alt=""
                />
              {/if}
              <ObservationData
                on:zoomToObservation={zoomToObservation}
                observation={observationHighlight}
                {projectPath}
                compactLayout={true}
              />
            </section>
          </div>
        {/if}
      </div>

      <div class="px-3">
        <!-- species list -->
        {#if taxaHistory.length > 0}
          <label class="cursor-pointer mt-2 mr-3 inline-block">
            <input type="checkbox" bind:checked={syncMapAndCharts} />
            <span>Update charts as map changes</span>
          </label>
        {/if}

        {#if taxaHistory.length > 0}
          <label class="cursor-pointer mt-2 inline-block">
            <input type="checkbox" bind:checked={showSpeciesList} />
            <span>Show species list</span>
          </label>
        {/if}
        <br />

        <section>
          <MapSpeciesList {showSpeciesList} {speciesList} />
        </section>

        {#if taxaHistory.length > 0}
          <section>
            <TimeSpanFilters
              {mapOptions}
              {selectTimeSpanHandler}
              {groupedObservations}
              {toggleTimeSpans}
              {timeSpanHistory}
              activeTaxaCount={taxaHistory.filter((t) => t.active).length}
            />
          </section>
        {/if}
        <!-- charts -->

        {#if taxaHistory.length > 0}
          <div id="ed-chart" class="w-full mt-4" />
        {/if}
        {#if showClimate}
          <h3 class="text-center">Temperature and Preciptation</h3>
          {#if climateChartData}
            <ClimateChart {climateChartData} {climateChartOptions} />
          {:else}
            <img
              src="{base}/images/{org.username}/{project.slug}/climate-chart.png"
              alt="climate chart for {project.location}"
            />
          {/if}
        {/if}
      </div>
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
    background-color: var(--bg-gray-200);
    color: var(--text-color);
  }

  .observation-container {
    width: 30%;
    max-width: 350px;
    max-height: 58vh;
    bottom: 20px;
    right: 5px;
    z-index: 1005;
  }

  .observation-container img {
    max-height: 150px;
    margin-top: 10px;
  }

  .stat-value {
    @apply text-sm;
    font-weight: normal;
  }
  .stat {
    @apply text-sm;
    padding: 0.5rem 1rem;
  }
  .stat-title {
    @apply text-sm;
    white-space: normal;
    text-align: center;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    background: white;
  }
  .taxaset-container {
    min-height: 1rem;
  }
</style>
