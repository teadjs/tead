#!/bin/bash
docker build -t tead .
docker run --rm -ti tead "$@"