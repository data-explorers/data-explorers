<script context="module">
  import data from '$lib/data/data.json';
  import { convertTaxa, convertObservations } from '$lib/convert_data';

  export async function load({ page }) {
    let user = data.filter((user) => user.username === page.params.users)[0];
    let project = user.projects.filter((project) => project.slug === page.params.projects)[0];
    let taxa;
    let projectPath = `/users/${user.username}/${project.slug}`;

    if (!project) {
      taxa = [];
      project = { tabs: [] };
    } else {
      // BUGS:
      // 1. must use relative paths since we can't use `$lib/${variable}` in
      // dev server.
      // 2. must use import(`string`) since import(variable) doesn't work
      // during build process.
      let res = await import(`../../../../lib/data/${project.slug}/taxa.csv`);
      taxa = res.default;
    }

    return { props: { project, taxa, user, projectPath } };
  }
</script>

<script>
  import TaxaGrid from '$lib/components/taxa_grid.svelte';
  import ProjectHeader from '$lib/components/project_header.svelte';
  import { ranksReverse, speciesRanks } from '$lib/data/constants';
  import { toTitleCase, pluralize } from '$lib/formatUtils';

  export let project;
  export let taxa;
  export let user;
  export let projectPath;
  let displayTaxa = [];
  let submenuOptions = ranksReverse;
  let currentRank = 'species';

  $: {
    if (currentRank === 'species') {
      displayTaxa = taxa.filter((t) => t.observations_count > 0 && speciesRanks.includes(t.rank));
    } else if (ranksReverse.includes(currentRank)) {
      displayTaxa = taxa
        .filter((t) => t.rank === currentRank)
        .sort((a, b) => b.taxa_count - a.taxa_count);
    } else {
      displayTaxa = [];
    }
  }
</script>

<ProjectHeader {project} {user} />

<div class="prose max-w-none">
  <h1>{toTitleCase(pluralize(currentRank, displayTaxa.length))}</h1>

  <ul class="submenu">
    {#each submenuOptions as option}
      <li
        class="px-3"
        class:active={option === currentRank}
        on:click={() => (currentRank = option)}
      >
        {option}
      </li>
    {/each}
  </ul>

  {#if displayTaxa.length > 0}
    <TaxaGrid taxa={displayTaxa} {projectPath} />
  {/if}
</div>

<style>
  .submenu {
    display: inline-flex;
    flex-direction: row;
  }

  .submenu .active {
    --tw-border-opacity: 1;
    border-color: hsla(var(--p) / var(--tw-border-opacity, 1));
    border-left-width: 0;
    border-bottom-width: 1px;
    border-color: var(--bc);
  }
  .prose ul {
    list-style-type: none;
    margin-top: 0;
  }

  .prose li {
    padding: 0;
    padding: 0 0.6em;
  }

  .prose ul > li::before {
    content: none;
  }
</style>
