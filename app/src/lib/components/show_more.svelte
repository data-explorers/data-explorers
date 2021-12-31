<script>
  import { createEventDispatcher } from 'svelte';
  import { tooltip } from '$lib/tooltip.js';

  export let showMore = false;
  export let format = 'upDown';
  const dispatch = createEventDispatcher();

  function handleClick() {
    showMore = !showMore;
    dispatch('toggleShowMore');
  }
</script>

{#if format === 'upDown'}
  {#if showMore}
    <span
      class="arrow down-arrow"
      title="click to show less info"
      use:tooltip
      on:click={handleClick}
    />
  {:else}
    <span
      class="arrow up-arrow"
      title="click to show more info"
      use:tooltip
      on:click={handleClick}
    />
  {/if}
{:else if showMore}
  <span
    class="arrow left-arrow"
    title="click to show less info"
    use:tooltip
    on:click={handleClick}
  />
{:else}
  <span
    class="arrow right-arrow"
    title="click to show more info"
    use:tooltip
    on:click={handleClick}
  />
{/if}

<style>
  .arrow {
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

  .left-arrow {
    transform: rotate(90deg);
  }
  .left-arrow::after {
    display: inline-block;
    transform: scale(1, 0.6);
    content: '\2227';
  }
  .right-arrow {
    transform: rotate(90deg);
  }
  .right-arrow::after {
    display: inline-block;
    transform: scale(1, 0.6);
    content: '\2228';
  }
</style>
