<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  export let interactionTaxa;
  export let title;
  export let taxonIds;
  export let projectPath;
</script>

{#if interactionTaxa.length > 0}
  <h4>{title}</h4>
  <ul>
    {#each interactionTaxa as taxon}
      {#if taxon}
        <li>
          {#if taxonIds.includes(Number(taxon.target_taxon_id))}
            <a href="{projectPath}/taxa/{taxon.target_taxon_id}">
              {formatTaxonDisplayName({
                common_name: taxon.target_common_name,
                scientific_name: taxon.target_scientific_name
              })}</a
            >
          {:else}
            {@html formatTaxonDisplayName(
              {
                common_name: taxon.target_common_name,
                scientific_name: taxon.target_scientific_name
              },
              true
            )}
          {/if}
        </li>
      {/if}
    {/each}
  </ul>
{/if}

<style>
  li {
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
