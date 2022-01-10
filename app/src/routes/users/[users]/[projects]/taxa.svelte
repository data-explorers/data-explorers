<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';

  export async function load({ params }) {
    let user = settings.filter((user) => user.username === params.users)[0];
    let project = user.projects.filter((project) => project.slug === params.projects)[0];
    let taxa;
    let projectPath = `${base}/users/${user.username}/${project.slug}`;

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

    return { props: { taxa, projectPath } };
  }
</script>

<script>
  import TaxaGrid from '$lib/components/taxa_grid.svelte';
  import { ranksReverse, speciesRanks } from '$lib/data/constants';
  import { toTitleCase, pluralize } from '$lib/formatUtils';

  export let taxa;
  export let projectPath;

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

  let displayTaxa = [];
  let submenuOptions = ranksReverse;
  let currentRank = 'species';
</script>

<main class="container mx-auto">
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
</main>

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
    margin: 0 0 0.5rem 0;
    padding: 0;
  }
</style>
