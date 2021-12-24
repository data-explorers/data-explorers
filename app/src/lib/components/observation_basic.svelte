<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import ShowMore from '$lib/components/show_more.svelte';
  import ObservationData from '$lib/components/observation_data.svelte';
  import { fly } from 'svelte/transition';

  export let observation;
  export let projectPath;
  export let taxon;

  $: xValue = showMore ? -20 : 20;

  let showMore = false;
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

    <div class="relative py-2">
      <ShowMore {showMore} on:toggleShowMore={() => (showMore = !showMore)} />
      <div class="text-lg font-semibold">{@html formatTaxonDisplayName(observation, true)}</div>

      {#if observation.user_login}
        <div>Observer: {observation.user_login}</div>
      {/if}
      {#if observation.time_observed_at}
        <div>Date: {new Date(observation.time_observed_at).toLocaleDateString()}</div>
      {/if}

      {#if showMore}
        <div
          class="overlay w-full absolute bg-white z-10"
          transition:fly={{ y: xValue, duration: 800 }}
        >
          <ShowMore {showMore} on:toggleShowMore={() => (showMore = !showMore)} />
          <ObservationData {observation} {projectPath} {taxon} on:zoomToObservation />
        </div>
      {/if}

      <div />
    </div>
  </div>
{:else}
  <div />
{/if}

<style>
  .overlay {
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
    top: 0;
  }
  figure {
    min-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    max-height: 400px;
  }
</style>
