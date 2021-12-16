<script>
  export let modalname;
</script>

<figure>
  <label for={modalname}>
    <div class="magnify-overlay"><span>+</span></div>

    <div class="thumbnail">
      <slot />
    </div>
  </label>
</figure>

<style>
  figure {
    position: relative;
  }

  .magnify-overlay {
    font-size: 3em;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
  }

  figure:hover .magnify-overlay {
    opacity: 1;
  }

  figure:hover .thumbnail {
    opacity: 0.5;
  }
</style>
