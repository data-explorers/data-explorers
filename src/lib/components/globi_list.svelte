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
          <a class="external-link" href="https://www.inaturalist.org/taxa/{taxon.target_taxon_id}"
            >iNaturalist link</a
          >
        </li>
      {/if}
    {/each}
  </ul>
{/if}

<style>
  .external-link {
    font-size: 0.85rem;
    margin-left: 0.5rem;
  }
</style>
