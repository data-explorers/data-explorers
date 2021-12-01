<script>
  // https://www.reddit.com/r/sveltejs/comments/eo2xrs/building_a_tabs_component_with_svelte/
  export let tabs = [];
  export let activeTabValue = 0;
  // export let project = {};

  const handleClick = (tabValue, tabLabel) => {
    // let slug = tabLabel.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // history.pushState({}, "", `/projects/${project.slug}/${slug}`)
    activeTabValue = tabValue;
  };
</script>

<div class="tabs mt-4">
  {#each tabs as tab}
    <div class="tab tab-bordered" class:tab-active={activeTabValue === tab.value}>
      <span on:click={handleClick(tab.value, tab.label)}>{tab.label}</span>
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

<style>
  /* .box {
    margin-bottom: 10px;
    padding: 40px;
    border: 1px solid #dee2e6;
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    margin-bottom: -1px;
  }

  span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  } */
</style>
