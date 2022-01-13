<script context="module">
  export async function load({ url }) {
    // print pathParts in footer for debugging
    let pathParts = url.pathname.split('/');
    return { props: { pathParts } };
  }
</script>

<script>
  import '../app.css';
  import { base } from '$app/paths';

  export let pathParts;
</script>

<header>
  <nav class="navbar bg-neutral text-neutral-content">
    <div class="container mx-auto">
      <div class="px-2 mx-2">
        <a class="text-lg font-bold" href="{base}/"> Data Explorers </a>
      </div>
      <div class="px-2 mx-2">
        <a class="" href="{base}/about"> About </a>
      </div>
    </div>
  </nav>
</header>

<slot />

<footer class="mt-8 p-6 footer bg-neutral text-neutral-content">
  <div class="container mx-auto">
    <p>Copyright © 2021</p>
    <p class="text-gray-700">{JSON.stringify(pathParts)}</p>
  </div>
</footer>
