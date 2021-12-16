<script>
  export let user;
</script>

<div class="hero" style="background-image: url(&quot;/images/{user.username}/user.jpg&quot;);">
  <div class="text-neutral-content bg-black bg-opacity-50 p-1">
    <h1>{user.card_title}</h1>
  </div>
</div>
