export function modulo(integer, moduloValue) {
  return ((integer % moduloValue) + moduloValue) % moduloValue;
}

export function setMapOption(options, key, value) {
  if (!options[key]) {
    options[key] = value;
  }
}

export let colorsSix = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'];
export let colorsTwelve = colorsSix.concat(colorsSix);

let colorsTens = [
  ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e'],
  ['#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221'],
  ['#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837'],
  ['#b35806', '#e08214', '#fdb863', '#fee0b6', '#d8daeb', '#b2abd2', '#8073ac', '#542788'],
  ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
  ['#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4']
];
export let colorsTen = colorsTens[5];

export let coldMonths = [10, 11, 12, 1, 2, 3];
export let warmMonths = [4, 5, 6, 7, 8, 9];

export function getMonthName(month) {
  // https://reactgo.com/convert-month-number-to-name-js/
  const d = new Date();
  d.setMonth(month);
  return d.toLocaleString('default', { month: 'short' });
}

export function radiusZoom(zoomLevel) {
  return 1000000 / 2 ** zoomLevel;
}

export function rectangleLatitudeZoom(zoomLevel) {
  return 9 / 2 ** zoomLevel;
}

export function rectangleLongitudeZoom(zoomLevel) {
  return 12 / 2 ** zoomLevel;
}
