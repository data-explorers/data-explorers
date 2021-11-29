<script>
  export let observation
</script>
<div>

  <label for="my-modal-{observation.id}" class="">
    <img src={observation.image_url} alt="image of {observation.scientific_name}" />
  </label>
  <input type="checkbox" id="my-modal-{observation.id}" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box p-4 rounded-none">
      <div>
        <b>Observer:</b>
        {observation.user_login},
        <b>Date:</b>
        {#if observation.time_observed_at}
          {new Date(observation.time_observed_at).toLocaleDateString()}
        {:else}
          unknown
        {/if}
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
      </div>
      <img src={observation.image_url} alt="image of {observation.scientific_name}" />
    </div>
  </div>
</div>
