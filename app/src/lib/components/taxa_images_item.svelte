<script>
  import Modal from '$lib/components/modal.svelte';
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
        <img
          class="thumbnail"
          src={observation.image_url}
          alt="image of {observation.scientific_name}"
        />
      </ModalMagnify>
    </div>
    <div class="p-4">
      {@html formatTaxonDisplayName(observation, true)}<br />

      {observation.user_login}
      {#if observation.time_observed_at}
        at {new Date(observation.time_observed_at).toLocaleDateString()}
      {/if}
    </div>
  </div>
</div>

<style>
  .thumbnail {
    max-height: 250px;
  }
</style>
