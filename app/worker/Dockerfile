FROM node:12-alpine
WORKDIR /usr/src/app/worker
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "mdata-worker.js" ]