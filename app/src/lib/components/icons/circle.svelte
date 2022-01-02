<script>
  export let color;
  export let value;
  export let clickHandler = function () {};
  export let cursorPointer = false;
</script>

<svg
  class:cursor-pointer={cursorPointer}
  on:click|stopPropagation={clickHandler}
  height="20"
  width="20"
  class="inline"
  data-filter={value}
>
  <circle
    cx="10"
    cy="10"
    r="8"
    stroke={color}
    stroke-width="3"
    fill={color}
    fill-opacity=".20"
    data-filter={value}
  />
</svg>
