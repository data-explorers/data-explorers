<script>
  let colors = ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'];
  let saturations = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  let colorNames = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < saturations.length; j++) {
      colorNames.push(
        `<div class="bg-${colors[i]}-${saturations[j]}">bg-${colors[i]}-${saturations[j]}</div>`
      );
    }
  }
</script>

<div>
  <select
    data-choose-theme
    class="pr-9 select select-bordered select-primary bg-base-100 select-xs text-base-content"
  >
    <option disabled="disabled" selected="selected">Choose a theme</option>
    <option value="aqua">Aqua</option>
    <option value="black">Black</option>
    <option value="bumblebee">Bumblebee</option>
    <option value="corporate">Corporate</option>
    <option value="cupcake">Cupcake</option>
    <option value="cyberpunk">Cyberpunk</option>
    <option value="dark">Dark</option>
    <option value="dracula">Dracula</option>
    <option value="emerald">Emerald</option>
    <option value="fantasy">Fantasy</option>
    <option value="forest">Forest</option>
    <option value="garden">Garden</option>
    <option value="halloween">Halloween</option>
    <option value="light">Light</option>
    <option value="lofi">Lofi</option>
    <option value="luxury">Luxury</option>
    <option value="pastel">Pastel</option>
    <option value="retro">Retro</option>
    <option value="synthwave">Synthwave</option>
    <option value="valentine">Valentine</option>
    <option value="wireframe">Wireframe</option>
  </select>
</div>

<div>
  <h1>tailwind base typograhy</h1>

  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>

  <a href="./">link text</a><br />

  <p>
    Sit ipsum aliquip cupidatat excepteur laborum esse. Sit consectetur sunt amet et laborum
    voluptate duis eu fugiat esse duis proident veniam mollit. Nulla voluptate elit dolore laborum
    nulla elit adipisicing qui reprehenderit aute. Ad cillum laboris esse elit enim pariatur esse
    enim pariatur ut quis adipisicing do. Officia velit id voluptate in duis ea a
  </p>
  <p>
    Sit ipsum aliquip cupidatat excepteur laborum esse. Sit consectetur sunt amet et laborum
    voluptate duis eu fugiat esse duis proident veniam mollit. Nulla voluptate elit dolore laborum
    nulla elit adipisicing qui reprehenderit aute. Ad cillum laboris esse elit enim pariatur esse
    enim pariatur ut quis adipisicing do. Officia velit id voluptate in duis ea adipisicing est
    velit. Labore nostrud do adipisicing laborum magna anim.
  </p>

  <ol>
    <li>order list item</li>
    <li>order list item</li>
    <li>order list item</li>
  </ol>

  <ul>
    <li>unorder list item</li>
    <li>unorder list item</li>
    <li>unorder list item</li>
  </ul>
</div>

<hr />

<div class="prose">
  <h1>typograhy with "prose"</h1>

  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>

  <a href="./">link text</a><br />

  <p>
    Sit ipsum aliquip cupidatat excepteur laborum esse. Sit consectetur sunt amet et laborum
    voluptate duis eu fugiat esse duis proident veniam mollit. Nulla voluptate elit dolore laborum
    nulla elit adipisicing qui reprehenderit aute. Ad cillum laboris esse elit enim pariatur esse
    enim pariatur ut quis adipisicing do. Officia velit id voluptate in duis ea a
  </p>
  <p>
    Sit ipsum aliquip cupidatat excepteur laborum esse. Sit consectetur sunt amet et laborum
    voluptate duis eu fugiat esse duis proident veniam mollit. Nulla voluptate elit dolore laborum
    nulla elit adipisicing qui reprehenderit aute. Ad cillum laboris esse elit enim pariatur esse
    enim pariatur ut quis adipisicing do. Officia velit id voluptate in duis ea adipisicing est
    velit. Labore nostrud do adipisicing laborum magna anim.
  </p>

  <ol>
    <li>order list item</li>
    <li>order list item</li>
    <li>order list item</li>
  </ol>

  <ul>
    <li>unorder list item</li>
    <li>unorder list item</li>
    <li>unorder list item</li>
  </ul>
</div>

<hr />

<h2>colors</h2>

<div class="btn btn-primary">btn-primary</div>
<div class="btn btn-secondary">btn-secondary</div>
<div class="btn btn-accent">btn-accent</div>
<div class="btn btn-neutral">btn-neutral</div>
<div class="btn btn-base">btn-base</div>
<br /><br />

<div class="btn btn-info">btn-info</div>
<div class="btn btn-success">btn-success</div>
<div class="btn btn-warning">btn-warning</div>
<div class="btn btn-error">btn-error</div>
<br /><br />

<div class="bg-base">bg-base</div>
<div class="bg-base-100">bg-base-100</div>
<div class="bg-base-200">bg-base-200</div>
<div class="bg-base-300">bg-base-300</div>
<div class="bg-base-400">bg-base-400</div>
<div class="bg-base-500">bg-base-500</div>
<div class="bg-base-600">bg-base-600</div>
<div class="bg-base-700">bg-base-700</div>
<div class="bg-base-800">bg-base-800</div>
<div class="bg-base-900">bg-base-900</div>

<div class="bg-primary-content">bg-primary-content</div>
<div class="bg-secondary-content">bg-secondary-content</div>
<div class="bg-accent-content">bg-accent-content</div>
<div class="bg-neutral-content">bg-neutral-content</div>
<div class="bg-base-content">bg-base-content</div>

