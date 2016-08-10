'use strict';

const SunCalc = require('suncalc');

var lat = undefined;
var lon = undefined;

if(typeof process.env.lat !== 'undefined') {
  lat = process.env.lat
} else {
  throw "'lat' environmental variable is not set. Set it and restart container";
}

if(typeof process.env.lon !== 'undefined') {
  lon = process.env.lon
} else {
  throw "'lon' environmental variable is not set. Set it and restart container";
}

console.log(`Tracking the Sun state for coordinates ${lat} ${lon}`)

var now = new Date();
console.log(`Current time is ${now}`);

var times = SunCalc.getTimes(now, lat,  lon);

for(var propertyName in times) {
  console.log(propertyName+" is at "+times[propertyName]);
}
