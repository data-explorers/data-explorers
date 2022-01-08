<script>
  import GlobiList from '$lib/components/globi_list.svelte';

  export let taxonIds;
  export let projectPath;
  export let interactions;
  export let taxon;

  $: eatsTaxa = interactions.filter((i) => i.interaction === 'eats');
  $: eatenByTaxa = interactions.filter((i) => i.interaction === 'eatenBy');
  $: pollinatesTaxa = interactions.filter((i) => i.interaction === 'pollinates');
  $: pollinatedByTaxa = interactions.filter((i) => i.interaction === 'pollinatedBy');
  $: preysOnTaxa = interactions.filter((i) => i.interaction === 'preysOn');
  $: preyedUponByTaxa = interactions.filter((i) => i.interaction === 'preyedUponBy');
</script>

<h3>Species Interactions</h3>

{#if interactions.length > 0}
  <p>The species with links are species that have observations.</p>
{/if}

{#if interactions.length > 0}
  <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-3">
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
{:else}
  <p>No species interactions available.</p>
{/if}

<p>
  Species interaction data comes from <a
    class="external-link"
    href="https://www.globalbioticinteractions.org/?interactionType=interactsWith&sourceTaxon={taxon.scientific_name}"
    >GloBI</a
  >.
</p>
