#!/bin/bash
docker build -t toe .
docker run --rm -ti toe "$@"