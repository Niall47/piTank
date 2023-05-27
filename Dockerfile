FROM balenalib/raspberry-pi-debian:latest

RUN apt-get update && apt-get install -y build-essential wget sudo python-is-python2 unzip tar
RUN wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v12.21.0.sh | bash
RUN wget https://github.com/joan2937/pigpio/archive/master.zip \
    && unzip master.zip \
    && cd pigpio-master \
    && make \
    && make install
WORKDIR /app
COPY package*.json ./
RUN sudo npm install --production
COPY piTank.js ./
RUN chmod +x piTank.js

CMD [ "node", "piTank.js" ]