#!/bin/bash

version=acockburn/appdaemon:latest
# version=myappdaemon

docker rm -f appdaemon
docker run --name=appdaemon \
       --detach \
       -p 5050:5050 \
       --volume /home/jamie/ha-dashboard:/conf $debug \
       $version

# --env EXTRA_CMD="-D DEBUG"

docker logs --tail 30 --follow appdaemon &
echo http://nuclet:5050

