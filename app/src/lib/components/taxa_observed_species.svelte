<script>
  import { speciesRanks } from '$lib/data/constants';
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';

  export let observations;
  export let taxon;
  export let projectPath;
  export let taxa;

  let page = 1;
  let limit = 20;

  $: observedTaxa = getObservedTaxa(observations);
  $: observedTaxaDisplay = observedTaxa.slice(0, page * limit);
  $: showLoadMore = page * limit < observedTaxa.length;

  function getObservedTaxa(observations) {
    let taxaObj = {};
    let ids = [];

    // get unique species from all the observations
    observations
      .filter((o) => speciesRanks.includes(o.rank))
      .forEach((o) => {
        if (!ids.includes(o.taxon_id)) {
          // create new taxon object
          taxaObj[o.taxon_id] = {
            count: 1,
            taxon_id: o.taxon_id,
            name: formatTaxonDisplayName(o, true),
            image_url: o.image_url
              ? o.image_url.replace('medium', 'square')
              : '/images/missing-image.png'
          };
        } else {
          // increment count of existing taxon object
          taxaObj[o.taxon_id]['count'] += 1;
        }
        ids.push(o.taxon_id);
      });

    return Object.values(taxaObj).sort((a, b) => b.count - a.count);
  }

  function loadMore() {
    page = page + 1;
    observedTaxaDisplay = observedTaxa.slice(0, page * limit);
  }
</script>

{#if observedTaxa.length > 1}
  <h3>{observedTaxa.length} Observed species for {formatTaxonDisplayName(taxon)}</h3>
  <div class="grid md:grid-cols-2  sm:grid-cols-1 gap-2">
    {#each observedTaxaDisplay as taxon}
      <div class="image-card-side">
        <a href="{projectPath}/taxa/{taxon.taxon_id}">
          <figure>
            <img src={taxon.image_url} alt="photo of {taxon.common_name}" />
          </figure>
        </a>

        <div class="image-card-side-body">
          <a href="{projectPath}/taxa/{taxon.taxon_id}">
            {@html taxon.name}<br />
            {pluralize('observation', taxon.count)}
          </a>
        </div>
      </div>
    {/each}
  </div>
  <div class="grid justify-items-center mt-8">
    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
{/if}

<style>
  .image-card-side {
    display: flex;
    @apply border;
    align-items: stretch;
    flex-direction: row;
    overflow: hidden;
    position: relative;
  }

  .image-card-side-body {
    width: 100%;
  }
  .image-card-side:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
  }

  .image-card-side figure {
    min-width: 75px;
  }

  .image-card-side figure,
  .image-card-side figure > * {
    width: 100%;
    background-color: red;
  }

  .image-card-side img {
    /* object-fit: cover; */

    max-width: 75px;
    background-color: red;
  }

  .image-card-side-body {
    margin-left: 10px;
  }

  .image-card-side-body a {
    text-decoration: none;
    width: 100%;
    display: inline-block;
    height: 100%;
    /* line-height: 1.4; */
    /* background-color: red; */
  }
</style>
