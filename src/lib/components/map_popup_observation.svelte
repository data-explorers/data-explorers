<script>
  import { Popup } from 'svelte-leafletjs';
  export let observation;
</script>

<Popup>
  {#if observation.image_url}
    <img src={observation.image_url.replace('medium', 'small')} alt="" />
  {/if}
  <b>Date:</b>
  {new Date(observation.time_observed_at).toLocaleDateString()}<br />
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

  <a class="mt-4 block" href="https://www.inaturalist.org/observations/{observation.id}"
    >iNaturalist link</a
  >
</Popup>
