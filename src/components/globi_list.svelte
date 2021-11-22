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
          {#if taxon.common_name}{taxon.common_name}{/if}
          {#if taxon.scientific_name}<span class="text-gray-400">({taxon.scientific_name})</span
            >{/if}
        </li>
      {/if}
    {/each}
  </ul>
{/if}
