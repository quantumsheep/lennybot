FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY app.js ./
COPY lennys.js ./

COPY adnlenny.gif ./

CMD node .
