<script>
  export let modalname;
</script>

<input type="checkbox" id={modalname} class="modal-toggle" />
<div class="modal">
  <div class="modal-box p-4 rounded-none overflow-y-auto">
    <div class="mb-2">
      <label for={modalname} class="float-right btn btn-circle btn-sm">
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
    <div class="image"><slot name="popup" /></div>
  </div>
</div>

<style>
  .modal {
    /* set z-index to 1001 to be on top of leaflet z-index of 999 */
    z-index: 1001;
  }
  .modal-box {
    max-height: 90vh;
    max-width: fit-content;
    /* max-width: 90vw; */
    /* margin: 0 auto; */
    /* width: 100%; */
  }

  .image {
    /* max-height: 100vh; */
    /* width: 100%; */
    /* height: 100%; */
  }
</style>
