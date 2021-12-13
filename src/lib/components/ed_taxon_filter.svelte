<script>
  import CircleIcon from '$lib/components/svg/circle.svelte';
  import XIcon from '$lib/components/svg/x.svelte';
  import { pluralize } from '$lib/formatUtils';

  export let taxon;
  export let toggleTaxon;
  export let removeTaxon;
</script>

<div class="border p-1 mb-2">
  <input type="checkbox" checked="checked" data-taxon-id={taxon.taxonId} on:click={toggleTaxon} />
  <CircleIcon color={taxon.color} />
  <button class="float-right" data-taxon-id={taxon.taxonId} on:click={removeTaxon}>
    <XIcon value={taxon.taxonId} />
  </button>
  <span class="text-sm"
    >{taxon.taxonName}, {pluralize('observation', taxon.observations.length)}</span
  >
</div>
