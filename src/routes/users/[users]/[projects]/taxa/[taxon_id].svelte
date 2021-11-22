<script context="module">
  import { formatInteractions } from '$lib/external_api';

  // range map from inat

  // description from wikipedia

  export async function load({ page }) {
    let res = await import(`../../../../../lib/data/${page.params.projects}/taxa.json`);
    let taxa = res.default;
    let taxon = taxa.filter((taxon) => taxon.taxon_id == page.params.taxon_id)[0];

    let interaction = 'eats';
    let eatsTaxa = [];
    // eatsTaxa = await formatInteractions(taxon.scientific_name, interaction, taxa);

    interaction = 'eatenBy';
    let eatenByTaxa = [];
    // eatenByTaxa = await formatInteractions(taxon.scientific_name, interaction, taxa);

    interaction = 'pollinates';
    let pollinatesTaxa = [];
    // pollinatesTaxa = await formatInteractions(taxon.scientific_name, interaction, taxa);

    interaction = 'pollinatedBy';
    let pollinatedByTaxa = [];
    // pollinatedByTaxa = await formatInteractions(taxon.scientific_name, interaction, taxa);

    interaction = 'preysOn';
    let preysOnTaxa = [];
    // preysOnTaxa = await formatInteractions(taxon.scientific_name, interaction, taxa);

    interaction = 'preyedUponBy';
    let preyedUponByTaxa = [];
    // preyedUponByTaxa = await formatInteractions(taxon.scientific_name, interaction, taxa);

    return {
      props: {
        taxon,
        eatsTaxa,
        eatenByTaxa,
        pollinatedByTaxa,
        pollinatesTaxa,
        preysOnTaxa,
        preyedUponByTaxa
      }
    };
  }
</script>

<script>
  import GlobiList from '$lib/components/globi_list.svelte';

  export let taxon;
  export let eatsTaxa;
  export let eatenByTaxa;
  export let pollinatesTaxa;
  export let pollinatedByTaxa;
  export let preysOnTaxa;
  export let preyedUponByTaxa;
</script>

<h1>{taxon.common_name} <span class="text-2xl text-gray-400">({taxon.scientific_name})</span></h1>

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
<hr />
<h3>Related Species</h3>

<p>
  Related species data comes from <a href="https://www.globalbioticinteractions.org/">GloBI</a>.
</p>

<GlobiList interactionTaxa={eatsTaxa} title="Eats" />
<GlobiList interactionTaxa={eatenByTaxa} title="Eaten by" />
<GlobiList interactionTaxa={pollinatesTaxa} title="Pollinates" />
<GlobiList interactionTaxa={pollinatedByTaxa} title="Pollinated by" />
<GlobiList interactionTaxa={preysOnTaxa} title="Preys on" />
<GlobiList interactionTaxa={preyedUponByTaxa} title="Preyed upon by" />
