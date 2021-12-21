<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  export let observation;
</script>

{#if observation}
  <div>
    {#if observation.image_url}
      <figure class="bg-black">
        <img
          class="mb-2"
          src={observation.image_url}
          alt="image of {formatTaxonDisplayName(observation)}"
        />
      </figure>
    {/if}
    <div class="py-2">
      {@html formatTaxonDisplayName(observation, true)}<br />
      {observation.user_login}
      {#if observation.time_observed_at}
        at {new Date(observation.time_observed_at).toLocaleDateString()}
      {/if}

      <div />
    </div>
  </div>
{:else}
  <div />
{/if}

<style>
  figure {
    min-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
  }

  img {
    max-height: 400px;
  }

  div {
  }
</style>
