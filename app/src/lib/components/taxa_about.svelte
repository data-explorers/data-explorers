<script>
  import GlobiList from '$lib/components/globi_list.svelte';
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';
  import { onMount } from 'svelte';
  import TaxaObservedSpecies from '$lib/components/taxa_observed_species.svelte';
  import ChildTaxa from '$lib/components/taxa_child_taxa.svelte';

  export let project;
  export let taxon;
  export let interactions;
  export let projectPath;
  export let taxa;
  export let taxonIds;

  $: eatsTaxa = interactions.filter((i) => i.interaction === 'eats');
  $: eatenByTaxa = interactions.filter((i) => i.interaction === 'eatenBy');
  $: pollinatesTaxa = interactions.filter((i) => i.interaction === 'pollinates');
  $: pollinatedByTaxa = interactions.filter((i) => i.interaction === 'pollinatedBy');
  $: preysOnTaxa = interactions.filter((i) => i.interaction === 'preysOn');
  $: preyedUponByTaxa = interactions.filter((i) => i.interaction === 'preyedUponBy');

  function displayTaxonomy(taxon) {
    if (!taxon.taxon_ids) {
      return [];
    }

    let taxon_ids = taxon.taxon_ids.split('|').map((id) => (/\d+/.test(id) ? Number(id) : ''));
    return taxon_ids.map((id) => {
      let taxon = taxa.filter((t) => t.taxon_id === id)[0];
      return {
        rank: taxon.rank,
        taxon_id: id,
        taxon_name: formatTaxonDisplayName(taxon),
        taxa_count: taxon.taxa_count
      };
    });
  }

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

  <h3>iNaturalist Observations</h3>

  <svelte:component this={RangeMap} {taxon} {project} />

  <h3>Taxonomy</h3>
  <ul class="taxonomy">
    {#each displayTaxonomy(taxon) as level}
      <li class:active={taxon.taxon_id == level.taxon_id}>
        {level.rank}: <a href="{projectPath}/taxa/{level.taxon_id}">{level.taxon_name}</a>
        {pluralize('observation', level.taxa_count)}
      </li>
    {/each}
    <li>
      <ChildTaxa {taxon} {projectPath} {taxa} />
    </li>
  </ul>

  <TaxaObservedSpecies {taxon} {projectPath} {taxa} />

  <h3>Species Interactions</h3>

  <p>
    Species interaction data comes from <a
      href="https://www.globalbioticinteractions.org/?interactionType=interactsWith&sourceTaxon={taxon.scientific_name}"
      >GloBI</a
    >. The species with links are species that have observations.
  </p>

  <div class="grid md:grid-cols-2 sm:grid-cols-1 justify-center gap-3">
    <div>
      <GlobiList interactionTaxa={eatsTaxa} title="Eats" {taxonIds} {projectPath} />
      <GlobiList interactionTaxa={preysOnTaxa} title="Preys on" {taxonIds} {projectPath} />
      <GlobiList interactionTaxa={pollinatesTaxa} title="Pollinates" {taxonIds} {projectPath} />
    </div>
    <div>
      <GlobiList interactionTaxa={eatenByTaxa} title="Eaten by" {taxonIds} {projectPath} />
      <GlobiList
        interactionTaxa={preyedUponByTaxa}
        title="Preyed upon by"
        {taxonIds}
        {projectPath}
      />
      <GlobiList
        interactionTaxa={pollinatedByTaxa}
        title="Pollinated by"
        {taxonIds}
        {projectPath}
      />
    </div>
  </div>

  <h3>More Information</h3>
  <a href="https://www.inaturalist.org/taxa/{taxon.taxon_id}">iNaturalist taxa</a>
</div>

<style>
  :root {
    --step: 1rem;
  }

  .taxonomy li {
    margin-top: 0;
    margin-bottom: 0;
  }
  .taxonomy .active,
  .taxonomy .active a {
    font-weight: 700;
  }
  .taxonomy li:nth-child(1) {
    margin-left: calc(var(--step) * 0);
  }
  .taxonomy li:nth-child(2) {
    margin-left: calc(var(--step) * 1);
  }
  .taxonomy li:nth-child(3) {
    margin-left: calc(var(--step) * 2);
  }
  .taxonomy li:nth-child(4) {
    margin-left: calc(var(--step) * 3);
  }
  .taxonomy li:nth-child(5) {
    margin-left: calc(var(--step) * 4);
  }
  .taxonomy li:nth-child(6) {
    margin-left: calc(var(--step) * 5);
  }
  .taxonomy li:nth-child(7) {
    margin-left: calc(var(--step) * 6);
  }
  .taxonomy li:nth-child(8) {
    margin-left: calc(var(--step) * 7);
  }

  .prose ul > li::before {
    content: none;
  }
  .prose ul > li {
    position: normal;
    padding-left: 0;
  }
</style>
