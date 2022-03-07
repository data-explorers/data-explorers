<script context="module">
  import settings from '$lib/data/settings.json';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];

    let res = await import(`../../../../lib/data/${project.slug}/taxa.csv`);
    let taxa = res.default;
    taxa = taxa.sort((a, b) => b.taxa_count - a.taxa_count);

    return { props: { project, taxa, user } };
  }
</script>

<script>
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';
  import { base } from '$app/paths';

  export let project;
  export let taxa;
  export let user;
</script>

<main class="container mx-auto">
  <div class="prose">
    <h1>Taxa List</h1>
    {pluralize('taxon', taxa.length)}
    <ul>
      {#each taxa as taxon}
        <li>
          <a href="{base}/orgs/{org.username}/{project.slug}/taxa/{taxon.taxon_id}"
            >{@html formatTaxonDisplayName(taxon, true)}</a
          >, {pluralize('observation', taxon.taxa_count)}, {taxon.rank}
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
</style>
