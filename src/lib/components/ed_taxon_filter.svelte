<script>
  export let taxon;
  export let toggleTaxon;
  export let removeTaxon;
</script>

<div class="border p-1 mb-2">
  <input type="checkbox" checked="checked" data-taxon-id={taxon.taxonId} on:click={toggleTaxon} />

  <svg height="20" width="20" class="inline">
    <circle
      cx="10"
      cy="10"
      r="8"
      stroke={taxon.color}
      stroke-width="3"
      fill={taxon.color}
      fill-opacity=".20"
    />
  </svg>
  <button class="float-right" data-taxon-id={taxon.taxonId} on:click={removeTaxon}>
    <svg
      data-taxon-id={taxon.taxonId}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="inline-block w-4 h-4  stroke-current"
    >
      <path
        data-taxon-id={taxon.taxonId}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
  <span class="text-sm">{taxon.taxonName}</span>
</div>
