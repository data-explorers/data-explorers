<script>
  import '../app.css';
</script>

<div class="container mx-auto">
  <nav class="navbar shadow-lg bg-neutral text-neutral-content">
    <div class="flex-none px-2 mx-2">
      <a class="text-lg font-bold" href="/"> Data Explorers </a>
    </div>
    <div class="flex-1 px-2 mx-2">
      <div class="items-stretch hidden lg:flex">
        <a class="btn btn-ghost btn-sm rounded-btn" href="/about"> About </a>
      </div>
    </div>
  </nav>

  <main><slot /></main>

  <footer class="mt-8 p-6 footer bg-neutral text-neutral-content">
    <p>Copyright © 2021</p>
  </footer>
</div>
