#!/bin/bash

container="ha-dashboard"

if [ $(docker compose ps ${container} | grep -c Up) -gt 0 ]
then
    echo "It's Up, restarting!"
    docker compose restart
else
    echo "It's Down, starting"
    docker compose up -d
fi

docker logs --tail 30 --follow ${container}
