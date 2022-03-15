<script context="module">
  import settings from '$lib/data/settings.json';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { base } from '$app/paths';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === 'los-angeles-bioblitz')[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    return { props: { projectPath } };
  }
</script>

<script>
  import allTaxa from '$lib/data/los-angeles-bioblitz/taxa.csv';
  import { pluralize } from '$lib/formatUtils';

  export let projectPath;

  let taxa = allTaxa.filter((t) => !!t.taxon_group);
</script>

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>{taxa.length} Indicator Species</h1>

    <div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
      {#each taxa as taxon}
        <div class="image-card">
          <a href="{projectPath}/taxa/{taxon.taxon_id}">
            <figure>
              {#if taxon.image_url}
                <img src={taxon.image_url} alt="photo of {formatTaxonDisplayName(taxon)}" />
              {:else}
                <img src="{base}/images/missing-image.png" alt="" />
              {/if}
            </figure>

            <div class="image-card-body">
              <div class="text-lg font-medium leading-normal">
                {@html formatTaxonDisplayName(taxon, true, false, true)}
              </div>
              <div>{pluralize('observation', taxon.observations_count)}</div>
              <div>{taxon.taxon_group}</div>
              <div>{taxon.type}</div>
            </div>
          </a>
        </div>
      {/each}
    </div>
  </div>
</main>
