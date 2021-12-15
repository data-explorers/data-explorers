// https://personal.sron.nl/~pault/#sec:qualitative
export let colorsSixTolBright = ['#4477aa', '#66ccee', '#228833', '#ccbb44', '#ee6677', '#aa3377'];
export let colorsSixTolVibrant = ['#0077bb', '#33bbee', '#009988', '#ee7733', '#cc3311', '#ee3377'];

// sequential: orange - red
export let colorsSix = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'];

export let sixMonths = ['#fc4e2a', '#e31a1c', '#b10026', '#fed976', '#feb24c', '#fd8d3c'];
export let twelveMonths = sixMonths.concat(sixMonths);

export let colorsEightDivergeGroup = [
  // brown - green
  ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e'],
  // magenta - green
  ['#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221'],
  // purple - green
  ['#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837'],
  // orange - purple
  ['#b35806', '#e08214', '#fdb863', '#fee0b6', '#d8daeb', '#b2abd2', '#8073ac', '#542788'],
  // red - blue
  ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
  // bright red - bright blue
  ['#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4']
];
export let colorsEightDiverge = colorsEightDivergeGroup[0];

let colorsSixBlueSingleHue = ['#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'];
let colorsSixRedSingleHue = ['#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'];
export let colorsTwelveDiverge = [...colorsSixBlueSingleHue]
  .reverse()
  .concat(colorsSixRedSingleHue);

export let colorsSixDivergeGroup = [
  // brown - green
  ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e'],
  // magenta - green
  ['#c51b7d', '#e9a3c9', '#fde0ef', '#e6f5d0', '#a1d76a', '#4d9221'],
  // purple - green
  ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
  // orange - purple
  ['#b35806', '#f1a340', '#fee0b6', '#d8daeb', '#998ec3', '#542788'],
  // red - blue
  ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
  // bright red - bright blue
  ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4']
];
export let colorsSixDiverge = colorsSixDivergeGroup[0];

let colorsFiveSingleHue = [
  ['#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
  ['#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'],
  ['#d9d9d9', '#bdbdbd', '#969696', '#636363', '#252525'],
  ['#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'],
  ['#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'],
  ['#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15']
];

export let colorsFourDivergeGroup = [
  // brown - green
  ['#a6611a', '#dfc27d', '#80cdc1', '#018571'],
  // magenta - green
  ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
  // purple - green
  ['#7b3294', '#c2a5cf', '#a6dba0', '#008837'],
  // orange - purple
  ['#e66101', '#fdb863', '#b2abd2', '#5e3c99'],
  // red - blue
  ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
  // bright red - bright blue
  ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6']
];
export let colorsFourDiverge = colorsFourDivergeGroup[0];

export let coldMonths = [10, 11, 12, 1, 2, 3];
export let warmMonths = [4, 5, 6, 7, 8, 9];

export let blue = '#3388ff';
export let darkGray = '#525252';

export function getMonthName(month) {
  // https://reactgo.com/convert-month-number-to-name-js/
  if (/^[0-9]+$/.test(month)) {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString('default', { month: 'short' });
  } else {
    return month;
  }
}

export function radiusZoom(zoomLevel) {
  return 800000 / 2 ** zoomLevel;
}

export function rectangleLatitudeZoom(zoomLevel) {
  return 7 / 2 ** zoomLevel;
}

export function rectangleLongitudeZoom(zoomLevel) {
  return 10 / 2 ** zoomLevel;
}

export const getMapTiles = (taxonID) => {
  return {
    inatGrid: {
      url: `https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=${taxonID}`,
      attribution: ''
    },
    inatTaxonRange: {
      url: `https://api.inaturalist.org/v1/taxon_ranges/${taxonID}/{z}/{x}/{y}.png`,
      attribution: ''
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    cartoVoyager: {
      url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    cartoDark: {
      url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    cartoLight: {
      url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  };
};

// https://forum.inaturalist.org/t/in-pursuit-of-mappiness-part-1/21864
// export const tileUrl = 'https://api.inaturalist.org/v1/taxon_ranges/42069/{z}/{x}/{y}.png'
// export const tileUrl = 'https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=42069'

export const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let attribution = '© OpenStreetMap contributors';

// export const tileUrl = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
// export const tileUrl = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
// export const tileUrl = 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
// let attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'

export const tileLayerOptions = {
  minZoom: 0,
  maxZoom: 20,
  maxNativeZoom: 19,
  attribution: attribution
};

export let defaultColorScheme = {
  colorSchemeMonth: twelveMonths,
  colorSchemeYear: colorsSix,
  defaultColor: blue,
  colorScheme: colorsSixTolBright,
  monthSeasonalMarkers: true
};
