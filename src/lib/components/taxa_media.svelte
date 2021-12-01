<script>
  let media = [{ id: 1 }, { id: 2 }, { id: 3 }];
</script>

<h1>Videos and Sound Files</h1>

<div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
  {#each media as medium}
    <div class="card bordered rounded-none" />
  {/each}
</div>

<style>
  .card {
    height: 200px;
    background-color: #ccc;
  }
</style>
