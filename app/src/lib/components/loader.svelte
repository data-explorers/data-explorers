<div class="loader" />

<style>
  .loader {
    border: 12px solid #b9d1e0; /* Light grey */
    border-top: 12px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 2s linear infinite;
    z-index: 1100;
    margin: auto;
    left: 0;
    right: 0;
    top: 20%;
    position: absolute;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
