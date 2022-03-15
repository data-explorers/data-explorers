<script>
  import { formatTaxonDisplayName, pluralize } from '$lib/formatUtils';
  import { base } from '$app/paths';

  export let taxaPath;
  export let taxon;
</script>

<div class="image-card-side">
  <a href="{taxaPath}/{taxon.taxon_id}">
    <figure>
      {#if taxon.image_url}
        <img
          src={taxon.image_url.replace('medium', 'square')}
          alt="photo of {formatTaxonDisplayName(taxon)}"
        />
      {:else}
        <img src="{base}/images/missing-image.png" alt="" />
      {/if}
    </figure>
  </a>
  <a class="w-full" href="{taxaPath}/{taxon.taxon_id}">
    <div class="image-card-side-body">
      {@html formatTaxonDisplayName(taxon, true, false, true)}<br />
      {pluralize('observation', taxon.taxa_count)}
    </div>
  </a>
</div>
