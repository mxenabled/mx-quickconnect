FROM node:16-alpine3.15
WORKDIR /app
COPY frontend/package*.json ./
RUN npm i
COPY frontend/ .
EXPOSE 3000
CMD ["npm","start"]
