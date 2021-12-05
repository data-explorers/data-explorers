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

  export let project;
  export let user;
  export let currentTab;
  export let allObservations;
  export let taxa;
  let observations = [];
  let groupedObservations = {};
  let keyword = '';
  let groupedKeywords = {};

  function formatTaxonDisplayName(taxon) {
    let fullName = [];
    if (taxon.common_name) {
      fullName.push(taxon.common_name);
    }
    if (taxon.scientific_name) {
      fullName.push(`(${taxon.scientific_name})`);
    }
    return fullName.join(' ');
  }

  const myPromise = (filterText) => {
    console.log('myPromise', filterText);

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
    console.log('selected item', event.detail);
    let taxonName = event.detail.label;
    let taxonId = event.detail.value;
    console.log(taxonName, taxonId);
    observations = allObservations.filter((o) => {
      return o.taxon_id === taxonId;
    });
    groupedObservations[taxonId] = observations;
    groupedKeywords[taxonId] = taxonName;
    console.log(groupedObservations);
  }

  async function loadOptions(filterText) {
    return await myPromise(filterText);
  }

  let mapOptions = { latitude: project.latitude, longitude: project.longitude, zoom: project.zoom };

  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/explore_data_map.svelte');
    Map = comp.default;
  });
</script>

<ProjectHeader {project} {user} />
keyword: {keyword}, observations: {observations.length}, groupedKeywords: {Object.keys(
  groupedKeywords
).join(',')}

<h1>{currentTab.label}</h1>

<div class="themed my-8">
  <Select {loadOptions} on:select={handleSelect} />
</div>

<svelte:component this={Map} {mapOptions} {observations} />

<style>
  .themed {
    --listZIndex: 1001;
  }
</style>
