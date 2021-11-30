#!/bin/bash

git pull
sudo cp index.html /var/www/html/index.html
node controller.js