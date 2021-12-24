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
    margin-top: 0 !important;
    margin-top: 0 !important;
  }

  li {
    margin-top: 0;
    margin-bottom: 0;
  }

  ul > li::before {
    content: none;
  }

  ul > li {
    position: normal;
    padding-left: 0;
  }
</style>
