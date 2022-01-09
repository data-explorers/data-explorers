<script>
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';

  export let taxon;
  export let projectPath;
  export let taxa;

  $: childTaxa = getChildTaxa(taxa);

  function getChildTaxa(taxa) {
    return taxa
      .filter((t) => t.parent_id == taxon.taxon_id)
      .sort((a, b) => b.taxa_count - a.taxa_count);
  }
</script>

{#if childTaxa.length > 0}
  <ul>
    {#each childTaxa as taxon}
      <li>
        {taxon.rank}:
        <a href="{projectPath}/taxa/{taxon.taxon_id}">
          {@html formatTaxonDisplayName(taxon)}
        </a>
        {pluralize('observation', taxon.taxa_count)}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 0;
    padding: 0;
  }
</style>
