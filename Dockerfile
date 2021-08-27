# Base image used  
FROM node:alpine 

#Copy required code
COPY . /timeseries-app

#Install build essentials for redis
RUN apk add musl-dev gcc make g++ zlib-dev linux-headers

#Redis Installation script
RUN sh /timeseries-app/install-redis.sh

#Setting Work Dir as timeseries-app
WORKDIR /timeseries-app

#Installing node_modules
RUN npm install

EXPOSE 3000

#Deploying App With redis
CMD ["sh", "-c", "redis-server > /dev/null 2>&1 & node server.js"]