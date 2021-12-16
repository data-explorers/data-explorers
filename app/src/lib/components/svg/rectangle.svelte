<script>
  export let color;
  export let value;
</script>

<svg width="20" height="20" class="inline" data-filter={value}>
  <rect
    width="14"
    height="14"
    y="2"
    x="2"
    stroke={color}
    stroke-width="3"
    fill={color}
    fill-opacity=".20"
    data-filter={value}
  />
</svg>
