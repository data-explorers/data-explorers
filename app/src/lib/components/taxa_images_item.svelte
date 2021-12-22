<script>
  import ModalMagnify from '$lib/components/modal-magnify.svelte';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { createEventDispatcher } from 'svelte';

  export let observation;

  const dispatch = createEventDispatcher();
</script>

<div class="border border-1 h-full">
  <div class="">
    <div on:click={() => dispatch('thumbnailClick', { observation_id: observation.id })}>
      <ModalMagnify>
        {#if observation.image_url}
          <img
            class="thumbnail"
            src={observation.image_url}
            alt="photo of {formatTaxonDisplayName(observation)}"
          />
        {:else}
          <img src="/images/missing-image.png" alt="" />
        {/if}
      </ModalMagnify>
    </div>
    <div class="p-4">
      <div>{@html formatTaxonDisplayName(observation, true)}</div>
      <div>Observer: {observation.user_login}</div>
      {#if observation.time_observed_at}
        <div>Date: {new Date(observation.time_observed_at).toLocaleDateString()}</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .thumbnail {
    max-height: 250px;
  }
</style>
