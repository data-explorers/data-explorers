<script context="module">
  // TODO:
  // minimize menu
  // add charts of observation counts
  // show observation counts change with time span filter
  // add inat range map and observatios for each taxon
  // animate by week over time

  import settings from '$lib/data/settings.json';
  import { formatRawTaxa, formatRawObservations } from '$lib/convert_data';
  import { base } from '$app/paths';

  export async function load({ page }) {
    let user = settings.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let pathParts = page.path.split('/');
    let currentTab = project.tabs_project.filter(
      (tab) => tab.link === pathParts[pathParts.length - 1]
    )[0];
    let projectPath = `${base}/users/${user.username}/${project.slug}`;

    let taxaData = await import(`../../../../lib/data/${page.params.projects}/taxa.csv`);
    let taxa = formatRawTaxa(taxaData.default);
    let observationData = await import(
      `../../../../lib/data/${page.params.projects}/observations.csv`
    );
    let projectObservations = formatRawObservations(observationData.default);

    return { props: { project, user, currentTab, projectObservations, taxa, projectPath } };
  }
</script>

<script>
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

  import barChartGroupJson from '$lib/charts/bar_chart_group.json';
  import barChartJson from '$lib/charts/bar_chart.json';

  export let project;
  export let user;
  export let currentTab;
  export let projectObservations;
  export let taxa;
  export let projectPath;

  $: if (taxaHistory.length === 0) {
    showDemoSpeciesPrompt = project.slug !== 'los-angeles-bioblitz';
    showIndicatorSpeciesPrompt = project.slug === 'los-angeles-bioblitz';
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
        chartObservations
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
        chartObservations
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
  let showDemoSpeciesPrompt = project.slug !== 'los-angeles-bioblitz';
  let showIndicatorSpeciesPrompt = project.slug === 'los-angeles-bioblitz';
  let showClimate = false;
  let showDemoMapLayer = false;
  let taxaCount = 0;
  let loading = false;
  let inactiveOpacity = 0.25;
  let mounted = false;
  let barChartSpec = JSON.parse(JSON.stringify(barChartJson));
  let barChartGroupSpec = JSON.parse(JSON.stringify(barChartGroupJson));
  let observationHighlight;
  let observationsSelectedCount = 0;
  let observationsOnMapCount = 0;
  let clusterLimit = 1000;
  let speciesCount = 0;
  let speciesDisplayCount = 0;
  let speciesList = [];
  let showSpeciesList = false;
  let showSpeciesListIcon = false;
  let mapCenter = {};
  let chartSelector = '#ed-chart';
  let syncMapAndCharts = false;
  let orderByValue = 'oldest';

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
      addObservationsForTaxon(taxon);
    }, 100);
  }

  async function loadOptions(filterText) {
    if (filterText.length > 2) {
      return await fetchTaxaByName(taxa, filterText);
    }
  }

  // =====================
  // process observations data
  // =====================

  function loadDemoSpecies() {
    showDemoSpeciesPrompt = false;

    taxa
      .filter((t) => t.rank === 'species')
      .sort((a, b) => b.taxa_count - a.taxa_count)
      .slice(0, 5)
      .forEach((taxon) => {
        taxaCount += 1;
        addObservationsForTaxon(taxon);
      });
  }

  function loadIndicatorSpecies() {
    showIndicatorSpeciesPrompt = false;

    taxa
      .filter((t) => t.taxon_group && t.observations_count > 0)
      .sort((a, b) => b.taxa_count - a.taxa_count)
      .forEach((taxon) => {
        taxaCount += 1;
        addObservationsForTaxon(taxon);
      });
  }

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
      // when adding new taxa, keep existing time span filters as is, and set
      // new ones to true
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

    // remove observations for deleted taxon
    let tempObservations = {}
    observationsIds.forEach(id => tempObservations[id] = observations[id])
    observations = tempObservations
    logObservations('removeTaxon');

    groupedObservations = updateGroupObservations();
    logObservations('removeTaxon');

    loading = false;
  }

  function toggleTaxon(e) {
    loading = true
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
    logObservations('toggleTaxon');

    loading = false;
  }

  function updateGroupObservations() {
    // select, sort, and group active observations
    let activeObservations = [...activeObservationsIds].map(id => observations[id])
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
    let obs = observations[id]
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
      Object.values(observations),
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
    observationsSelectedCount = e.detail.observationsSelectedCount;
    speciesCount = e.detail.speciesCount;
    speciesDisplayCount = e.detail.speciesDisplayCount;
    speciesList = e.detail.speciesList;
    showSpeciesListIcon = e.detail.showSpeciesListIcon;
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
    showObservationHighlight = true
    observationHighlight = observations[e.detail.observation_id];
  }

  function toggleSpeciesList() {
    showSpeciesList = !showSpeciesList;
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

<div class="prose max-w-none">
  <h1 class="px-3">{currentTab.label}</h1>

  <div class="grid lg:grid-cols-10 mb-6">
    <div class="lg:col-span-3 border-0 lg:border-r-2 border-t">
      <div class="grid">
        <!-- observation data -->
        {#if observationHighlight}
          <section
            class="px-3 mb-6 lg:mb-0 observation-container overflow-x-auto order-last lg:order-first"
          >
            {#if observationHighlight.image_url}
              <img
                class="float-right lg:float-none"
                src={observationHighlight.image_url.replace('medium', 'small')}
                alt="photo of {formatTaxonDisplayName(observationHighlight)}"
              />
            {:else}
              <img class="float-right lg:float-none" src="{base}/images/missing-image.png" alt="" />
            {/if}

            <ObservationData
              on:zoomToObservation={zoomToObservation}
              observation={observationHighlight}
              {projectPath}
              compactLayout={true}
            />
          </section>
        {/if}
        <!-- searched taxa -->
        <section class="px-3">
          <h3>Biodiversity</h3>

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
              <span>Show 5 most observed species</span>
            </label>
          {/if}

          {#if showIndicatorSpeciesPrompt}
            <label class="cursor-pointer block">
              <input type="checkbox" class="mr-2" on:click={() => loadIndicatorSpecies()} />
              <span>Show indicator species</span>
            </label>
          {/if}

          <div class="grid lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-2 mb-2">
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

        <!-- Environmental Factors -->
        <section class="px-3">
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
        </section>
      </div>
    </div>

    <div class="lg:col-span-7">
      <!-- stats -->
      <div class="w-full rounded-none border stats">
        <div class="stat place-items-center place-content-center">
          <div class="stat-title">Observations</div>
          <div class="stat-value">{observationsSelectedCount}</div>
        </div>
        <div class="stat place-items-center place-content-center">
          <div class="stat-title">
            Observations on map
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
          <div class="stat-value">{speciesCount}</div>
        </div>

        <div class="stat place-items-center place-content-center">
          <div class="stat-title">Species on map</div>
          <div class="stat-value">
            {speciesDisplayCount}
            {#if showSpeciesListIcon}
              {#if showSpeciesList}
                <span use:tooltip title="click hide to species list" on:click={toggleSpeciesList}
                  ><InfoIcon /></span
                >
              {:else}
                <span use:tooltip title="click show to species list" on:click={toggleSpeciesList}
                  ><InfoIcon /></span
                >
              {/if}
            {/if}
          </div>
        </div>
      </div>

      <!-- map -->
      {#if mounted && loading}
        <Loader />
        <div class="bg-gray-100" style="width: 100%; height: 70vh;" />
      {/if}
      <svelte:component
        this={Map}
        {mapOptions}
        {groupedObservations}
        {timeSpanHistory}
        {showDemoMapLayer}
        {taxaHistory}
        {mapCenter}
        country={project.country}
        on:markerClick={changeObservation}
        on:updateStats={updateStatsHandler}
      />

      <div class="px-3">
        <!-- species list -->
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
          <label class="cursor-pointer mt-2 inline-block">
            <input type="checkbox" bind:checked={syncMapAndCharts} />
            <span>Sync map and charts</span>
            <span use:tooltip title="Automatically update charts as map changes."><InfoIcon /></span
            >
          </label>
          <div id="ed-chart" class="w-full mt-4" />
        {/if}
        {#if showClimate}
          <h3 class="text-center">Temperature and Preciptation</h3>

          <img
            src="{base}/images/{user.username}/{project.slug}/climate-chart.png"
            alt="climate chart for {project.location}"
          />
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
    background-color: var(--bg-gray);
    color: var(--text-color);
  }

  .observation-container img {
    max-height: 150px;
    margin-top: 1.75rem;
    right: 0;
    top: 0;
  }
  @media (min-width: 1024px) {
    .observation-container img {
      margin-top: 0;
    }
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
  h3:first-of-type {
    margin-top: 1.25rem;
  }
</style>
