FROM node:10

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY piTank.js ./
COPY setup.sh ./

RUN chmod +x setup.sh
RUN ./setup.sh
CMD [ "sudo", "node", "piTank.js" ]
