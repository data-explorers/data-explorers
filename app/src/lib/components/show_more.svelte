<script>
  import { createEventDispatcher } from 'svelte';

  export let showMore;
  const dispatch = createEventDispatcher();

  function handleClick() {
    showMore = !showMore;
    dispatch('toggleShowMore');
  }
</script>

{#if showMore}
  <span class="down-arrow" title="click to show less info" on:click={handleClick} />
{:else}
  <span class="up-arrow" title="click to show more info" on:click={handleClick} />
{/if}

<style>
  .up-arrow,
  .down-arrow {
    position: absolute;
    right: 0px;
    top: 5px;
    padding: 0 5px;
    line-height: 1;
    cursor: pointer;
    font-size: 1.75rem;
    font-weight: 900;
    display: inline-block;
  }
  .up-arrow::after {
    display: inline-block;
    transform: scale(1, 0.6);
    content: '\2227';
  }

  .down-arrow::after {
    display: inline-block;
    transform: scale(1, 0.6);
    content: '\2228';
  }
</style>
