
# Datafusion.AI

This project is a **NestJS backend API** server for extracting and storing structured data from various document formats (**PDF**, **Word**, **Excel**, **txt**). Extracted content is stored in **Azure Cosmos DB** using MongoDB.

---

## 📚 Table of Contents

- [Datafusion.AI](#datafusionai)
  - [📚 Table of Contents](#-table-of-contents)
  - [🛠️ Project Setup](#️-project-setup)
  - [📦 Install Required Libraries](#-install-required-libraries)
    - [Global Setup](#global-setup)
    - [Frontend Integration](#frontend-integration)
    - [Document Parsing](#document-parsing)
    - [AI Integration](#ai-integration)
    - [MongoDB \& Uploads](#mongodb--uploads)
    - [Azure Integration](#azure-integration)
    - [Environment Configuration](#environment-configuration)
  - [🗄️ Database Setup](#️-database-setup)
    - [Local MongoDB Setup](#local-mongodb-setup)
    - [Azure Cosmos DB (MongoDB API) Setup](#azure-cosmos-db-mongodb-api-setup)
    - [Switching Between Local and Azure](#switching-between-local-and-azure)
  - [🚀 Compile and Run the Project](#-compile-and-run-the-project)
    - [Run Locally](#run-locally)
    - [Run Tests](#run-tests)
  - [☁️ Run on Azure](#️-run-on-azure)
  - [🐳 Docker Setup](#-docker-setup)
    - [Step 1: `docker-compose.yml` (Root Directory)](#step-1-docker-composeyml-root-directory)
    - [Step 2: Dockerfile](#step-2-dockerfile)
    - [Step 3: Docker Commands](#step-3-docker-commands)
  - [📝 License](#-license)

---

## 🛠️ Project Setup

For detailed instructions, visit: [Confluence Wiki](https://t222.atlassian.net/wiki/x/AQAx)  
Sections:  
1. Required Packages and Apps  
2. Local Environment  

Install dependencies:
```bash
npm install
````

---

## 📦 Install Required Libraries

### Global Setup

```bash
npm i -g typescript @nestjs/cli
```

### Frontend Integration

```bash
npm install axios
```

### Document Parsing

```bash
npm install pdf-parse       # PDF
npm install mammoth         # Word (.docx)
npm install xlsx            # Excel (.xlsx)
```

### AI Integration

```bash
npm install openai axios
```

### MongoDB & Uploads

```bash
npm install @nestjs/mongoose mongoose
npm install --save-dev @types/express @types/multer
```

### Azure Integration

```bash
npm install @nestjs/azure-database
```

### Environment Configuration

```bash
npm install @nestjs/config
```

---

## 🗄️ Database Setup

### Local MongoDB Setup

**Prerequisites**:

* Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
* Add MongoDB to system PATH
* Start MongoDB with `mongod`
* Check version with `mongo --version`

**Optional**:
Install [MongoDB Compass](https://www.mongodb.com/products/compass) for GUI-based interaction.

---

### Azure Cosmos DB (MongoDB API) Setup

Update your `.env` file:

```env
DB_USERNAME=datafusion-ai-server
DB_PASSWORD=YOUR_AZURE_PRIMARY_PASSWORD
DB_URI=YOUR_AZURE_PRIMARY_CONNECTION_STRING
```

✅ **Important**: Add `.env` to your `.gitignore`.

Ensure your IP is whitelisted in Azure Cosmos DB > Networking settings.

---

### Switching Between Local and Azure

Toggle between local and cloud DB in `app.module.ts` by commenting/uncommenting the relevant MongoDB connection block.

---

## 🚀 Compile and Run the Project

### Run Locally

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod
```

### Run Tests

```bash
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:cov     # Test coverage
```

---

## ☁️ Run on Azure

Refer to: [Deployment Environment Setup](https://t222.atlassian.net/wiki/x/AoBZAg)

---

## 🐳 Docker Setup

### Step 1: `docker-compose.yml` (Root Directory)

```yaml
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
        echo 'Waiting for MongoDB...' &&
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
    restart: always

volumes:
  mongo-data:
```

---

### Step 2: Dockerfile

```Dockerfile
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

---

### Step 3: Docker Commands

```bash
# Rebuild and start containers
docker-compose up --build

# Start containers without rebuild
docker-compose up

# Stop all containers
docker-compose down
```

---

## 📝 License

NestJS is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```

You can now copy and paste this Markdown content into your README.md or documentation editor. Let me know if you need this converted to `.md` file format or styled for Confluence.
```
