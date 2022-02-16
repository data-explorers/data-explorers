import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import dsv from '@rollup/plugin-dsv';
import { string } from 'rollup-plugin-string';
import geojson from 'rollup-plugin-geojson';
import json from "@rollup/plugin-json"

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapter(),
    paths: {
      // /inaturalist_data_explorer
      base: dev ? '' : '/inaturalist_data_explorer'
    },
    vite: {
      plugins: [
        geojson(),
        json(),
        dsv(),
        string({
          include: ['**/*.md']
        })
      ],
      optimizeDeps: {
        include: [
          "fast-deep-equal",
          "clone",
          "semver",
          "json-stringify-pretty-compact",
          "fast-json-stable-stringify",
        ],
      },
    }
  },
  preprocess: [preprocess({})]
};

export default config;
