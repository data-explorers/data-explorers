<script>
  export let showSpeciesList = false;
  export let speciesList = [];
</script>

{#if showSpeciesList}
  <span class="font-semibold inline-block mt-4 text-lg">{speciesList.length} species on map</span>
  <ul class="species-list">
    {#each speciesList as species}
      <li>{@html species.name}</li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    margin-top: 0;
  }
  .species-list li {
    margin: 0;
  }
</style>
