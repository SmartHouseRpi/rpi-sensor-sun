# rpi-sensor-sun

[![Build Status](http://armbuilder.grechka.family:8081/api/badges/SmartHouseRpi/rpi-sensor-sun/status.svg)](http://armbuilder.grechka.family:8081/SmartHouseRpi/rpi-sensor-sun)

Docker image for RaspberryPI (ARMv7) containing the process that tracks the Sun states (day, dusk, night, etc) for a partcular lacation of the Earth and publishes recent state via Redis

##How to run

docker run -e lat=**55.7** -e lon=**37.6** -e db_key=**sun.state** -d --link redis:YOUR_REDIS_HOST SmartHouseRpi/rpi-sensor-sun

The image requires 3 environmental variables to be set:

 * lat
 * lon
 * db_key

lat, lon - specifies geo point at the Earth surface to calculate day phase for
db_key - a key in redis to store one of the three states: "day","twilight","night"

Container communicates with Redis using "redis" hostname. Map it the redis host in your network.

##Releases

https://hub.docker.com/r/smarthouserpi/rpi-sensor-sun/
