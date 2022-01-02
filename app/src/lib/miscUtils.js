export function groupByMap(arrayOfObjects, key) {
  let map = new Map();
  arrayOfObjects.forEach((object) => {
    if (map.get(object[key])) {
      map.get(object[key]).push(object);
    } else {
      map.set(object[key], [object]);
    }
  });
  return map;
}

export function modulo(integer, moduloValue) {
  return ((integer % moduloValue) + moduloValue) % moduloValue;
}

export function range(start, end) {
  if (end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  } else {
    return Array.from({ length: start + 1 }, (_, i) => i);
  }
}

export function getDateRange(startDate, endDate, steps = 1) {
  // return an array of dates between start and end dates
  // https://stackoverflow.com/a/64592438
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }
  return dateArray;
}

function getNumberOfMonthsBetween(dateFrom, dateTo) {
  // https://stackoverflow.com/a/4312956
  let dateObjFrom = new Date(dateFrom);
  let dateObjTo = new Date(dateTo);
  return (
    dateObjFrom.getMonth() -
    dateObjTo.getMonth() +
    12 * (dateObjFrom.getFullYear() - dateObjTo.getFullYear())
  );
}

function getMonthsBetween(dateFrom, dateTo) {
  // https://stackoverflow.com/a/30465299
  var start = dateFrom.split('-');
  var end = dateTo.split('-');
  var startYear = parseInt(start[0]);
  var endYear = parseInt(end[0]);
  var dates = [];

  for (var i = startYear; i <= endYear; i++) {
    var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
    var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
    for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      var month = j + 1;
      var displayMonth = month < 10 ? '0' + month : month;
      dates.push([i, displayMonth, '01'].join('-'));
    }
  }
  return dates;
}

export function lightenDarkenColor(color, percent) {
  // https://stackoverflow.com/a/13532993
  function convert(hexSubstring) {
    var value = parseInt(hexSubstring, 16);
    value = parseInt((value * (100 + percent)) / 100);
    value = value < 255 ? value : 255;
    return value.toString(16).length == 1 ? '0' + value.toString(16) : value.toString(16);
  }

  color = color.replace('#', '');
  var R = convert(color.substring(0, 2));
  var G = convert(color.substring(2, 4));
  var B = convert(color.substring(4, 6));

  return R + G + B;
}
