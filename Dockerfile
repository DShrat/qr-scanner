# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /app

COPY src/ /qr-scan/src
COPY package.json /qr-scan/
COPY . .

RUN npm install

RUN npm run build

EXPOSE 3013

CMD [ "npm", "start" ]