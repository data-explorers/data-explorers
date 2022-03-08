<script context="module">
  import settings from '$lib/data/settings.json';
  import { base } from '$app/paths';

  export async function load({ params }) {
    let org = settings.filter((org) => org.username === params.orgs)[0];
    let project = org.projects.filter((project) => project.slug === params.projects)[0];
    let projectPath = `${base}/orgs/${org.username}/${project.slug}`;

    let res = await import(`../../../../../lib/data/${project.slug}/users.csv`);
    let users = res.default;
    users = users.sort((a, b) => b.observation_count - a.observation_count);

    return { props: { users, projectPath } };
  }
</script>

<script>
  export let users;
  export let projectPath;

  import { pluralize } from '$lib/formatUtils';

  $: usersDisplay = users.slice(0, page * limit);
  $: showLoadMore = page * limit < users.length;

  let page = 1;
  let limit = 50;

  function loadMore() {
    page = page + 1;
    usersDisplay = users.slice(0, page * limit);
  }
</script>

<main class="container mx-auto">
  <div class="prose">
    <h1>{pluralize('Observer', users.length)}</h1>

    <ol>
      {#each usersDisplay as user}
        <li>
          <a href="{projectPath}/users/{user.user_id}">{user.user_login}</a>: {pluralize(
            'observation',
            user.observation_count
          )}
        </li>
      {/each}
    </ol>

    <button class="btn" class:hidden={!showLoadMore} on:click={loadMore}>Load More</button>
  </div>
</main>
