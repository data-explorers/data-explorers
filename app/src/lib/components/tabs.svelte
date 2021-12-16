<script>
  // https://www.reddit.com/r/sveltejs/comments/eo2xrs/building_a_tabs_component_with_svelte/
  export let tabs = [];
  export let activeTabValue = 0;

  const handleClick = (tabValue) => {
    activeTabValue = tabValue;
  };
</script>

<div class="tabs my-4">
  {#each tabs as tab}
    <div class="tab tab-bordered" class:tab-active={activeTabValue === tab.value}>
      <span on:click={handleClick(tab.value)}>{tab.label}</span>
    </div>
  {/each}
</div>
{#each tabs as tab}
  {#if activeTabValue == tab.value}
    <div class="box">
      <svelte:component this={tab.component} {...tab.props} />
    </div>
  {/if}
{/each}
