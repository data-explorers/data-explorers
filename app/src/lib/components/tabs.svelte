<script>
  // https://www.reddit.com/r/sveltejs/comments/eo2xrs/building_a_tabs_component_with_svelte/
  export let tabs = [];
  export let activeTabValue = 0;

  const handleClick = (tabValue) => {
    activeTabValue = tabValue;
  };
</script>

<div class="tabs my-6 border-b-2">
  {#each tabs as tab}
    <div class="tab" class:tab-active={activeTabValue === tab.value}>
      <span on:click={handleClick(tab.value)}>{tab.label}</span>
    </div>
  {/each}
</div>
{#each tabs as tab}
  {#if activeTabValue == tab.value}
    <div class="box">
      <svelte:component this={tab.component} {...tab.props} on:zoomToObservation />
    </div>
  {/if}
{/each}

<style>
  .tab-active {
    @apply font-bold;
  }
</style>
