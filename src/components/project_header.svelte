<script>
  export let project;
  export let user;

  let tabs = project.tabs.map((tab, index) => {
    return {
      label: tab.label,
      value: index,
      slug: `/users/${user.username}/${project.slug}/${tab.link}`
    };
  });
</script>

<div class="hero" style="background-image: url(&quot;{project.image}/1600/500&quot;);">
  <div class="hero-overlay bg-opacity-50" />
  <div class="text-center hero-content text-neutral-content">
    <div class="max-w-md">
      <h1>{project.title}</h1>
      <p class="mb-5">{project.summary}</p>
    </div>
  </div>
</div>

<div class="tabs">
  {#each tabs as tab}
    <a class="tab tab-bordered" href={tab.slug}>{tab.label}</a>
  {/each}
</div>
