'use strict';

const SunCalc = require('suncalc');
const Redis = require('node-redis')

var lat = undefined;
var lon = undefined;
var db_key = undefined;

if(typeof process.env.lat !== 'undefined') {
  lat = process.env.lat;
} else {
  throw "'lat' environmental variable is not set. Set it and restart container";
}

if(typeof process.env.lon !== 'undefined') {
  lon = process.env.lon;
} else {
  throw "'lon' environmental variable is not set. Set it and restart container";
}

if(typeof process.env.db_key !== 'undefined') {
  db_key = process.env.db_key;
} else {
  throw "'db_key'(redis key for publishing sun state) environmental variable is not set. Set it and restart container";
}


console.log(`Tracking the Sun state for coordinates ${lat} ${lon}`);

var preciseState="unknown";
var state="unknown";

var preciseToNormal = {
  "sunrise" : "twilight",
  "sunriseEnd": "day",
  "goldenHourEnd": "day",
  "solarNoon": "day",
  "goldenHour": "twilight",
  "sunsetStart": "twilight",
  "sunset": "twilight",
  "dusk": "night",
  "nauticalDusk": "night",
  "night": "night",
  "nadir": "night",
  "nightEnd": "night",
  "nauticalDawn": "night",
  "dawn": "twilight"
};

function Tick() {
  var now = new Date();
//  console.log(`Current time is ${now}`);
  var times = SunCalc.getTimes(now, lat,  lon);
  var currentPrecState = "unknown";
  var currentDiff = Infinity;
  var currentPrecStateTime = undefined;
  for(var propertyName in times) { //finding current precise state
    var diff = now - times[propertyName];
    if(diff > 0 && diff <= currentDiff) {
      currentPrecState = propertyName;
      currentDiff = diff;
      currentPrecStateTime = times[propertyName];
    }
  }
  if(currentPrecState == "unknown") {
    //all the computed events are in the future. discarding until reaching one of the events
    return;
  }
  if(preciseState !== currentPrecState) {
    console.log(`new precise state: ${currentPrecState}`);
    preciseState = currentPrecState;
  }
  var currentState = preciseToNormal[currentPrecState];
  if(state !== currentState) {
    console.log(`new state: ${currentState}`);

    var pub = Redis.createClient(6379, "redis");
    pub.set(db_key, currentState,function(error) {
      if(!error) {
        console.log("saved new state in the database");
        pub.publish(`${db_key}.subscription`, currentState,function (error){
        if(!error) {
          console.log("changed state notification sent");
          state = currentState;
        }
        else
          console.warn("error sending notification: "+error);
        });
      }
      else
        console.warn("error saving statee: "+error);
      });
    pub.quit();
  }
}

Tick();
setInterval(Tick, 30000);
