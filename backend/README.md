<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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
npm i -g typescript @nestjs/cli

*connect with the front end*
npm install axios

*Encode pdf files.*
npm install pdf-parse

*Encode word files.*
npm install mammoth

*Encode Excel files.*
npm install xlsx 

*For openAI prompt*
npm i openai axios

### Database installation cmd
*most popular MongoDB object modeling tool.*
npm i @nestjs/mongoose mongoose

*upload files*
npm install --save-dev @types/express @types/multer

*Azure cosmos DB*
npm i --save @nestjs/azure-database 

*make sure the .env file can get access*
npm install @nestjs/config 

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
please rafer to the 
* Update your .env file:
DB_USERNAME=datafusion-ai-server
DB_PASSWORD=PRIMARY PASSWORD from Azure portal
DB_URI=PRIMARY CONNECTION STRING from Azure portal

**Make sure add the .env file name in .gitignore file for security.**
* Ensure your client IP is whitelisted in the Azure Cosmos DB Networking settings.

3. Switching Between Local and Azure
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
// When you have made changes to the code:
docker-compose up --build
// When you haven't made any changes and just want to test the app
docker-compose up

* Stop the containers
docker-compose down


## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
