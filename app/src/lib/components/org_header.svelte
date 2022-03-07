<script>
  import { base } from '$app/paths';

  export let org;

  let heroImage;
  if (org.image.startsWith('https://picsum')) {
    heroImage = `${org.image}/1600/500`;
  } else {
    heroImage = `${base}/images/${org.username}/${org.image.replace('.jpg', '_hero.jpg')}`;
  }
</script>

<div class="hero" style="background-image: url(&quot;{heroImage}&quot;);">
  <div class="text-neutral-content bg-neutral bg-opacity-50 p-1">
    <h1>{org.card_title}</h1>
  </div>
</div>
