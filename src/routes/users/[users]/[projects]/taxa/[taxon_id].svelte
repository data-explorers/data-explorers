<script context="module">
  import allInteractions from '$lib/data/interactions.json';
  import data from '$lib/data/data.json';

  // range map from inat

  // description from wikipedia

  export async function load({ page }) {
    let taxaData = await import(`../../../../../lib/data/${page.params.projects}/taxa.json`);
    let taxa = taxaData.default;
    let taxon = taxa.filter((taxon) => taxon.taxon_id == page.params.taxon_id)[0];

    let observationData = await import(
      `../../../../../lib/data/${page.params.projects}/observations.json`
    );
    let allObservations = observationData.default;
    let observations = allObservations
      .filter((i) => i.taxon_id == '' + page.params.taxon_id)
      .filter((i) => i.latitude && i.longitude)
      .map((i) => ({
        latitude: i.latitude,
        longitude: i.longitude,
        date: new Date(i.time_observed_at),
        image: i.image_url,
        user: i.user_login
      }));

    let user = data.filter((user) => user.username == page.params.users)[0];
    let project = user.projects.filter((project) => project.slug == page.params.projects)[0];

    let interactions = allInteractions.filter(
      (i) => i.subject_taxon_id == '' + page.params.taxon_id
    );
    let eatsTaxa = interactions.filter((i) => i.interaction == 'eats');
    let eatenByTaxa = interactions.filter((i) => i.interaction == 'eatenBy');
    let pollinatesTaxa = interactions.filter((i) => i.interaction == 'pollinates');
    let pollinatedByTaxa = interactions.filter((i) => i.interaction == 'pollinatedBy');
    let preysOnTaxa = interactions.filter((i) => i.interaction == 'preysOn');
    let preyedUponByTaxa = interactions.filter((i) => i.interaction == 'preyedUponBy');

    return {
      props: {
        taxon,
        eatsTaxa,
        eatenByTaxa,
        pollinatedByTaxa,
        pollinatesTaxa,
        preysOnTaxa,
        preyedUponByTaxa,
        user,
        project,
        observations
      }
    };
  }
</script>

<script>
  import GlobiList from '$lib/components/globi_list.svelte';
  import ProjectHeader from '$lib/components/project_header.svelte';
  import { onMount } from 'svelte';

  export let taxon;
  export let eatsTaxa;
  export let eatenByTaxa;
  export let pollinatesTaxa;
  export let pollinatedByTaxa;
  export let preysOnTaxa;
  export let preyedUponByTaxa;
  export let user;
  export let project;
  export let observations;

  // NOTE: must use dynamic import to load leaflet since leaflet depends on
  // window object. leaflet will not work with server side rendering.
  let Map;
  onMount(async () => {
    const comp = await import('$lib/components/map.svelte');
    Map = comp.default;
  });
</script>

<ProjectHeader {project} {user} />

<h1>{taxon.common_name} <span class="text-2xl text-gray-400">({taxon.scientific_name})</span></h1>

<div class="grid md:grid-cols-2 gap-3">
  <div>
    <img src={taxon.image_url} alt="image of {taxon.scientific_name}" />
  </div>

  <div>
    {observations.length}
    {observations.length == 1 ? 'observation' : 'observations'}
    <svelte:component this={Map} {project} {observations} />
  </div>
</div>

<h3>Description</h3>

<article class="prose">
  <p>
    Cillum enim nisi qui velit reprehenderit ut ipsum quis est consectetur. Labore labore proident
    exercitation veniam cillum. Esse laboris aliquip commodo incididunt qui qui quis labore id
    voluptate. Qui velit deserunt minim qui labore nostrud. Et Lorem exercitation cillum eu do esse.
    Anim ut do in occaecat.
  </p>
  <p>
    Adipisicing aliquip culpa cupidatat nulla cupidatat exercitation exercitation exercitation culpa
    Lorem magna enim sunt ad. Officia ex veniam dolore incididunt enim dolor. Deserunt magna elit
    voluptate duis ex mollit deserunt duis cupidatat tempor sint. Velit ea ipsum est exercitation
    excepteur laboris id.
  </p>
</article>
<h3>Habitat</h3>

<p>
  Adipisicing aliquip culpa cupidatat nulla cupidatat exercitation exercitation exercitation culpa
  Lorem magna enim sunt ad. Officia ex veniam dolore incididunt enim dolor. Deserunt magna elit
  voluptate duis ex mollit deserunt duis cupidatat tempor sint. Velit ea ipsum est exercitation
  excepteur laboris id.
</p>

<h3>Related Species</h3>

<p>
  Related species data comes from <a href="https://www.globalbioticinteractions.org/">GloBI</a>.
</p>

<GlobiList interactionTaxa={eatsTaxa} title="Eats" />
<GlobiList interactionTaxa={eatenByTaxa} title="Eaten by" />
<GlobiList interactionTaxa={pollinatesTaxa} title="Pollinates" />
<GlobiList interactionTaxa={pollinatedByTaxa} title="Pollinated by" />
<GlobiList interactionTaxa={preysOnTaxa} title="Preys on" />
<GlobiList interactionTaxa={preyedUponByTaxa} title="Preyed upon by" />
