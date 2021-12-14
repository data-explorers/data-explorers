<script>
  import { formatTaxonDisplayName } from '$lib/formatUtils';
  import { Popup } from 'svelte-leafletjs';
  export let observation;
</script>

<Popup>
  {#if observation.image_url}
    <img
      class="mb-2"
      src={observation.image_url.replace('medium', 'small')}
      alt="image of {formatTaxonDisplayName(observation)}"
    />
  {/if}
  {@html formatTaxonDisplayName(observation, true)}<br />
  <b>Date:</b>
  {#if observation.time_observed_at}
    {new Date(observation.time_observed_at).toLocaleDateString()}<br />
  {:else}
    unknown<br />
  {/if}
  <b>Observer:</b>
  {observation.user_login}<br />

  {#if observation.coordinates_obscured}
    <b>Coordinates are obscured:</b>
    {#if observation.geoprivacy === 'obscured'}
      Observer has choosen to obscure the coordinates.
    {/if}
    {#if observation.taxon_geoprivacy === 'obscured'}
      Taxon is threatened or rare so the coordinates are obscured.
    {/if}
    <div />
  {/if}

  <a class="mt-2 block" href="https://www.inaturalist.org/observations/{observation.id}"
    >iNaturalist observation</a
  >
</Popup>
