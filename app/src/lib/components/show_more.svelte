<script>
  import { createEventDispatcher } from 'svelte';
  import { tooltip } from '$lib/tooltip.js';

  export let showMore = false;
  export let format = 'upDown';
  export let top = 0;
  export let right = 0;
  export let border;
  export let position = 'absolute';
  export let lessTitle = 'click to show less info';
  export let moreTitle = 'click to show more info';

  const dispatch = createEventDispatcher();

  function handleClick() {
    showMore = !showMore;
    dispatch('toggleShowMore', { showMore });
  }
</script>

{#if format === 'upDown'}
  {#if showMore}
    <span
      class="arrow down-arrow"
      class:border
      class:border-1={border}
      class:absolute={position == 'absolute'}
      style="top: {top}; right: {right}"
      title={lessTitle}
      use:tooltip
      on:click={handleClick}
    />
  {:else}
    <span
      class="arrow up-arrow"
      class:border
      class:border-1={border}
      class:absolute={position == 'absolute'}
      style="top: {top}; right: {right}"
      title={moreTitle}
      use:tooltip
      on:click={handleClick}
    />
  {/if}
{:else if showMore}
  <span
    class="arrow left-arrow"
    class:border
    class:border-1={border}
    class:absolute={position == 'absolute'}
    style="top: {top}; right: {right}"
    title={lessTitle}
    use:tooltip
    on:click={handleClick}
  />
{:else}
  <span
    class="arrow right-arrow"
    class:border
    class:border-1={border}
    class:absolute={position == 'absolute'}
    style="top: {top}; right: {right}"
    title={moreTitle}
    use:tooltip
    on:click={handleClick}
  />
{/if}

<style>
  .arrow {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    font-size: 1.5rem;
    line-height: 1;
    width: 27px;
    height: 25px;
    font-weight: 900;
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
