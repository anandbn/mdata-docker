#!/bin/sh

if [ $1 == "up" ];
then
    cd app
    npm clean-install
    cd ..
fi
docker-compose $@