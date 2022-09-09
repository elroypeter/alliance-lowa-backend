#!/bin/sh
exec docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
exec docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build