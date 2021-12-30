<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import ObservationData from '$lib/components/observation_data.svelte';
  import { MyPopup } from '$lib/vendor/svelte-leaflet';

  export let observation;
  export let projectPath;
</script>

<MyPopup>
  {#if observation}
    {#if observation.image_url}
      <img
        class="mb-2"
        src={observation.image_url.replace('medium', 'small')}
        alt="photo of {formatTaxonDisplayName(observation)}"
      />
    {:else}
      <img class="mb-2" src="/images/missing-image.png" alt="" />
    {/if}
    <ObservationData
      {observation}
      {projectPath}
      compactLayout={true}
      enableZoomToObservation={false}
    />
  {/if}
</MyPopup>
