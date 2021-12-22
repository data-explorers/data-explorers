<script>
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import ObservationData from '$lib/components/observation_data.svelte';
  import { formatTaxonDisplayName } from '$lib/formatUtils';

  export let observation;
  export let projectPath;

  const dispatch = createEventDispatcher();
</script>

<section class="lightbox" in:fade out:fade>
  <div>
    <span class="prev" on:click={() => dispatch('prevClick', { observation_id: observation.id })}
      >&#10094;</span
    >
    <span class="next" on:click={() => dispatch('nextClick', { observation_id: observation.id })}
      >&#10095;</span
    >
  </div>
  <span class="close" on:click>&#10007;</span>
  <main>
    <article>
      <ObservationData on:changeTaxon {observation} {projectPath} />

      <figure>
        {#if observation.image_url}
          <img
            src={observation.image_url.replace('medium', 'large')}
            alt="photo of {formatTaxonDisplayName(observation)}"
          />
        {:else}
          <img src="/images/missing-image.png" alt="" />
        {/if}
      </figure>
    </article>
  </main>
</section>

<style>
  .lightbox {
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    z-index: 1001;
    overflow-y: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  main {
    flex-direction: column;
    align-items: center;
    display: flex;
    padding: 20px 60px;
  }

  article {
    background: white;
  }

  img {
    /* max-height: 80vh; */
    border: 2px solid white;
  }

  .close {
    color: white;
    position: absolute;
    top: 1%;
    right: 1%;
    font-size: 2rem;
    font-weight: 400;
  }

  .close:hover {
    color: #999;
    text-decoration: none;
    cursor: pointer;
  }

  .prev {
    left: 10px;
  }

  .next {
    right: 10px;
  }

  .prev,
  .next {
    cursor: pointer;
    color: white;
    font-size: 2rem;
    position: absolute;
    top: 50%;
  }

  .prev:hover,
  .next:hover {
    color: #999;
  }
</style>
