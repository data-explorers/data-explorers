<script>
  import { base } from '$app/paths';

  export let user;

  let heroImage;
  if (user.image.startsWith('https://picsum')) {
    heroImage = `${user.image}/1600/500`;
  } else {
    heroImage = `${base}/images/${user.username}/${user.image.replace('.jpg', '_hero.jpg')}`;
  }
</script>

<div class="hero" style="background-image: url(&quot;{heroImage}&quot;);">
  <div class="text-neutral-content bg-neutral bg-opacity-50 p-1">
    <h1>{user.card_title}</h1>
  </div>
</div>
