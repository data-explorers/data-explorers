<script>
  import CircleIcon from '$lib/components/svg/circle.svelte';
  import XIcon from '$lib/components/svg/x.svelte';
  import { pluralize } from '$lib/formatUtils';

  export let taxon;
  export let toggleTaxon;
  export let removeTaxon;
  export let projectPath;
</script>

<div class="border p-1 mb-2 relative">
  <label class="cursor-pointer inline-block">
    <input type="checkbox" checked="checked" data-taxon-id={taxon.taxonId} on:click={toggleTaxon} />
    <CircleIcon color={taxon.color} />
    <span>{taxon.taxonName}, {pluralize('observation', taxon.observations.length)}</span>
  </label><br />
  <a href="{projectPath}/taxa/{taxon.taxonId}">More Info</a>
  <button class="absolute" data-taxon-id={taxon.taxonId} on:click={removeTaxon}>
    <XIcon value={taxon.taxonId} />
  </button>
</div>

<style>
  label {
    margin-right: 15px;
  }
  button {
    top: 0;
    right: 2px;
  }

  a {
    font-weight: 400;
  }
</style>
