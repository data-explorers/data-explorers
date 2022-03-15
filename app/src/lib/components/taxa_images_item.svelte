<script>
  import ModalMagnify from '$lib/components/modal-magnify.svelte';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { createEventDispatcher } from 'svelte';
  import { base } from '$app/paths';

  export let observation;
  export let projectPath;
  export let showTaxaLink = true;

  let taxaPath = `${projectPath}/taxa/${observation.taxon_id}`;
  let observerPath = `${projectPath}/users/${observation.user_id}`;

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
          <img src="{base}/images/missing-image.png" alt="" />
        {/if}
      </ModalMagnify>
    </div>
    <div class="p-4">
      <div>
        {#if showTaxaLink}
          <a href={taxaPath}>{@html formatTaxonDisplayName(observation, true, false, true)}</a>
        {:else}
          {@html formatTaxonDisplayName(observation, true, false, true)}
        {/if}
      </div>
      <div>Observer: <a href={observerPath}>{observation.user_login}</a></div>
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
