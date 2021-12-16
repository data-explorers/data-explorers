<script context="module">
  import data from '$lib/data/data.json';

  export async function load({ page }) {
    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let taxa;

    if (!project) {
      taxa = [];
      project = { tabs: [] };
    } else {
      // BUGS:
      // 1. must use relative paths since we can't use `$lib/${variable}` in
      // dev server.
      // 2. must use import(`string`) since import(variable) doesn't work
      // during build process.
      let res = await import(`../../../../lib/data/${project.slug}/taxa.json`);
      taxa = res.default;
      taxa = taxa.filter((t) => t.is_species);
    }

    return { props: { project, taxa, user, pagePath: page.path } };
  }
</script>

<script>
  import TaxaGrid from '$lib/components/taxa_grid.svelte';
  import ProjectHeader from '$lib/components/project_header.svelte';

  export let project;
  export let taxa;
  export let user;
  export let pagePath;
</script>

<ProjectHeader {project} {user} />

<TaxaGrid {project} {taxa} {user} {pagePath} />
