<script>
  export let project;
</script>

<main class="">
  <div class="grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-3">
    <div class="col-span-2 prose">
      <dl>
        <dt class="font-bold">Location</dt>
        <dd>{project.location}</dd>
        <dt class="font-bold">Start Date</dt>
        <dd>{project.start_date}</dd>
        <dt class="font-bold">Audience</dt>
        <dd>{project.target_audience}</dd>
        <dt class="font-bold">Links</dt>
        {#each project.links as link}
          <dd><a href={link.url}>{link.text}</a></dd>
        {/each}
      </dl>
      {@html project.description}
    </div>
    <div>
      <img src="/{project.slug}/observations_map_square.jpg" alt="map of {project.title}" />
    </div>
  </div>
</main>
