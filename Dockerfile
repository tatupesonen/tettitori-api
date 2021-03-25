FROM node:alpine
EXPOSE 80

RUN mkdir /opt/tettitori-api

ADD ./src /opt/tettitori-api/src
ADD ./data /opt/tettitori-api/data

ADD ./package-lock.json /opt/tettitori-api
ADD ./package.json /opt/tettitori-api
ADD ./tsconfig.json /opt/tettitori-api

WORKDIR /opt/tettitori-api

RUN npm ci
RUN npm run build
ENTRYPOINT npm run start
