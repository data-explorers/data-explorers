<script>
  import { onMount } from 'svelte';
  import TaxaObservedSpecies from '$lib/components/taxa_observed_species.svelte';
  import TaxaSpeciesInteractions from '$lib/components/taxa_species_interactions.svelte';
  import TaxaTaxonomy from './taxa_taxonomy.svelte';

  export let project;
  export let taxon;
  export let interactions;
  export let projectPath;
  export let taxa;
  export let taxonIds;
  export let observations;

  let RangeMap;
  onMount(async () => {
    const comp = await import('$lib/components/taxa_range_map.svelte');
    RangeMap = comp.default;
  });
</script>

<div class="prose max-w-none">
  <h3>Description</h3>

  <p>
    Cillum enim nisi qui velit reprehenderit ut ipsum quis est consectetur. Labore labore proident
    exercitation veniam cillum. Esse laboris aliquip commodo incididunt qui qui quis labore id
    voluptate. Qui velit deserunt minim qui labore nostrud. Et Lorem exercitation cillum eu do esse.
    Anim ut do in occaecat.
  </p>
  <p>
    Adipisicing aliquip culpa cupidatat nulla cupidatat exercitation exercitation exercitation culpa
    Lorem magna enim sunt ad. Officia ex veniam dolore incididunt enim dolor. Deserunt magna elit
    voluptate duis ex mollit deserunt duis cupidatat tempor sint. Velit ea ipsum est exercitation
    excepteur laboris id.
  </p>

  <h3>Native Status</h3>

  {#if taxon.common_name}{taxon.common_name}{/if}
  {#if taxon.scientific_name}
    <span class="text-gray-400">({taxon.scientific_name})</span>
  {/if}
  is native / not native to {project.location}.

  <h3>Habitat</h3>

  <p>
    Adipisicing aliquip culpa cupidatat nulla cupidatat exercitation exercitation exercitation culpa
    Lorem magna enim sunt ad. Officia ex veniam dolore incididunt enim dolor. Deserunt magna elit
    voluptate duis ex mollit deserunt duis cupidatat tempor sint. Velit ea ipsum est exercitation
    excepteur laboris id.
  </p>

  <svelte:component this={RangeMap} {taxon} {project} {observations} />

  <TaxaTaxonomy {taxon} {projectPath} {taxa} />

  <TaxaObservedSpecies {taxon} {projectPath} {taxa} />

  <TaxaSpeciesInteractions {interactions} {projectPath} {taxonIds} {taxon} />

  <h3>More Information</h3>
  <a class="external-link" href="https://www.inaturalist.org/taxa/{taxon.taxon_id}"
    >iNaturalist taxa</a
  >
</div>
