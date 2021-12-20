<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';

  export let taxon;
  export let projectPath;
  export let taxa;

  $: childTaxa = getChildTaxa(taxa);

  function getChildTaxa(taxa) {
    return taxa
      .filter((t) => t.parent_id == taxon.taxon_id)
      .sort((a, b) => {
        if (a.common_name && b.common_name) {
          return a.common_name.toLowerCase().localeCompare(b.common_name.toLowerCase());
        } else {
          return a.scientific_name.toLowerCase().localeCompare(b.scientific_name.toLowerCase());
        }
      });
  }
</script>

{#if childTaxa.length > 0}
  <ul>
    {#each childTaxa as taxon}
      <li>
        {taxon.rank}:
        <a href="{projectPath}/taxa/{taxon.taxon_id}">
          {@html formatTaxonDisplayName(taxon, true)}
        </a>
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
