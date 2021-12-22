<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { Popup } from 'svelte-leafletjs';
  import ObservationData from '$lib/components/observation_data.svelte';

  export let observation;
  export let projectPath;
</script>

<Popup>
  {#if observation.image_url}
    <img
      class="mb-2"
      src={observation.image_url.replace('medium', 'small')}
      alt="photo of {formatTaxonDisplayName(observation)}"
    />
  {:else}
    <img class="mb-2" src="/images/missing-image.png" alt="" />
  {/if}
  <ObservationData {observation} {projectPath} compact={true} />
</Popup>
