<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { createEventDispatcher } from 'svelte';

  export let observation;
  export let projectPath;
  export let allData = true;
  export let compact = false;

  const dispatch = createEventDispatcher();
</script>

<div class:prose={compact === false} class:p-4={allData && !compact}>
  {#if allData}
    <div class:text-lg={!compact} class:text-sm={compact} class="font-semibold leading-tight py-2">
      {@html formatTaxonDisplayName(observation, true)}
    </div>
  {/if}
  {#if allData && observation.user_login}
    <div>Observer: {observation.user_login}</div>
  {/if}
  {#if allData && observation.time_observed_at}
    <div>Date: {new Date(observation.time_observed_at).toLocaleDateString()}</div>
  {/if}
  {#if observation.quality_grade}
    <div>Quality grade: {observation.quality_grade}</div>
  {/if}
  {#if observation.license}
    <div>License: {observation.license}</div>
  {/if}
  {#if observation.description}
    <div>Description: {observation.description}</div>
  {/if}
  {#if observation.coordinates_obscured}
    <div>
      Coordinates are obscured:
      {#if observation.geoprivacy === 'obscured'}
        Observer has choosen to obscure the coordinates.
      {/if}
      {#if observation.taxon_geoprivacy === 'obscured'}
        Taxon is threatened or rare so the coordinates are obscured.
      {/if}
    </div>
  {/if}

  <a
    on:click={() => dispatch('changeTaxon', { taxon_id: observation.taxon_id })}
    class="mr-4"
    href="{projectPath}/taxa/{observation.taxon_id}">Species page</a
  >

  <a href="https://www.inaturalist.org/observations/{observation.id}">iNaturalist observation</a>
</div>
