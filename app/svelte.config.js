import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import dsv from '@rollup/plugin-dsv';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    vite: {
      optimizeDeps: {
        include: ['just-throttle', 'dayjs']
      },
      plugins: [dsv()]
    }
  },

  preprocess: [
    preprocess({
      postcss: true
    })
  ]
};

export default config;
