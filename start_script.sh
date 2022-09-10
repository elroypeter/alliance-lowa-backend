#!/bin/sh
# stop all running containers
docker-compose -f docker-compose.prod.yml down
# run containers in detached mode
docker-compose -f docker-compose.prod.yml up -d --build