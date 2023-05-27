#!/bin/bash

sudo apt-get install python-is-python2`

curl -sSL https://get.docker.com | sh

cd gpio_controller

sudo docker build -t pitank_gpio  .

cd ../joystick_controller

sudo docker build -t pitank_joystick .