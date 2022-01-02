<script>
  import CircleIcon from '$lib/components/icons/circle.svelte';
  import XIcon from '$lib/components/icons/x.svelte';
  import { pluralize } from '$lib/formatUtils';
  import { fade } from 'svelte/transition';
  import { tooltip } from '$lib/tooltip.js';

  export let taxon;
  export let toggleTaxon;
  export let removeTaxon;
  export let projectPath;
</script>

<div class="border relative filter" class:active={taxon.active} in:fade out:fade>
  <div class="image-card-side">
    <figure>
      {#if taxon.image_url}
        <img
          class="cursor-pointer"
          on:click={toggleTaxon}
          data-filter={taxon.taxon_id}
          src={taxon.image_url.replace('medium', 'square')}
          alt="photo of {taxon.taxon_name}"
        />
      {:else}
        <img src="/images/missing-image.png" alt="" />
      {/if}
    </figure>

    <div
      class="image-card-side-body cursor-pointer "
      on:click={toggleTaxon}
      data-filter={taxon.taxon_id}
    >
      <div class="leading-normal" data-filter={taxon.taxon_id}>
        <CircleIcon
          clickHandler={toggleTaxon}
          cursorPointer={true}
          value={taxon.taxon_id}
          color={taxon.color}
        />
        <span class="cursor-pointer" data-filter={taxon.taxon_id}>{taxon.taxon_name}</span><br />

        <span class="cursor-pointer" data-filter={taxon.taxon_id}>
          {pluralize('observation', taxon.taxa_count)}
        </span>
      </div>
    </div>
  </div>
  <button
    use:tooltip
    class="absolute close-button"
    title="click to delete species"
    data-taxon-id={taxon.taxon_id}
    on:click={removeTaxon}
  >
    <XIcon value={taxon.taxon_id} />
  </button>
  <a href="{projectPath}/taxa/{taxon.taxon_id}">Species page</a>
</div>

<style>
  .close-button {
    top: 0;
    right: 2px;
  }

  .filter {
    opacity: 0.5;
  }

  .filter.active {
    opacity: 1;
  }

  .image-card-side {
    border-width: 0;
  }

  .image-card-side-body {
    margin-right: 18px;
  }

  .image-card-side:hover {
    box-shadow: none;
  }
</style>
