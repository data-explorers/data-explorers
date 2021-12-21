<script>
  export let modalname;
</script>

<div class="thumbnail-container">
  <figure>
    <slot />
  </figure>
  <div class="overlay"><div class="text">+</div></div>
</div>

<style>
  .thumbnail-container {
    position: relative;
  }

  .overlay {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  figure {
    /* background-color: black; */
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .text {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 2rem;
    padding: 6px 12px;
    line-height: 1;
  }

  .thumbnail-container:hover figure {
    opacity: 0.6;
  }
  .thumbnail-container:hover .overlay {
    opacity: 1;
  }
</style>
