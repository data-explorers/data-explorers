<script>
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';

  for (let index = 0; index < settings.length; index++) {
    const user_data = settings[index];
    if (user_data.projects.length === 1) {
      user_data.card_link = `${base}/users/${user_data.username}/${user_data.projects[0].slug}`;
    } else {
      user_data.card_link = `${base}/users/${user_data.username}`;
    }
  }
</script>

<main class="container mx-auto">
  <div class="prose max-w-none">
    <h1>Projects</h1>

    <div class="grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-3">
      {#each settings as user_data}
        <div class="image-card">
          <a href={user_data.card_link}>
            <figure>
              <img
                src="{base}/images/{user_data.username}/user.jpg"
                alt="Photo for {user_data.card_title}"
              />
            </figure>
          </a>

          <div class="image-card-body">
            <a href={user_data.card_link}>
              <h2>{user_data.card_title}</h2>
              <p>{user_data.card_summary}</p>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>
