<script context="module">
  import projects from '$lib/data/projects.json';

  export async function load({ page }) {
    let project = projects.filter((p) => p.slug == page.params.slug)[0];
    return { props: { project } };
  }
</script>

<script>
  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, Marker, TileLayer } from 'svelte-leafletjs';
  import AboutProject from '../../components/about_project.svelte';
  import ExploreData from '../../components/explore_data.svelte';
  import TaxaGrid from '../../components/taxa_grid.svelte';
  import Tabs from '../../components/tabs.svelte';

  export let project;

  const mapOptions = {
    center: [project.latitude, project.longitude],
    zoom: project.zoom
  };
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: '© OpenStreetMap contributors'
  const components = {
    AboutProject,
    ExploreData,
    TaxaGrid
  };

  let leafletMap;
  let tabs = project.tabs.map((tab, index) => {
    return {
      label: tab.label,
      value: index,
      component: components[tab.component]
    };
  });
</script>

<div class="card lg:card-side bordered">
  <figure>
    <img src="{project.image}/400/400" />
  </figure>
  <div class="card-body prose">
    <h1>{project.title}</h1>
    <p>{project.summary}</p>
    <dl>
      <dt class="font-bold">Location</dt>
      <dd>{project.location}</dd>
      <dt class="font-bold">Start Date</dt>
      <dd>{project.start_date}</dd>
      <dt class="font-bold">Audience</dt>
      <dd>{project.target_audience}</dd>
    </dl>
  </div>
</div>

<main class="prose">
  <div>{@html project.description}</div>
</main>

<div class="example">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    <Marker latLng={[project.latitude, project.longitude]} />
  </LeafletMap>
</div>

<style>
  .example {
    height: 60vw;
    width: 100%
  }
</style>
<Tabs {tabs} {project} />
