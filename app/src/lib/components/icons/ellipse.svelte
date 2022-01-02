<script>
  export let value;
  export let border = false;
</script>

<span class:border class:border-1={border} class="icon-container">
  <span class="icon" data-taxon-id={value}>&vellip;</span>
</span>

<style>
  .icon-container {
    display: block;
    line-height: 26px;
    width: 26px;
    height: 26px;
    border-top: 0;
    border-right: 0;
  }

  .icon {
    font-size: 22px;
    line-height: 0.9;
    font-weight: 900;
  }
</style>
