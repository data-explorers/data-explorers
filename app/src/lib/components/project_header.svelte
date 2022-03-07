<script>
  export let project;
  export let org;
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let tabs = project.tabs_project.map((tab) => {
    return {
      label: tab.label,
      value: tab.value,
      slug: `${base}/orgs/${org.username}/${project.slug}/${tab.link}`,
      link: tab.link.length > 0 ? tab.link : project.slug
    };
  });

  let heroImage;
  if (project.image.startsWith('https://picsum')) {
    heroImage = `${project.image}/1600/500`;
  } else {
    heroImage = `${base}/images/${org.username}/${project.image.replace('.jpg', '_hero.jpg')}`;
  }
</script>

<div class="hero" style="background-image: url(&quot;{heroImage}&quot;);">
  <div class="container mx-auto">
    <div class="text-neutral-content bg-neutral bg-opacity-50 p-1 inline-block">
      <h1>{project.title}</h1>
    </div>
  </div>
</div>

<div class="container mx-auto">
  <div class="tabs mt-4">
    {#each tabs as tab}
      <a
        class="tab tab-bordered"
        class:tab-active={$page.url.pathname.split('/')[
          $page.url.pathname.split('/').length - 1
        ] === tab.link}
        href={tab.slug}>{tab.label}</a
      >
    {/each}
    <a class="hidden" href="{base}/orgs/{org.username}/{project.slug}/taxa-list">list</a>
  </div>
</div>
