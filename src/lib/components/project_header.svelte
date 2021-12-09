<script>
  export let project;
  export let user;
  import { page } from '$app/stores';

  let tabs = project.tabs_project.map((tab) => {
    return {
      label: tab.label,
      value: tab.value,
      slug: `/users/${user.username}/${project.slug}/${tab.link}`,
      link: tab.link.length > 0 ? tab.link : project.slug
    };
  });
</script>

<div class="hero" style="background-image: url(&quot;{project.image}/1600/500&quot;);">
  <div class="text-neutral-content bg-black bg-opacity-50 p-1">
    <h1>{project.title}</h1>
  </div>
</div>

<div class="tabs mt-4">
  {#each tabs as tab}
    <a
      class="tab tab-bordered"
      class:tab-active={$page.path.split('/')[$page.path.split('/').length - 1] === tab.link}
      href={tab.slug}>{tab.label}</a
    >
  {/each}
</div>
