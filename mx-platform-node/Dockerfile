FROM node:lts-alpine
WORKDIR /app
COPY mx-platform-node/package*.json ./
RUN npm i
COPY mx-platform-node/ .
EXPOSE 8000
CMD ["npm","start"]
