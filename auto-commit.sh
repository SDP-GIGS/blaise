#!/bin/bash

while true
do
    git add .
    git commit -m "changes"
    git push
    echo "Committed & pushed at $(date)"
    sleep 10
done