<div class="bg-black">bg-black</div>
<div class="bg-white">bg-white</div>
<div class="bg-gray-50">bg-gray-50</div>
{#each colorNames as color}
  <!-- {color}<br> -->
{/each}

<div class="bg-gray-50">bg-gray-50</div>
<div class="bg-gray-100">bg-gray-100</div>
<div class="bg-gray-200">bg-gray-200</div>
<div class="bg-gray-300">bg-gray-300</div>
<div class="bg-gray-400">bg-gray-400</div>
<div class="bg-gray-500">bg-gray-500</div>
<div class="bg-gray-600">bg-gray-600</div>
<div class="bg-gray-700">bg-gray-700</div>
<div class="bg-gray-800">bg-gray-800</div>
<div class="bg-gray-900">bg-gray-900</div>
<div class="bg-red-50">bg-red-50</div>
<div class="bg-red-100">bg-red-100</div>
<div class="bg-red-200">bg-red-200</div>
<div class="bg-red-300">bg-red-300</div>
<div class="bg-red-400">bg-red-400</div>
<div class="bg-red-500">bg-red-500</div>
<div class="bg-red-600">bg-red-600</div>
<div class="bg-red-700">bg-red-700</div>
<div class="bg-red-800">bg-red-800</div>
<div class="bg-red-900">bg-red-900</div>
<div class="bg-yellow-50">bg-yellow-50</div>
<div class="bg-yellow-100">bg-yellow-100</div>
<div class="bg-yellow-200">bg-yellow-200</div>
<div class="bg-yellow-300">bg-yellow-300</div>
<div class="bg-yellow-400">bg-yellow-400</div>
<div class="bg-yellow-500">bg-yellow-500</div>
<div class="bg-yellow-600">bg-yellow-600</div>
<div class="bg-yellow-700">bg-yellow-700</div>
<div class="bg-yellow-800">bg-yellow-800</div>
<div class="bg-yellow-900">bg-yellow-900</div>
<div class="bg-green-50">bg-green-50</div>
<div class="bg-green-100">bg-green-100</div>
<div class="bg-green-200">bg-green-200</div>
<div class="bg-green-300">bg-green-300</div>
<div class="bg-green-400">bg-green-400</div>
<div class="bg-green-500">bg-green-500</div>
<div class="bg-green-600">bg-green-600</div>
<div class="bg-green-700">bg-green-700</div>
<div class="bg-green-800">bg-green-800</div>
<div class="bg-green-900">bg-green-900</div>
<div class="bg-blue-50">bg-blue-50</div>
<div class="bg-blue-100">bg-blue-100</div>
<div class="bg-blue-200">bg-blue-200</div>
<div class="bg-blue-300">bg-blue-300</div>
<div class="bg-blue-400">bg-blue-400</div>
<div class="bg-blue-500">bg-blue-500</div>
<div class="bg-blue-600">bg-blue-600</div>
<div class="bg-blue-700">bg-blue-700</div>
<div class="bg-blue-800">bg-blue-800</div>
<div class="bg-blue-900">bg-blue-900</div>
<div class="bg-indigo-50">bg-indigo-50</div>
<div class="bg-indigo-100">bg-indigo-100</div>
<div class="bg-indigo-200">bg-indigo-200</div>
<div class="bg-indigo-300">bg-indigo-300</div>
<div class="bg-indigo-400">bg-indigo-400</div>
<div class="bg-indigo-500">bg-indigo-500</div>
<div class="bg-indigo-600">bg-indigo-600</div>
<div class="bg-indigo-700">bg-indigo-700</div>
<div class="bg-indigo-800">bg-indigo-800</div>
<div class="bg-indigo-900">bg-indigo-900</div>
<div class="bg-purple-50">bg-purple-50</div>
<div class="bg-purple-100">bg-purple-100</div>
<div class="bg-purple-200">bg-purple-200</div>
<div class="bg-purple-300">bg-purple-300</div>
<div class="bg-purple-400">bg-purple-400</div>
<div class="bg-purple-500">bg-purple-500</div>
<div class="bg-purple-600">bg-purple-600</div>
<div class="bg-purple-700">bg-purple-700</div>
<div class="bg-purple-800">bg-purple-800</div>
<div class="bg-purple-900">bg-purple-900</div>
<div class="bg-pink-50">bg-pink-50</div>
<div class="bg-pink-100">bg-pink-100</div>
<div class="bg-pink-200">bg-pink-200</div>
<div class="bg-pink-300">bg-pink-300</div>
<div class="bg-pink-400">bg-pink-400</div>
<div class="bg-pink-500">bg-pink-500</div>
<div class="bg-pink-600">bg-pink-600</div>
<div class="bg-pink-700">bg-pink-700</div>
<div class="bg-pink-800">bg-pink-800</div>
<div class="bg-pink-900">bg-pink-900</div>

<div class="border-gray-50 border-2 border-opacity-100 border">border-gray-50</div>
<div class="border-gray-100 border-2 border-opacity-100 border">border-gray-100</div>
<div class="border-gray-200 border-2 border-opacity-100 border">border-gray-200</div>
<div class="border-gray-300 border-2 border-opacity-100 border">border-gray-300</div>
<div class="border-gray-400 border-2 border-opacity-100 border">border-gray-400</div>
<div class="border-gray-500 border-2 border-opacity-100 border">border-gray-500</div>
<div class="border-gray-600 border-2 border-opacity-100 border">border-gray-600</div>
<div class="border-gray-700 border-2 border-opacity-100 border">border-gray-700</div>
<div class="border-gray-800 border-2 border-opacity-100 border">border-gray-800</div>
<div class="border-gray-900 border-2 border-opacity-100 border">border-gray-900</div>

bumblebee, corporate, emerald, fantasy, light
