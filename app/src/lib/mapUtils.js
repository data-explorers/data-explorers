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
    InatGrid: {
      url: `https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=${taxonID}`,
      options: {
        attribution: 'Observation data by <a href="https://www.inaturalist.org/">iNaturalist</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    },
    InatPoint: {
      url: `https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png?taxon_id=${taxonID}`,
      options: {
        attribution: 'Observation data by <a href="https://www.inaturalist.org/">iNaturalist</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    },
    InatTaxonRange: {
      url: `https://api.inaturalist.org/v1/taxon_ranges/${taxonID}/{z}/{x}/{y}.png`,
      options: {
        attribution: 'Taxon range by <a href="https://www.inaturalist.org/">iNaturalist</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    },
    OpenStreetMap: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
        minZoom: 0,
        maxZoom: 19
      }
    },
    StamenToner: {
      url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
      options: {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        minZoom: 0,
        maxZoom: 19
      }
    },
    StamenTonerLight: {
      url: 'https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
      options: {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        minZoom: 0,
        maxZoom: 19
      }
    },
    StamenTerrain: {
      url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
      options: {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        minZoom: 0,
        maxZoom: 16
      }
    },
    StamenWatercolor: {
      url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
      options: {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
        minZoom: 0,
        maxZoom: 17
      }
    },

    USGSTopo: {
      url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
      options: {
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
        minZoom: 0,
        maxZoom: 16
      }
    },
    USGSImagery: {
      url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
      options: {
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
        minZoom: 0,
        maxZoom: 16
      }
    },
    OpenTopo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      options: {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        minZoom: 0,
        maxZoom: 17
      }
    },
    GBIFClassic: {
      url: 'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-classic',
      options: {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://www.openmaptiles.org/copyright">OpenMapTiles</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    },
    GBIFLight: {
      url: 'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-light',
      options: {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://www.openmaptiles.org/copyright">OpenMapTiles</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    },
    GBIFGeyser: {
      url: 'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-geyser',
      options: {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://www.openmaptiles.org/copyright">OpenMapTiles</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    },
    GBIFBright: {
      url: 'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=osm-bright',
      options: {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://www.openmaptiles.org/copyright">OpenMapTiles</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    },
    GBIFNatural: {
      url: 'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-natural',
      options: {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://www.openmaptiles.org/copyright">OpenMapTiles</a>.',
        minZoom: 0,
        maxZoom: 21
      }
    }
  };
};

export let defaultColorScheme = {
  colorSchemeMonth: twelveMonths,
  colorSchemeYear: colorsSix,
  defaultColor: blue,
  colorScheme: colorsSixTolBright,
  monthSeasonalMarkers: true
};
