<script>
  import GlobiList from '$lib/components/globi_list.svelte';
  import { formatTaxonDisplayName } from '$lib/formatUtils';

  export let project;
  export let taxon;
  export let interactions;
  export let projectPath;

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

    let taxon_ids = taxon.taxon_ids.split('|');
    let scientific_names = taxon.scientific_names.split('|');
    let common_names = taxon.common_names.split('|');
    let taxonomy = [];
    let ranks = {
      0: 'Kingdom',
      1: 'Phylum',
      2: 'Class',
      3: 'Order',
      4: 'Family',
      5: 'Genus',
      6: 'Species'
    };

    taxon_ids.forEach((taxon, i) => {
      if (taxon_ids[i]) {
        taxonomy.push({
          taxon_rank: ranks[i],
          taxon_id: taxon_ids[i],
          taxon_name: formatTaxonDisplayName({
            common_name: common_names[i],
            scientific_name: scientific_names[i]
          })
        });
      }
    });

    return taxonomy;
  }
</script>

<div class="prose">
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

  <h3>Taxonomy</h3>

  {#each displayTaxonomy(taxon) as level}
    <div>
      {level.taxon_rank}: <a href="{projectPath}/taxa/{level.taxon_id}">{level.taxon_name}</a>
    </div>
  {/each}

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

  <h3>More Information</h3>
  <a href="https://www.inaturalist.org/taxa/{taxon.taxon_id}">iNaturalist taxa</a>
</div>
