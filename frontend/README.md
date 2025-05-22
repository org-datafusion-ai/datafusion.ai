# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description
This project is a React frontend app for extracting and storing structured data from various document formats (PDF, Word, Excel, txt).

## Project setup
```bash
$ npm install
```
## Install Libraries
### installation cmd
*Install NestJS CLI and TypeScript globally for backend 
development*
```bash
npm i -g typescript @nestjs/cli
```
*Install Axios for making HTTP requests (connecting with the backend)*
```bash
npm install axios
```
*Install Ag-Grid for advanced data tables in React*
```bash
npm install ag-grid-community ag-grid-react
```
*Install FilePond for handling file uploads in React*
```bash
npm install filepond react-filepond
```
*Install FilePond plugins for additional features:*
*Validate file size before upload*
```bash
npm install filepond-plugin-file-validate-size
``` 
*Show image previews in FilePond* 
```bash
npm install filepond-plugin-image-preview 
``` 
*Enable PDF preview in FilePond*     
```bash
npm install filepond-plugin-pdf-preview 
```               

*To install all required dependencies at once, use the following command:*
```bash
npm install @heroicons/react @testing-library/dom @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest @types/node @types/react @types/react-dom ag-grid-community ag-grid-react axios filepond filepond-plugin-file-validate-size filepond-plugin-image-preview filepond-plugin-pdf-preview react react-dom react-filepond react-router-dom react-scripts react-toastify typescript web-vitals autoprefixer postcss @types/axios @types/react-router-dom @types/react-toastify
```
## Compile and run the project
### 1. Run Locally

#### Deployment:
In the project directory, you can run:
 `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

#### Run tests:
`npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### Build for Production:
`npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### 2. Run on Azure 
Please refer to the backend README.md file for details on Azure deployment.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
