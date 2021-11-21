<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    console.log(page);
    let user = data.filter((user) => user.username == page.params.users)[0];
    console.log(user);

    let project = user.projects.filter((project) => project.slug == page.params.projects)[0];
    console.log(project);

    let taxa;

    if (!project) {
      taxa = [];
      project = { tabs: [] };
    } else {
      let importFrom = `../../../../lib/data/${project.slug}/taxa.json`;
      console.log('>>>', importFrom);
      let res = await import(importFrom);
      taxa = res.default;
      console.log('>>>', taxa);
    }

    return { props: { project, taxa, user } };
  }
</script>

<script>
  import TaxaGrid from '../../../../components/taxa_grid.svelte';
  import ProjectHeader from '../../../../components/project_header.svelte';

  export let project;
  export let taxa;
  export let user;

</script>

<ProjectHeader {project} {user} />

<TaxaGrid {project} {taxa} {user} />

