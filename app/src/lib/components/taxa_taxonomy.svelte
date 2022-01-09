<script>
  import ChildTaxa from '$lib/components/taxa_child_taxa.svelte';
  import { pluralize, formatTaxonDisplayName } from '$lib/formatUtils';

  export let taxon;
  export let projectPath;
  export let taxa;

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
</script>

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

<style>
  :root {
    --step: 1.25rem;
  }

  .taxonomy {
    list-style: none;
    padding: 0;
  }

  .taxonomy li {
    padding: 0;
    margin: 0;
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
</style>
