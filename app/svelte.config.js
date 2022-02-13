import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import dsv from '@rollup/plugin-dsv';
import { string } from 'rollup-plugin-string';

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
        dsv(),
        string({
          include: ['**/*.md']
        })
      ]
    }
  },
  preprocess: [preprocess({})]
};

export default config;
