#!/bin/bash

container="ha-dashboard"

if [ $(docker-compose ps ${container} | grep -c Up) -gt 0 ]
then
    echo "Up!"
    docker-compose restart
else
    echo "Down"
    docker-compose up -d
fi

docker logs --tail 30 --follow ${container}
echo http://$(hostname):5050
