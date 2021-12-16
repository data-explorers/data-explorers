<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  export let interactionTaxa;
  export let title;
</script>

{#if interactionTaxa.length > 0}
  <h4>{title}</h4>
  <ul>
    {#each interactionTaxa as taxon}
      {#if taxon}
        <li>
          {@html formatTaxonDisplayName(
            {
              common_name: taxon.target_common_name,
              scientific_name: taxon.target_scientific_name
            },
            true
          )}
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
