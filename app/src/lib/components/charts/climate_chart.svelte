<script>
  import { onMount } from 'svelte';
  import { formatClimateData } from '$lib/charts/chartUtils';

  export let climateChartData;
  export let climateChartOptions;

  const data = {
    table: formatClimateData(climateChartData, climateChartOptions.mapping)
  };
  const max_temp = 'Maximum Temperature (F)';
  const min_temp = 'Minimum Temperature (F)';
  const precip = 'Precipation (inches)';

  // Legend for multi-field data https://stackoverflow.com/a/58732341
  // https://vega.github.io/vega-lite/examples/interactive_multi_line_pivot_tooltip.html

  let spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 500,
    height: 300,
    data: { name: 'table' },
    encoding: {
      x: {
        field: 'Month',
        type: 'nominal',
        sort: null,
        title: null,
        axis: {
          labelAngle: 0,
          labelOverlap: true
        }
      }
    },
    layer: [
      {
        transform: [{ fold: [precip] }],
        encoding: {
          y: {
            field: 'value',
            type: 'quantitative',
            title: 'Precipitation (inches)',
            scale: { domain: [0, 0.4] }
          },
          color: {
            field: 'key',
            type: 'nominal',
            scale: {
              domain: [max_temp, min_temp, precip],
              range: ['#941100', '#1f77b4', '#aec7e8']
            },
            title: null
          }
        },
        layer: [
          { mark: 'bar' },
          { transform: [{ filter: { param: 'hover', empty: false } }], mark: 'point' }
        ]
      },
      {
        transform: [{ fold: [max_temp, min_temp] }],
        encoding: {
          y: {
            field: 'value',
            type: 'quantitative',
            title: 'Temperature (F)'
          },
          color: { field: 'key', type: 'nominal' }
        },
        layer: [
          { mark: 'line' },
          { transform: [{ filter: { param: 'hover', empty: false } }], mark: 'point' }
        ]
      },
      {
        mark: 'rule',
        encoding: {
          opacity: {
            condition: { value: 0.3, param: 'hover', empty: false },
            value: 0
          },
          tooltip: [
            { field: max_temp, type: 'quantitative' },
            { field: min_temp, type: 'quantitative' },
            { field: precip, type: 'quantitative' }
          ]
        },
        params: [
          {
            name: 'hover',
            select: {
              type: 'point',
              fields: ['Month'],
              nearest: true,
              on: 'mouseover',
              clear: 'mouseout'
            }
          }
        ]
      }
    ],
    resolve: { scale: { y: 'independent' } }
  };

  let options = { actions: false };

  let VegaLite;
  onMount(async () => {
    const comp = await import('svelte-vega');
    VegaLite = comp.VegaLite;
  });
</script>

<div class="chart-container">
  <svelte:component this={VegaLite} {data} {spec} {options} />
</div>

<style>
  .chart-container {
    width: 100%;
  }

  :global(.chart-container canvas) {
    width: 100% !important;
    height: 100% !important;
  }
</style>
