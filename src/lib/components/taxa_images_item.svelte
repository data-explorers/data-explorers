<script>
  import Modal from '$lib/components/modal.svelte';
  import ModalMagnify from '$lib/components/modal-magnify.svelte';

  export let observation;

  let loadImage = false;
</script>

<div>
  <div class="border border-1">
    <ModalMagnify modalname="my-modal-{observation.id}">
      <img
        on:click={() => (loadImage = true)}
        src={observation.image_url}
        alt="image of {observation.scientific_name}"
      />
    </ModalMagnify>
    <div class="p-4">
      {#if observation.time_observed_at}
        <b>Date:</b> {new Date(observation.time_observed_at).toLocaleDateString()}<br />
      {:else}
        <b>Date:</b> unknown<br />
      {/if}
      <b>Observer:</b>
      {observation.user_login}
    </div>
  </div>

  <Modal modalname="my-modal-{observation.id}">
    <div slot="popup">
      <b>Date:</b>
      {#if observation.time_observed_at}
        {new Date(observation.time_observed_at).toLocaleDateString()},
      {:else}
        unknown,
      {/if}
      <b>Observer:</b>
      {observation.user_login}

      <a class="mt-2 mb-4 block" href="https://www.inaturalist.org/observations/{observation.id}"
        >iNaturalist link</a
      >
      {#if loadImage}
        <img
          src={observation.image_url.replace('medium', 'large')}
          alt="image of {observation.scientific_name}"
        />
      {/if}
    </div>
  </Modal>
</div>
