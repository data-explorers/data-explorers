<script>
  import GlobiList from '$lib/components/globi_list.svelte';

  export let project;
  export let taxon;
  export let interactions;

  let eatsTaxa = interactions.filter((i) => i.interaction === 'eats');
  let eatenByTaxa = interactions.filter((i) => i.interaction === 'eatenBy');
  let pollinatesTaxa = interactions.filter((i) => i.interaction === 'pollinates');
  let pollinatedByTaxa = interactions.filter((i) => i.interaction === 'pollinatedBy');
  let preysOnTaxa = interactions.filter((i) => i.interaction === 'preysOn');
  let preyedUponByTaxa = interactions.filter((i) => i.interaction === 'preyedUponBy');
</script>

<h3>Description</h3>

<article class="prose">
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
</article>

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

<h3>Related Species</h3>

<p>
  Related species data comes from <a
    href="https://www.globalbioticinteractions.org/?interactionType=interactsWith&sourceTaxon={taxon.scientific_name}"
    >GloBI</a
  >.
</p>

<GlobiList interactionTaxa={eatsTaxa} title="Eats" />
<GlobiList interactionTaxa={eatenByTaxa} title="Eaten by" />
<GlobiList interactionTaxa={pollinatesTaxa} title="Pollinates" />
<GlobiList interactionTaxa={pollinatedByTaxa} title="Pollinated by" />
<GlobiList interactionTaxa={preysOnTaxa} title="Preys on" />
<GlobiList interactionTaxa={preyedUponByTaxa} title="Preyed upon by" />
