
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
    - [Step 1: Log in to your Azure account](#step-1-log-in-to-your-azure-account)
    - [Step 2: Run the deployment script](#step-2-run-the-deployment-script)
  - [🐳 Docker Setup](#-docker-setup)
    - [🚀 Common Docker Commands](#-common-docker-commands)
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

- Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- Add MongoDB to system PATH
- Start MongoDB with `mongod`
- Check version with `mongo --version`

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

To deploy the application to Azure:

### Step 1: Log in to your Azure account

   ```bash
   az login
   ```

### Step 2: Run the deployment script

Make sure this is executable

   ```bash
   ./build.sh
   ```

---

## 🐳 Docker Setup

This `docker-compose` configuration is optimized for **local development**.

> ⚠️ Any changes to the source code — including frontend updates — require rebuilding the containers to reflect the updates.

---

### 🚀 Common Docker Commands

```bash
# Rebuild and start containers
docker-compose up --build

# Start containers without rebuilding
docker-compose up

# Stop all running containers
docker-compose down

```

---

## 📝 License

NestJS is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---
