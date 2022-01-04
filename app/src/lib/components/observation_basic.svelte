<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import ObservationData from '$lib/components/observation_data.svelte';

  export let observation;
  export let projectPath;
  export let taxon;
</script>

{#if observation}
  <div>
    {#if observation.image_url}
      <figure class="bg-black">
        <img
          class="mb-2"
          src={observation.image_url}
          alt="photo of {formatTaxonDisplayName(observation)}"
        />
      </figure>
    {:else}
      <figure>
        <img class="mb-2" src="/images/missing-image.png" alt="" />
      </figure>
    {/if}

    <div class="data">
      <ObservationData
        {observation}
        {projectPath}
        {taxon}
        on:zoomToObservation
        compactLayout={true}
      />
    </div>
  </div>
{:else}
  <div />
{/if}

<style>
  .data {
    min-height: 255px;
  }
  figure {
    min-height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    max-height: 450px;
  }
</style>
