<script context="module">
  import projects from '$lib/data/projects.json';

  export async function load({ page }) {
    let project = projects.filter((p) => p.slug == page.params.slug)[0];
    return { props: { project } };
  }
</script>

<script>
  export let project;
</script>

<div class="card lg:card-side bordered">
  <figure>
    <img src="{project.image}/400/400" />
  </figure>
  <div class="card-body prose">
    <h1>{project.title}</h1>
    <p>{project.summary}</p>
    <dl>
      <dt class="font-bold">Location</dt>
      <dd>{project.location}</dd>
      <dt class="font-bold">Start Date</dt>
      <dd>{project.start_date}</dd>
      <dt class="font-bold">Audience</dt>
      <dd>{project.target_audience}</dd>
    </dl>
  </div>
</div>

<main class="prose">
  <div>{@html project.description}</div>
</main>
