<script>
  import '../app.css';
</script>

<header>
  <nav class="navbar bg-neutral text-neutral-content">
    <div class="container mx-auto">
      <div class="px-2 mx-2">
        <a class="text-lg font-bold" href="/"> Data Explorers </a>
      </div>
      <div class="px-2 mx-2">
        <a class="" href="/about"> About </a>
      </div>
    </div>
  </nav>
</header>

<slot />

<footer class="mt-8 p-6 footer bg-neutral text-neutral-content">
  <div class="container mx-auto">
    <p>Copyright © 2021</p>
  </div>
</footer>
