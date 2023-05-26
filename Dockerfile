FROM balenalib/raspberry-pi-debian:latest

RUN apt-get update && apt-get install -y build-essential wget python3 python3-dev unzip
RUN wget https://github.com/joan2937/pigpio/archive/master.zip \
    && unzip master.zip \
    && rm master.zip
RUN cd pigpio-master \
    && make \
    && make install
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY piTank.js ./
RUN chmod +x piTank.js

CMD [ "node", "piTank.js" ]