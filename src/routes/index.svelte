<script>
  import projects from '$lib/data/projects.json';
</script>

<h1 class="text-4xl text-center m-8 font-extrabold">Projects</h1>

<div class="grid lg:grid-cols-3 md:grid-cols-2  justify-center gap-3">
  {#each projects as { id, title, summary, slug, image }}
    <a href="/projects/{slug}">
      <div class="card bordered">
        <figure>
          <img src="{image}/400/250" />
        </figure>
        <div class="card-body prose prose-lg">
          <h2 class="card-title">{title}</h2>
          <p>{summary}</p>
        </div>
      </div>
    </a>
  {/each}
</div>
