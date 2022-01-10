<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { createEventDispatcher } from 'svelte';

  export let observation = {};
  export let projectPath;
  export let compactLayout = false;
  export let enableZoomToObservation = true;
  export let taxon = {};

  const dispatch = createEventDispatcher();

  function zoomToObservation() {
    dispatch('zoomToObservation', {
      observation_id: observation.id,
      latitude: observation.latitude,
      longitude: observation.longitude
    });
  }
</script>

<div class:prose={compactLayout === false} class:p-4={!compactLayout}>
  <h3 class:small={compactLayout}>{@html formatTaxonDisplayName(observation, true)}</h3>
  <dl>
    {#if observation.user_login}
      <dt>Observer</dt>
      <dd>{observation.user_login}</dd>
    {/if}
    {#if observation.time_observed_at}
      <dt>Date</dt>
      <dd>{new Date(observation.time_observed_at).toLocaleDateString()}</dd>
    {/if}
    {#if observation.quality_grade}
      <dt>Quality grade</dt>
      <dd>{observation.quality_grade}</dd>
    {/if}
    {#if observation.license}
      <dt>License</dt>
      <dd>{observation.license}</dd>
    {/if}
    {#if observation.description}
      <dt>Description</dt>
      <dd>{observation.description}</dd>
    {/if}
    {#if observation.coordinates_obscured}
      <dt>Coordinates are obscured</dt>
      <dd>
        {#if observation.geoprivacy === 'obscured'}
          Observer has choosen to obscure the coordinates.
        {/if}
        {#if observation.taxon_geoprivacy === 'obscured'}
          Taxon is threatened or rare so the coordinates are obscured.
        {/if}
      </dd>
    {/if}
  </dl>

  {#if enableZoomToObservation}
    <span class="link-color mr-4" on:click={zoomToObservation}>Show on map</span>
  {/if}

  {#if observation.taxon_id !== taxon.taxon_id}
    <a
      on:click={() => dispatch('changeTaxon', { taxon_id: observation.taxon_id })}
      class="mr-4"
      href="{projectPath}/taxa/{observation.taxon_id}">Species page</a
    >
  {/if}

  <a class="external-link" href="https://www.inaturalist.org/observations/{observation.id}"
    >iNaturalist observation</a
  >
</div>

<style>
  h3.small {
    font-size: inherit;
  }
  h3 {
    @apply mt-2;
    @apply mb-2;
  }
  .link-color {
    color: var(--link-color);
  }
  .link-color:hover {
    color: inherit;
  }

  dl {
    @apply mb-2;
  }

  dt {
    float: left;
    clear: left;
    @apply font-medium;
    padding-right: 0.5rem;
  }

  dt::after {
    content: ':';
  }

  a {
    white-space: nowrap;
  }
</style>
