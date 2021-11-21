<script>
  import data from '$lib/data/data.json';
  for (let index = 0; index < data.length; index++) {
    const user_data = data[index];
    if (user_data.projects.length == 1) {
      user_data.card_link = `/users/${user_data.username}/${user_data.projects[0].slug}`;
    } else {
      user_data.card_link = `/users/${user_data.username}`;
    }
  }
</script>

<h1 class="text-4xl text-center m-8 font-extrabold">Projects</h1>

<div class="grid lg:grid-cols-3 md:grid-cols-2  justify-center gap-3">
  {#each data as user_data}
    <div class="card bordered">
      <figure>
        <img src="{user_data.image}/400/250" alt="Photo for {user_data.card_title}" />
      </figure>
      <a href={user_data.card_link}>
        <div class="card-body prose prose-lg">
          <h2 class="card-title">{user_data.card_title}</h2>
          <p>{user_data.card_summary}</p>
        </div>
      </a>
    </div>
  {/each}
</div>
