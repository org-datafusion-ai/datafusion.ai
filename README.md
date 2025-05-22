
## Description
This project is a NestJS backend API server for extracting and storing structured data from various document formats (PDF, Word, Excel, txt). The extracted content is stored in **Azure Cosmos DB** using MongoDB.

## Project setup
## For more detail, visit https://t222.atlassian.net/wiki/x/AQAx (1. Required Packages and Apps 2. Local Environment. )

```bash
$ npm install
```

## Install Required Libraries
### installation cmd
*nest.js*
```bash
npm i -g typescript @nestjs/cli
```
*connect with the front end*
```bash
npm install axios
```
*Encode pdf files.*
```bash
npm install pdf-parse
```
*Encode word files.*
```bash
npm install mammoth
```
*Encode Excel files.*
```bash
npm install xlsx 
```
*For openAI prompt*
```bash
npm i openai axios
```
### Database installation cmd
*most popular MongoDB object modeling tool.*
```bash
npm i @nestjs/mongoose mongoose
```
*upload files*
```bash
npm install --save-dev @types/express @types/multer
```
*Azure cosmos DB*
```bash
npm i --save @nestjs/azure-database 
```
*make sure the .env file can get access*
```bash
npm install @nestjs/config 
```
## Database setup
This guide explains how to set up MongoDB for your application, both locally and on Azure Cosmos DB using the MongoDB API. Follow the steps based on your environment.
### Local MongoDB Setup
* Prerequisites
Install MongoDB Community Edition:
Download and install MongoDB from the official MongoDB website.
Ensure MongoDB is added to your system's PATH for command-line access (mongo and mongod commands).
Start the MongoDB service (mongod) and verify the installation using mongo --version.
* Install MongoDB Compass (Optional):
For a graphical user interface, download and install MongoDB Compass.

### Azure Cosmos DB (MongoDB API) Setup 
* Update your .env file:
```bash
DB_USERNAME=datafusion-ai-server
DB_PASSWORD=PRIMARY PASSWORD from Azure portal
DB_URI=PRIMARY CONNECTION STRING from Azure portal
```
**Make sure add the .env file name in .gitignore file for security.**
* Ensure your client IP is whitelisted in the Azure Cosmos DB Networking settings.

###  Switching Between Local and Azure
Uncomment the block of code to use either the local or Azure MongoDB instance in app.module.ts file.


## Compile and run the project
### Run locally
#### Deployment:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Run tests:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
###  Run on Azure

### For deployment environment set up, please visit https://t222.atlassian.net/wiki/x/AoBZAg for more info.

#### Deployment:
1. Created a docker-compose.yml file at the root folder use the format:
```
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: mongodb
    ports:
      - "27017:27017"
    command: ["--replSet", "rs0", "--bind_ip_all"]
    volumes:
      - mongo-data:/data/db
    restart: always
  mongo-init:
    image: mongo:6.0
    depends_on:
      - mongodb
    entrypoint: >
      bash -c "
        echo 'Waiting for MongoDB to be ready...' &&
        sleep 5 &&
        mongosh --host mongodb --eval '
          try {
            rs.initiate({
              _id: \"rs0\",
              members: [{ _id: 0, host: \"mongodb:27017\" }]
            });
          } catch(e) { print(e); }
          sleep(1000);
          db.getSiblingDB(\"admin\").createUser({
            user: \"mongoadmin\",
            pwd: \"secret\",
            roles: [{ role: \"root\", db: \"admin\" }]
          });
        '
      "
    restart: "no"
  backend:
    build:
      args:
        - REACT_APP_API_HOST=http://localhost/api
      context: ./
    image: datafusion.azurecr.io/datafusionai:latest
    ports:
      - "80:80"
    environment:
      - PORT=80
      - CORS=http://localhost
      - DB_USERNAME=datafusion-ai-server
      - DB_PASSWORD=
      - DB_URI=mongodb://datafusion-ai-server:DB_PASSWORD@datafusion-ai-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@datafusion-ai-server@
      - AZURE_GPT4_API_KEY=
      - AZURE_GPT4_ENDPOINT=https://datafusion-azureopenai.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2025-01-01-preview
      - mongo-init
    restart: always
volumes:
  mongo-data:

```

2. Update the `docker-compose.yml` file with your authentication tokens (`DB_PASSWORD`, `AZURE_GPT4_API_KEY`). You can find these tokens in your Azure portal.

3. Created a dockerfile with the format below in the root folder if it is not exist:
```
FROM node:23 AS frontend
ARG REACT_APP_API_HOST='http://datafusion/api'
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend .
ENV REACT_APP_API_HOST=$REACT_APP_API_HOST
RUN npm run build
FROM node:23 as backend
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend .
RUN npm run build
FROM node:23
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install --omit=dev
COPY --from=frontend /app/build ./public
COPY --from=backend /app/dist ./dist
ENV DB_URI='mongodb://localhost/datafusion'
ENV PORT=80
ENV CORS='http://localhost'
ENV JWT_SECRET=''
EXPOSE $PORT
CMD ["node", "dist/main"]
```
4. Docker cmd 

* Build and start the container:
```bash
// When you have made changes to the code:
docker-compose up --build
```

// When you haven't made any changes and just want to test the app
```bash
docker-compose up
```

* Stop the containers
```bash
docker-compose down
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
