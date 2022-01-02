<script context="module">
  // TODO:
  // minimize menu
  // add charts of observation counts
  // show observation counts change with time span filter
  // add inat range map and observatios for each taxon
  // animate by week over time

  import settings from '$lib/data/settings.json';
  import { convertTaxa, convertObservations } from '$lib/convert_data';

  export async function load({ page }) {
    let user = settings.filter((user) => user.username === page.params.users)[0];
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
  import vegaEmbed from 'vega-embed';
  import TimeSpanFilters from '$lib/components/map_time_span_filter.svelte';
  import Loader from '$lib/components/loader.svelte';
  import ProjectHeader from '$lib/components/project_header.svelte';
  import Modal from '$lib/components/modal.svelte';
  import ModalMagnify from '$lib/components/modal-magnify.svelte';
  import TaxonFilter from '$lib/components/ed_taxon_filter.svelte';
  import { modulo } from '$lib/miscUtils';
  import { darkGray, defaultColorScheme, getMonthName, getMapTiles } from '$lib/mapUtils';
  import {
    fetchTaxaByName,
    fetchObservationsByTaxonId,
    sortObservations,
    createGroupObservations,
    generateTimeSpanCounts
  } from '$lib/dataUtils';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import barChartGroupJson from '$lib/charts/bar_chart_group.json';
  import barChartJson from '$lib/charts/bar_chart.json';

  export let project;
  export let user;
  export let currentTab;
  export let allObservations;
  export let taxa;
  export let projectPath;


  $: if (taxaHistory.length === 0) {
    showDemoSpeciesPrompt = project.slug !== 'los-angeles-bioblitz';
    showIndicatorSpeciesPrompt = project.slug === 'los-angeles-bioblitz';
    timeSpanHistory = {};
  }

  // format data for charts
  $: {
    if (taxaHistory.length === 0) {
      // don't draw chart if no data
    } else if (mapOptions.observationsTimeSpan == 'all') {
      let chartData = taxaHistory.map((t) => {
        return {
          xValue: t.taxon_name,
          yValue: t.taxa_count,
          group: '',
          color: t.taxon_name,
          label: t.taxa_count,
          opacity: t.active ? 1 : inactiveOpacity
        };
      });

      barChartSpec['data']['values'] = chartData;
      barChartSpec['height'] = 200;
      // legend
      barChartSpec['encoding']['x']['axis'] = null;
      barChartSpec['encoding']['color']['scale'] = {
        domain: taxaHistory.map((t) => t.taxon_name),
        range: taxaHistory.map((t) => t.color)
      };
      barChartSpec['encoding']['color']['title'] = null;

      drawChart(barChartSpec);
    } else if (mapOptions.observationsTimeSpan == 'month') {
      let chartData = [];
      let monthlyCountsPerTaxon = generateTimeSpanCounts(
        'month',
        observations,
        taxaHistory,
        timeSpanHistory,
        inactiveOpacity,
        project
      );

      for (let month in monthlyCountsPerTaxon) {
        let monthData = monthlyCountsPerTaxon[month];
        for (let taxonId in monthData) {
          let taxonData = monthData[taxonId];
          chartData.push({
            xValue: month === 'unknown' ? month : getMonthName(month),
            yValue: taxonData['count'],
            group: taxonData['taxon_name'],
            color: taxonData['color'],
            opacity: taxonData['opacity']
          });
        }
      }

      barChartGroupSpec['data']['values'] = chartData;
      // ensure the charts are in the same order as the taxa filters
      barChartGroupSpec['facet']['sort'] = taxaHistory.map((t) => t.taxon_name);
      // hide legend
      barChartGroupSpec['spec']['layer'][0]['encoding']['color']['scale'] = null;

      drawChart(barChartGroupSpec);
    } else {
      let chartData = [];
      let yearlyCountsPerTaxon = generateTimeSpanCounts(
        'year',
        observations,
        taxaHistory,
        timeSpanHistory,
        inactiveOpacity,
        project
      );

      for (let year in yearlyCountsPerTaxon) {
        let yearData = yearlyCountsPerTaxon[year];
        for (let taxonId in yearData) {
          let taxonData = yearData[taxonId];
          chartData.push({
            xValue: year,
            yValue: taxonData['count'],
            group: taxonData['taxon_name'],
            color: taxonData['color'],
            opacity: taxonData['opacity']
          });
        }
      }

      barChartGroupSpec['data']['values'] = chartData;
      // ensure the charts are in the same order as the taxa filters
      barChartGroupSpec['facet']['sort'] = taxaHistory.map((t) => t.taxon_name);
      // hide legend
      barChartGroupSpec['spec']['layer'][0]['encoding']['color']['scale'] = null;

      drawChart(barChartGroupSpec);
    }
  }

  let item = '';
  let observations = []; // all observations for searched taxa
  let observationsIds = new Set(); // all observation ids for searched taxa
  let observationsDisplay = []; // observations filtered by taxaHistory and timeSpanHistory
  let groupedObservations = []; // filtered observations grouped by time span
  let taxaHistory = []; // all selected taxa
  let timeSpanHistory = {}; // all the time spans
  let showDemoSpeciesPrompt = project.slug !== 'los-angeles-bioblitz';
  let showIndicatorSpeciesPrompt = project.slug === 'los-angeles-bioblitz';
  let orderByValue = 'oldest';
  let showClimate = false;
  let showDemoMapLayer = false;
  let taxaCount = 0;
  let loading = true;
  let inactiveOpacity = 0.25;
  let mounted = false;
  let barChartSpec = JSON.parse(JSON.stringify(barChartJson));
  let barChartGroupSpec = JSON.parse(JSON.stringify(barChartGroupJson));

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
    let index = modulo(taxaCount, mapOptions.colorScheme.length);

    let selectedObservations = fetchObservationsByTaxonId(
      allObservations,
      taxon.taxon_id,
      mapOptions.colorScheme[index]
    );

    // update observations & observationsIds
    selectedObservations.forEach((o) => {
      // only add observations that weren't added by other taxa
      if (!observationsIds.has(o.id)) {
        observationsIds.add(o.id);
        observations.push(o);
      }
    });
    observationsDisplay = sortObservations(
      observations,
      orderByValue,
      mapOptions.observationsTimeSpan
    );
    groupedObservations = createGroupObservations(
      observationsDisplay,
      mapOptions.observationsTimeSpan
    );

    // update filters
    let tiles = getMapTiles(taxon.taxon_id);
    let color = mapOptions.colorScheme[index];
    taxaHistory = taxaHistory.concat({
      taxon_name: formatTaxonDisplayName(taxon),
      image_url: taxon.image_url,
      taxa_count: taxon.taxa_count,
      taxon_id: taxon.taxon_id,
      color: color,
      rank: taxon.rank,
      active: true,
      observations: selectedObservations.map((o) => o.id),
      showInatGrid: false,
      InatGridUrl: `${tiles.InatGrid.url}&color=%23${color.replace('#', '')}`,
      showInatTaxonRange: false,
      InatTaxonRangeUrl: `${tiles.InatTaxonRange.url}?color=%23${color.replace('#', '')}`
    });

    // update time span filters
    if (mapOptions.observationsTimeSpan !== 'all') {
      // when adding new taxa, keep existing time span filters as is, and set new ones to true
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

  function toggleInatGrid(taxon_id) {
    let index = taxaHistory.map((t) => t.taxon_id).indexOf(taxon_id);
    taxaHistory[index].showInatGrid = !taxaHistory[index].showInatGrid;
  }

  function toggleInatTaxonRange(taxon_id) {
    let index = taxaHistory.map((t) => t.taxon_id).indexOf(taxon_id);
    taxaHistory[index].showInatTaxonRange = !taxaHistory[index].showInatTaxonRange;
  }

  function removeTaxon(e) {
    loading = true;
    let taxonId = Number(e.target.dataset['taxonId']);

    // update filters & observationsIds
    observationsIds = new Set();
    taxaHistory = taxaHistory.filter((t) => {
      if (t.taxon_id !== taxonId && t.active) {
        t.observations.forEach((id) => observationsIds.add(id));
      }
      return t.taxon_id !== taxonId;
    });

    // update observations
    observations = observations.filter((o) => observationsIds.has(o.id));
    observationsDisplay = sortObservations(
      observations,
      orderByValue,
      mapOptions.observationsTimeSpan
    );
    groupedObservations = createGroupObservations(observations, mapOptions.observationsTimeSpan);

    // update filters
    if (mapOptions.observationsTimeSpan !== 'all') {
      // when removing taxa, keep the existing time span filter as is
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = timeSpanHistory[k]));
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
      taxaHistory
        .filter((t) => t.taxon_id === taxonId)[0]
        ['observations'].forEach((id) => observationsIds.add(id));
      // remove observations
    } else {
      observationsIds = new Set();
      taxaHistory.forEach((t) => {
        if (t.taxon_id !== taxonId && t.active) {
          t.observations.forEach((id) => observationsIds.add(id));
        }
      });
    }

    // update observations
    observationsDisplay = observations.filter((o) => observationsIds.has(o.id));
    observationsDisplay = sortObservations(
      observationsDisplay,
      orderByValue,
      mapOptions.observationsTimeSpan
    );
    groupedObservations = createGroupObservations(
      observationsDisplay,
      mapOptions.observationsTimeSpan
    );

    // update filters
    if (mapOptions.observationsTimeSpan !== 'all') {
      // when toggling taxon, keep existing time span as is
      groupedObservations.forEach((v, k) => (timeSpanHistory[k] = timeSpanHistory[k]));
    }
    loading = false;
  }

  // =====================
  // time span filters
  // =====================

  function toggleTimeSpans(e) {
    let targetFilter = e.target.dataset['filter'];
    targetFilter = targetFilter === 'unknown' ? 'unknown' : Number(targetFilter);

    // update filters
    timeSpanHistory[targetFilter] = !timeSpanHistory[targetFilter];
  }

  function selectTimeSpanHandler() {
    loading = true;
    // update observations
    observationsDisplay = sortObservations(
      observationsDisplay,
      orderByValue,
      mapOptions.observationsTimeSpan
    );
    groupedObservations = createGroupObservations(
      observationsDisplay,
      mapOptions.observationsTimeSpan
    );

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

  function drawChart(spec) {
    vegaEmbed('#ed-chart', spec, { actions: false })
      .then((result) => {})
      .catch(console.warn);
  }

  // =====================
  // map
  // =====================

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/explore_data_map.svelte');
    Map = comp.default;
    loading = false;
    mounted = true;
  });
</script>

<ProjectHeader {project} {user} />

<div class="prose max-w-none">
  <h1>{currentTab.label}</h1>

  <div class="grid lg:grid-cols-10 gap-3 mb-6">
    <div class="lg:col-span-3 border border-gray-300 p-3">
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
          />
        {/each}
      </div>

      {#if taxaHistory.length > 0}
        <TimeSpanFilters
          {mapOptions}
          {selectTimeSpanHandler}
          {groupedObservations}
          {toggleTimeSpans}
          {timeSpanHistory}
          activeTaxaCount={taxaHistory.filter((t) => t.active).length}
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
      {#if mounted && loading}
        <Loader />
      {/if}
      {#if !mounted}
        <Loader />
        <div class="bg-gray-100" style="width: 100%; height: 600px;" />
      {/if}
      <svelte:component
        this={Map}
        {mapOptions}
        {groupedObservations}
        {timeSpanHistory}
        {showDemoMapLayer}
        {taxaHistory}
        {projectPath}
        country={project.country}
      />
      {#if taxaHistory.length > 0}
        <div id="ed-chart" class="w-full mt-4" />
      {/if}
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
