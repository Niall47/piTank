# piTank

This was written to run on a Devastator tank platform with a raspberry pi zero w.
Currently it is driven using a single joystick, I'm not good at maths so there are a selection of different driving modes each with their own flaws.
It uses piSugar LiPo to power the pi and a 6 cell AA battery pack powers the motors with an L928N H bridge to distribute power.

## Install

You can run it locally or just use docker to run it for you

# Docker

`curl -sSL https://get.docker.com | sh`

`sudo python3 -m pip install docker-compose`

`sudo docker compose up`

# Local

`wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v11.5.0.sh | bash`

`sudo apt-get install python-is-python2`

`wget https://github.com/joan2937/pigpio/archive/master.zip`

`unzip master.zip`

`cd pigpio-master`

`make`

`make install`

`cd gpio_controller`

`sudo npm install`

`sudo node piTank.js`


## Control

Open index.html on any device you want. If you're running through docker it should be accesible through the ip address of the tank.
If it can't connect to the tank on localhost you can enter your own IP.
By default, it runs on port 8081.
