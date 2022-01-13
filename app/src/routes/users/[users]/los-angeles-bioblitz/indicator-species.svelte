<script context="module">
  import settings from '$lib/data/settings.json';
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { base } from '$app/paths';

  export async function load({ params, url }) {
    let user = settings.filter((user) => user.username === params.users)[0];
    let project = user.projects.filter((project) => project.slug === 'los-angeles-bioblitz')[0];

    return { props: { user, project } };
  }
</script>

<script>
  import allTaxa from '$lib/data/los-angeles-bioblitz/taxa.csv';
  import { pluralize } from '$lib/formatUtils';

  let taxa = allTaxa.filter((t) => !!t.taxon_group);

  export let user;
  export let project;
</script>

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>{taxa.length} Indicator Species</h1>

    <div class="grid lg:grid-cols-4 md:grid-cols-3  sm:grid-cols-2 justify-center gap-3">
      {#each taxa as taxon}
        <div class="image-card">
          <a href="{base}/users/{user.username}/{project.slug}/taxa/{taxon.taxon_id}">
            <figure>
              {#if taxon.image_url}
                <img src={taxon.image_url} alt="photo of {formatTaxonDisplayName(taxon)}" />
              {:else}
                <img src="{base}/images/missing-image.png" alt="" />
              {/if}
            </figure>

            <div class="image-card-body">
              <div class="text-lg font-medium leading-normal">
                {@html formatTaxonDisplayName(taxon, true)}
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
