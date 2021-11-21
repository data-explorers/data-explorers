<script>
  export let user;
</script>

<div class="hero" style="background-image: url(&quot;{user.image}/1600/500&quot;);">
  <div class="hero-overlay bg-opacity-50" />
  <div class="text-center hero-content text-neutral-content">
    <div class="max-w-md">
      <h1 class="mb-5 text-4xl font-bold">{user.card_title}</h1>
      <p class="mb-5">{user.card_summary}</p>
    </div>
  </div>
</div>
