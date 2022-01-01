<script>
  import { EasyButton } from '$lib/vendor/svelte-leaflet';
  import { fitPointsInMap } from '$lib/mapUtils';

  export let coordinates;
  export let map;

  let fitBoundsButton;

  $: if (fitBoundsButton) {
    if (coordinates.length === 0) {
      fitBoundsButton.getButton().disable();
    } else {
      fitBoundsButton.getButton().enable();
    }
  }
</script>

<EasyButton
  bind:this={fitBoundsButton}
  icon={'<span class="text-3xl leading-6">&sdotb;</span>'}
  callback={() => fitPointsInMap(coordinates, map)}
  title="click to fit all observations on map"
/>
