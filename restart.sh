#!/bin/bash

if [ $(docker-compose ps appdaemon | grep -c Up) -gt 0 ]
then
    echo "Up!"
    docker-compose restart
else
    echo "Down"
    docker-compose up -d
fi

docker logs --tail 30 --follow appdaemon
echo http://nuclet:5050
