<script>
  import { fade, fly } from 'svelte/transition';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { createEventDispatcher } from 'svelte';

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
      <div class="body prose">
        <span class="text-lg font-semibold">{@html formatTaxonDisplayName(observation, true)}</span
        ><br />
        <b>Observer:</b>
        {observation.user_login}<br />
        {#if observation.time_observed_at}
          <b>Date:</b> {new Date(observation.time_observed_at).toLocaleDateString()}<br />
        {/if}

        {#if observation.quality_grade}
          <b>Quality grade:</b> {observation.quality_grade}<br />
        {/if}
        {#if observation.license}
          <b>License:</b> {observation.license}<br />
        {/if}
        {#if observation.description}
          <b>Description:</b> {observation.description}<br />
        {/if}

        {#if observation.coordinates_obscured}
          <b>Coordinates are obscured:</b>
          {#if observation.geoprivacy === 'obscured'}
            Observer has choosen to obscure the coordinates.
          {/if}
          {#if observation.taxon_geoprivacy === 'obscured'}
            Taxon is threatened or rare so the coordinates are obscured.
          {/if}<br />
        {/if}

        <a
          on:click={() => dispatch('changeTaxon', { taxon_id: observation.taxon_id })}
          class="mr-4"
          href="{projectPath}/taxa/{observation.taxon_id}">Species page</a
        >

        <a href="https://www.inaturalist.org/observations/{observation.id}"
          >iNaturalist observation</a
        >
      </div>

      <figure>
        <img src={observation.image_url.replace('medium', 'large')} alt={observation.common_name} />
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

  .body {
    padding: 1rem;
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
