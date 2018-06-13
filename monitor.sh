#!/bin/sh

cd /home/jamie/had-conf
./restart.sh

while inotifywait -qqre modify "./dashboards/"
do
    echo "Change detected"
    ./restart.sh
done
