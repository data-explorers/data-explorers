<script>
  export let observation;
</script>

<div>
  <label for="my-modal-{observation.id}" class="">
    <img src={observation.image_url} alt="image of {observation.scientific_name}" />
  </label>
  {#if observation.time_observed_at}
    <b>Date:</b> {new Date(observation.time_observed_at).toLocaleDateString()}<br />
  {:else}
    <b>Date:</b> unknown<br />
  {/if}
  <b>Observer:</b>
  {observation.user_login}
  <input type="checkbox" id="my-modal-{observation.id}" class="modal-toggle" />

  <div class="modal">
    <div class="modal-box p-4 rounded-none overflow-y-auto">
      <div class="mb-2">
        <b>Date:</b>
        {#if observation.time_observed_at}
          {new Date(observation.time_observed_at).toLocaleDateString()},
        {:else}
          unknown,
        {/if}
        <b>Observer:</b>
        {observation.user_login}

        <label for="my-modal-{observation.id}" class="float-right btn btn-circle btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-4 h-4 stroke-current md:w-6 md:h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
        <a class="mt-2 block" href="https://www.inaturalist.org/observations/{observation.id}"
          >iNaturalist link</a
        >
      </div>
      <img src={observation.image_url} alt="image of {observation.scientific_name}" />
    </div>
  </div>
</div>

<style>
  .modal {
    /* set z-index to 1000 to be on top of leaflet z-index of 999 */
    z-index: 1000;
  }
  .modal-box {
    max-height: 95vh;
  }
  .modal-box img {
    max-height: 80vh;
  }
</style>
