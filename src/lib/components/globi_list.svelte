<script>
  export let interactionTaxa;
  export let title;
</script>

{#if interactionTaxa.length > 0}
  <h4>{title}</h4>
  <ul>
    {#each interactionTaxa as taxon}
      {#if taxon}
        <li>
          {#if taxon.target_common_name}{taxon.target_common_name}{/if}
          {#if taxon.target_scientific_name}<span class="text-gray-400"
              >({taxon.target_scientific_name})</span
            >{/if}
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
