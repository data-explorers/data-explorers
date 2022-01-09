<script>
  import { EasyButton } from '$lib/vendor/svelte-leaflet';
  import { createEventDispatcher } from 'svelte';

  export let useMarkerCluster;
  export let observationsOnMapCount;
  export let clusterLimit;
  export let userSelectedMarkerType;
  export let coordinates;
  export let zoomLevel;
  export let maxZoom;

  const dispatch = createEventDispatcher();
  let toggleMarkerModeButton;
  let toggleMarkerTypeStates = {
    states: [
      {
        stateName: 'show-markers',
        icon: '<span class="text-4xl font-black leading-5">&Colon;</span>',
        title: 'click to show clustered markers',
        onClick: function (control) {
          dispatch('changeMarkerModeOnClick', {
            useMarkerCluster: true,
            userSelectedMarkerType: 'clusters'
          });
          control.state('show-clusters');
        }
      },
      {
        stateName: 'show-clusters',
        icon: '<span class="text-6xl leading-6">&middot;</span>',
        title: 'click to show individual markers',
        onClick: function (control) {
          dispatch('changeMarkerModeOnClick', {
            useMarkerCluster: false,
            userSelectedMarkerType: 'markers'
          });
          control.state('show-markers');
        }
      }
    ]
  };

  // automatically toggle clusters/markers for max zoom of map
  $: if (zoomLevel && maxZoom) {
    // switch to individual markers
    if (useMarkerCluster && zoomLevel + 1 >= maxZoom) {
      toggleMarkerModeButton.getButton().state('show-markers');
      dispatch('changeMarkerModeAutomatic', {
        useMarkerCluster: false
      });
      // switch to clusters
    } else if (
      !useMarkerCluster &&
      userSelectedMarkerType === 'clusters' &&
      zoomLevel === maxZoom - 2
    ) {
      toggleMarkerModeButton.getButton().state('show-clusters');
      dispatch('changeMarkerModeAutomatic', {
        useMarkerCluster: true
      });
    }
  }

  // automatically toggle clusters/markers if there are many observations
  $: if (observationsOnMapCount > 0) {
    // switch to clusters
    if (!useMarkerCluster && observationsOnMapCount >= clusterLimit) {
      toggleMarkerModeButton.getButton().state('show-clusters');
      dispatch('changeMarkerModeAutomatic', {
        useMarkerCluster: true
      });
      // switch to individual markers
    } else if (
      useMarkerCluster &&
      userSelectedMarkerType === 'markers' &&
      observationsOnMapCount < clusterLimit
    ) {
      toggleMarkerModeButton.getButton().state('show-markers');
      dispatch('changeMarkerModeAutomatic', {
        useMarkerCluster: false
      });
    }
  }

  $: if (toggleMarkerModeButton) {
    if (coordinates.length === 0) {
      toggleMarkerModeButton.getButton().disable();
    } else if (observationsOnMapCount > clusterLimit) {
      toggleMarkerModeButton.getButton().disable();
    } else {
      toggleMarkerModeButton.getButton().enable();
    }
  }

  export function getButton() {
    return toggleMarkerModeButton.getButton();
  }
</script>

<EasyButton bind:this={toggleMarkerModeButton} states={toggleMarkerTypeStates} />
